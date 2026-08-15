# Voice of Kingdom (vokim.ca)

Django REST API + React SPA, containerized and deployed to an Oracle Cloud VM
via GitHub Actions.

```
.
├── backend/            Django 4.2 + DRF  (gunicorn, Dockerfile)
├── frontend/           React 18 SPA      (nginx, multi-stage Dockerfile)
├── infra/              docker-compose.prod.yml, Caddyfile, .env.example
├── docs/               setup + migration + DNS runbooks
├── .github/workflows/  ci.yml (develop) and deploy.yml (prod)
└── docker-compose.yml  local development stack
```

## Stack

| Concern | Service |
|---|---|
| Reverse proxy + TLS | Caddy (automatic Let's Encrypt) |
| Frontend | React 18, built by CRA, served by nginx |
| Backend | Django 4.2 + DRF, gunicorn (4 workers × 2 threads) |
| Database | Postgres 16 |
| Cache | Redis 7 |
| Object storage | MinIO (S3-compatible) |
| Image transforms | imgproxy |
| Registry | ghcr.io |

## Branches

Only two, and they are the whole workflow:

- **`develop`** — the working branch. Everything lands here first. Pushing runs CI
  (lint, Django checks, migration drift, tests, React build, Docker builds).
- **`prod`** — what is live. Merging `develop` into `prod` and pushing triggers a real
  deploy to the Oracle VM.

```bash
# day to day
git checkout develop
# ...work...
git push origin develop        # CI runs

# ship it
git checkout prod && git merge develop && git push origin prod
```

## Local development

```bash
docker compose up --build
```

| Service | URL |
|---|---|
| React (hot reload) | http://localhost:3000 |
| Django API | http://localhost:8000/api/ |
| Django admin | http://localhost:8000/admin/ |
| MinIO console | http://localhost:9001 (`vokim-admin` / `vokim-admin-dev-password`) |
| imgproxy | http://localhost:8080 |

Create an admin user:
```bash
docker compose exec backend python manage.py createsuperuser
```

Without Docker:
```bash
cd backend && python -m venv .venv && .venv/bin/pip install -r requirements.txt
DJANGO_DEBUG=True USE_S3_MEDIA=False .venv/bin/python manage.py runserver

cd frontend && npm ci && npm start
```

## Routing in production

Caddy fronts everything on one domain, so the browser sees a single origin
(no CORS in normal operation):

| Path | Goes to |
|---|---|
| `/api/*`, `/admin/*`, `/csrf/*`, `/healthz` | Django |
| `/django-static/*` | Django (admin + DRF assets, via WhiteNoise) |
| `/img/*` | imgproxy — resized images |
| `/media/*` | MinIO — original files, PDFs |
| `/minio/*` | MinIO console (restrict this, see the setup doc) |
| everything else | React SPA |

## Images

Cloudinary is gone. Images live in the MinIO bucket and are resized on request by imgproxy.

```js
import { imageUrl, galleryUrl } from "./lib/imageUrl";

galleryUrl("gallery/choir.jpg");
// -> /img/insecure/rs:fill:800:800:0/g:sm/q:80/<base64url>.webp

imageUrl("gallery/choir.jpg", { width: 400, height: 300, format: "avif" });
```

imgproxy runs unsigned but is pinned to our own bucket with `IMGPROXY_ALLOWED_SOURCES`,
so it cannot be pointed at arbitrary URLs.

Django writes uploads to the same bucket through `django-storages`' S3 backend —
`FileField`/`ImageField` need no code changes.

## Configuration

Nothing secret is in the repo. `backend/voice_of_kingdom/settings.py` reads everything
from the environment, and refuses to boot with `DJANGO_DEBUG=False` and no
`DJANGO_SECRET_KEY`. See `infra/.env.example` for the full list; the real `.env` lives
only on the VM at `/opt/vokim/.env`.

## Docs

- [`docs/ORACLE_VM_SETUP.md`](docs/ORACLE_VM_SETUP.md) — provision the VM, ports, secrets
- [`docs/MIGRATION.md`](docs/MIGRATION.md) — move data and media off Heroku/Cloudinary
- [`docs/DNS_GODADDY_CUTOVER.md`](docs/DNS_GODADDY_CUTOVER.md) — point vokim.ca at the VM
