#!/usr/bin/env bash
set -euo pipefail

echo "[entrypoint] waiting for postgres at ${POSTGRES_HOST:-postgres}:${POSTGRES_PORT:-5432}..."
python - <<'PY'
import os, socket, sys, time
host = os.getenv("POSTGRES_HOST", "postgres")
port = int(os.getenv("POSTGRES_PORT", "5432"))
deadline = time.time() + 90
while time.time() < deadline:
    try:
        with socket.create_connection((host, port), timeout=3):
            print("[entrypoint] postgres is up")
            sys.exit(0)
    except OSError:
        time.sleep(2)
print("[entrypoint] postgres never became reachable", file=sys.stderr)
sys.exit(1)
PY

if [ "${RUN_MIGRATIONS:-1}" = "1" ]; then
  echo "[entrypoint] running migrations"
  python manage.py migrate --noinput
fi

if [ "${RUN_COLLECTSTATIC:-1}" = "1" ]; then
  echo "[entrypoint] collecting static"
  python manage.py collectstatic --noinput --clear
fi

if [ -n "${DJANGO_SUPERUSER_USERNAME:-}" ] && [ -n "${DJANGO_SUPERUSER_PASSWORD:-}" ]; then
  echo "[entrypoint] ensuring superuser exists"
  python manage.py createsuperuser --noinput || true
fi

echo "[entrypoint] starting: $*"
exec "$@"
