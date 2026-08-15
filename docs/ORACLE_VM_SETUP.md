# Oracle Cloud VM — one-time setup

Target: 4 OCPU / 24 GB RAM Oracle Cloud compute instance, Ubuntu 22.04 or 24.04.
Do this once. After it's done, every deploy is just a push to `prod`.

---

## 1. Open the ports

Oracle blocks traffic in **two** places. Both must be opened or the site stays unreachable —
this is the single most common reason an Oracle VM "doesn't work".

### 1a. Security List / NSG (Oracle console)

Networking → Virtual Cloud Networks → your VCN → Security Lists → default → **Add Ingress Rules**:

| Source CIDR | Protocol | Dest. port | Purpose |
|---|---|---|---|
| `0.0.0.0/0` | TCP | 80 | HTTP + ACME challenge |
| `0.0.0.0/0` | TCP | 443 | HTTPS |
| `0.0.0.0/0` | UDP | 443 | HTTP/3 (optional) |

Leave port 22 restricted to your own IP if you can.

### 1b. The VM's own firewall

Ubuntu images on Oracle ship with iptables rules that drop everything but SSH.

```bash
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 443 -j ACCEPT
sudo iptables -I INPUT 6 -m state --state NEW -p udp --dport 443 -j ACCEPT
sudo netfilter-persistent save
```

Verify: `sudo iptables -L INPUT -n --line-numbers | head -20`

---

## 2. Install Docker

```bash
sudo apt-get update && sudo apt-get upgrade -y
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker "$USER"
newgrp docker            # or log out and back in
docker compose version   # expect v2.x
```

---

## 3. Add swap

24 GB is plenty, but swap prevents an OOM kill during `npm`-heavy or migration-heavy moments.

```bash
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile && sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

---

## 4. Create the app directory

```bash
sudo mkdir -p /opt/vokim/{caddy,backups}
sudo chown -R "$USER:$USER" /opt/vokim
```

The deploy workflow copies `docker-compose.prod.yml` and `caddy/Caddyfile` here on every run.
It never touches `.env` — that file is yours and lives only on this machine.

---

## 5. Create `/opt/vokim/.env`

Copy `infra/.env.example` from the repo and fill in every `CHANGE_ME`.

```bash
# generate a Django secret key
docker run --rm python:3.12-slim python -c \
  "import secrets,string; print(''.join(secrets.choice(string.ascii_letters+string.digits+'!@#%^&*(-_=+)') for _ in range(64)))"

# generate strong passwords for Postgres and MinIO
openssl rand -base64 32
```

```bash
chmod 600 /opt/vokim/.env
```

**Every secret in the old `settings.py` must be rotated, not reused** — they were committed
to a public GitHub repo. See `docs/MIGRATION.md`, step 0.

---

## 6. Add the deploy SSH key to GitHub

On your laptop:

```bash
ssh-keygen -t ed25519 -f ~/.ssh/vokim_deploy -C "github-actions-deploy" -N ""
ssh-copy-id -i ~/.ssh/vokim_deploy.pub ubuntu@<VM_PUBLIC_IP>
cat ~/.ssh/vokim_deploy        # this is the value for OCI_SSH_KEY
```

Then in GitHub → Settings → Secrets and variables → Actions → **New repository secret**:

| Secret | Value |
|---|---|
| `OCI_HOST` | VM public IP |
| `OCI_USER` | `ubuntu` (Ubuntu images) or `opc` (Oracle Linux) |
| `OCI_SSH_KEY` | full contents of `~/.ssh/vokim_deploy`, including the BEGIN/END lines |
| `OCI_SSH_PORT` | `22` (optional) |
| `OCI_APP_DIR` | `/opt/vokim` (optional) |

`GITHUB_TOKEN` is injected automatically and is what pushes images to ghcr.io — you do not create it.

---

## 7. Make the GHCR packages readable by the VM

The first successful deploy publishes two packages. Then, on GitHub:

**Your profile → Packages → `backend` → Package settings → Danger Zone → Change visibility → Public**
(and the same for `frontend`).

Keeping them private also works, but then the VM needs its own PAT to `docker login ghcr.io`.
Public is simpler and these images contain no secrets.

---

## 8. First boot

```bash
cd /opt/vokim
# copy docker-compose.prod.yml and caddy/Caddyfile here manually the first time,
# or just push to prod and let the workflow deliver them.
docker compose --env-file .env -f docker-compose.prod.yml up -d
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs -f caddy
```

Caddy requests a Let's Encrypt certificate the moment DNS points at the VM.
Watch the `caddy` logs for `certificate obtained successfully`.

---

## 9. Create the Django admin user

```bash
cd /opt/vokim
docker compose -f docker-compose.prod.yml exec backend python manage.py createsuperuser
```

---

## 10. Lock down the MinIO console

`https://vokim.ca/minio/` is exposed so you can upload gallery images through a browser.
Once you're done with the initial upload, either delete the `handle /minio/*` block from
`infra/caddy/Caddyfile`, or restrict it:

```caddyfile
handle /minio/* {
    @notme not remote_ip <YOUR_HOME_IP>
    respond @notme 403
    reverse_proxy minio:9001
}
```

---

## Resource budget on a 24 GB VM

| Service | Limit | Typical |
|---|---|---|
| postgres | 4 GB | ~300 MB |
| backend (gunicorn ×4) | 3 GB | ~600 MB |
| minio | 2 GB | ~300 MB |
| imgproxy | 1 GB | ~150 MB |
| redis | 768 MB | ~50 MB |
| frontend (nginx) | 512 MB | ~20 MB |
| caddy | — | ~30 MB |

Roughly 1.5 GB in use, ~11 GB of hard limits. Plenty of headroom.
