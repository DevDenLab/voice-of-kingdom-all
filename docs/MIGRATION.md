# Heroku → Oracle Cloud migration runbook

Do these in order. Steps 0–3 can happen days before the cutover; step 4 is the
only one users notice.

---

## Step 0 — Rotate every credential (do this first, today)

The old `backend/voice_of_kingdom/settings.py` had these committed **in a public repo**.
Anyone who ever cloned it has them. Rotate all of them before anything else:

| Credential | Where to rotate |
|---|---|
| Heroku Postgres URL + password | Heroku → Data → credentials → rotate (or just retire the DB after migration) |
| Cloudinary API key + secret | Cloudinary console → Settings → Access Keys (then close the account) |
| `info@vokim.ca` email password | Microsoft 365 admin → reset; prefer an app password |
| Django `SECRET_KEY` | generate new (see `ORACLE_VM_SETUP.md` §5) — this logs out all sessions |

> Rotating `SECRET_KEY` invalidates existing sessions and password-reset links. That's fine
> and expected; users just log in again.

Then, if you want the history scrubbed too:
```bash
# optional, rewrites history — coordinate with anyone else who has a clone
pipx install git-filter-repo
git filter-repo --path voice_of_kingdom/settings.py --invert-paths
```
Rotation is what actually protects you. History scrubbing is cleanup.

---

## Step 1 — Move the database

On your laptop, with the Heroku CLI logged in:

```bash
# 1. dump from Heroku
heroku pg:backups:capture --app <your-heroku-app>
heroku pg:backups:download --app <your-heroku-app>   # -> latest.dump

# 2. ship it to the VM
scp -i ~/.ssh/vokim_deploy latest.dump ubuntu@<VM_IP>:/opt/vokim/backups/
```

On the VM:

```bash
cd /opt/vokim
source .env   # or read the values manually

# make sure postgres is up and the schema exists (backend runs migrate on boot)
docker compose --env-file .env -f docker-compose.prod.yml up -d postgres backend

# restore data only, over the migrated schema
docker compose -f docker-compose.prod.yml exec -T postgres \
  pg_restore --clean --if-exists --no-owner --no-privileges --data-only \
  -U "$POSTGRES_USER" -d "$POSTGRES_DB" < backups/latest.dump
```

If `--data-only` fights the constraints, restore the whole thing instead and let it
recreate the schema:

```bash
docker compose -f docker-compose.prod.yml exec -T postgres \
  pg_restore --clean --if-exists --no-owner --no-privileges \
  -U "$POSTGRES_USER" -d "$POSTGRES_DB" < backups/latest.dump

docker compose -f docker-compose.prod.yml exec backend python manage.py migrate --fake-initial
```

Verify:
```bash
docker compose -f docker-compose.prod.yml exec backend python manage.py shell -c \
  "from apis.models import *; print('rows look sane')"
```

---

## Step 2 — Move the media off Cloudinary

Cloudinary → MinIO. The gallery reads everything under the `gallery/` prefix.

```bash
# 1. pull everything down from Cloudinary
pip install cloudinary requests
python3 - <<'PY'
import cloudinary, cloudinary.api, requests, os, pathlib
cloudinary.config(cloud_name="ddkeblfid", api_key="OLD_KEY", api_secret="OLD_SECRET")
out = pathlib.Path("cloudinary-export"); out.mkdir(exist_ok=True)
cursor = None
while True:
    r = cloudinary.api.resources(type="upload", resource_type="image",
                                 max_results=500, next_cursor=cursor)
    for res in r["resources"]:
        dest = out / (res["public_id"] + "." + res["format"])
        dest.parent.mkdir(parents=True, exist_ok=True)
        if not dest.exists():
            dest.write_bytes(requests.get(res["secure_url"]).content)
            print("saved", dest)
    cursor = r.get("next_cursor")
    if not cursor:
        break
PY
```

```bash
# 2. push into MinIO with the mc client
mc alias set vokim https://vokim.ca/minio <MINIO_ROOT_USER> <MINIO_ROOT_PASSWORD>
mc mirror --overwrite cloudinary-export/ vokim/vokim-media/gallery/
mc anonymous set download vokim/vokim-media
```

Or, if you'd rather not install `mc`, use the MinIO web console at `https://vokim.ca/minio/`
and drag the folder into the `vokim-media` bucket under a `gallery/` prefix.

**Also move the uploaded newsletters/PDFs** — the old repo tracked them under `media/apis/newsletters/`:

```bash
mc mirror media/apis/newsletters/ vokim/vokim-media/apis/newsletters/
```

Then confirm the API returns them:
```bash
curl -s https://vokim.ca/api/gallery-images/ | head -c 500
```

---

## Step 3 — Deploy the code

```bash
git checkout prod
git merge develop
git push origin prod
```

Watch the run in the Actions tab. It will:
1. build both images and push them to `ghcr.io`
2. copy compose + Caddyfile to the VM
3. back up Postgres
4. pull and restart
5. wait for `/healthz/`, then smoke-test `https://vokim.ca`

Before DNS is cut over, test with a hosts-file override on your laptop:

```
<VM_PUBLIC_IP>  vokim.ca www.vokim.ca
```
(`/etc/hosts` on macOS/Linux, `C:\Windows\System32\drivers\etc\hosts` on Windows.)

Click through every page: home, gallery, join, bookings, contact, donate, admin.
Submit one of each form and confirm the email lands.

---

## Step 4 — DNS cutover (GoDaddy)

See `docs/DNS_GODADDY_CUTOVER.md`.

---

## Step 5 — Decommission Heroku

Only after the new site has been serving live traffic for **at least 48 hours**:

```bash
heroku pg:backups:capture --app <app>          # one last dump
heroku pg:backups:download --app <app>         # keep it somewhere safe
heroku maintenance:on --app <app>              # soft-off for a few days first
# then, when you're confident:
heroku apps:destroy --app <app> --confirm <app>
```

Cancel Cloudinary separately.

---

## Rollback

If the new site misbehaves during the cutover window:

1. **DNS-level (fastest):** point the GoDaddy A record back at the Heroku IP / restore the CNAME.
   Heroku is still running because you haven't destroyed it yet. Propagation is minutes if
   you set a low TTL first (see the DNS doc).
2. **Image-level:** on the VM, set `IMAGE_TAG=<previous-sha>` in `/opt/vokim/.env` and run
   `docker compose --env-file .env -f docker-compose.prod.yml up -d`.
3. **Database-level:** every deploy writes `/opt/vokim/backups/pre-deploy-*.sql` before migrating.
   ```bash
   docker compose -f docker-compose.prod.yml exec -T postgres \
     psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" < backups/pre-deploy-<timestamp>.sql
   ```

---

## What changed architecturally

| Before (Heroku) | After (Oracle VM) |
|---|---|
| One dyno: Django served the React build via WhiteNoise + a catch-all template route | Two containers: nginx serves React, gunicorn serves Django. Caddy routes between them |
| Heroku Postgres (AWS RDS) | `postgres:16-alpine` container, volume-backed |
| Cloudinary for images | MinIO (storage) + imgproxy (transforms) |
| No cache | Redis container |
| Heroku SSL | Caddy + Let's Encrypt, auto-renewing |
| `git push heroku main` | push to `prod` → GitHub Actions → ghcr.io → SSH → `docker compose up -d` |
| Secrets in `settings.py` | Everything from env vars, `.env` lives only on the VM |
| `STATIC_URL = /static/` (collided with the React bundle) | Django static moved to `/django-static/` |
