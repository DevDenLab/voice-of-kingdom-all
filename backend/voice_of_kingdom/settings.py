"""
Django settings for the voice_of_kingdom project.

Everything environment-specific is read from environment variables.
Nothing secret belongs in this file -- see infra/.env.example for the full list.
"""

import os
from pathlib import Path

import dj_database_url
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent

# Load a local .env when running outside Docker (Docker injects real env vars).
load_dotenv(BASE_DIR / ".env")


def env_bool(name: str, default: bool = False) -> bool:
    return os.getenv(name, str(default)).strip().lower() in {"1", "true", "yes", "on"}


def env_list(name: str, default: str = "") -> list[str]:
    return [item.strip() for item in os.getenv(name, default).split(",") if item.strip()]


# ---------------------------------------------------------------------------
# Core
# ---------------------------------------------------------------------------

SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY")
DEBUG = env_bool("DJANGO_DEBUG", False)

if not SECRET_KEY:
    if DEBUG:
        SECRET_KEY = "django-insecure-dev-only-do-not-use-in-production"
    else:
        raise RuntimeError(
            "DJANGO_SECRET_KEY is required when DJANGO_DEBUG is off. "
            "Generate one with: python -c \"from django.core.management.utils import "
            "get_random_secret_key as g; print(g())\""
        )

ALLOWED_HOSTS = env_list(
    "DJANGO_ALLOWED_HOSTS",
    "vokim.ca,www.vokim.ca,localhost,127.0.0.1,backend",
)

CSRF_TRUSTED_ORIGINS = env_list(
    "DJANGO_CSRF_TRUSTED_ORIGINS",
    "https://vokim.ca,https://www.vokim.ca,http://localhost:3000",
)

CORS_ALLOWED_ORIGINS = env_list(
    "DJANGO_CORS_ALLOWED_ORIGINS",
    "https://vokim.ca,https://www.vokim.ca,http://localhost:3000",
)
CORS_ALLOW_ALL_ORIGINS = env_bool("DJANGO_CORS_ALLOW_ALL", DEBUG)
CORS_ALLOW_CREDENTIALS = True

ROOT_URLCONF = "voice_of_kingdom.urls"
WSGI_APPLICATION = "voice_of_kingdom.wsgi.application"
ASGI_APPLICATION = "voice_of_kingdom.asgi.application"
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "corsheaders",
    "storages",
    "apis",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

# ---------------------------------------------------------------------------
# Database -- Postgres container on the Oracle VM (was Heroku Postgres)
# ---------------------------------------------------------------------------

DATABASE_URL = os.getenv("DATABASE_URL") or (
    "postgres://{user}:{password}@{host}:{port}/{name}".format(
        user=os.getenv("POSTGRES_USER", "vokim"),
        password=os.getenv("POSTGRES_PASSWORD", "vokim"),
        host=os.getenv("POSTGRES_HOST", "postgres"),
        port=os.getenv("POSTGRES_PORT", "5432"),
        name=os.getenv("POSTGRES_DB", "vokim"),
    )
)

DATABASES = {
    "default": dj_database_url.parse(
        DATABASE_URL,
        conn_max_age=int(os.getenv("DB_CONN_MAX_AGE", "600")),
        conn_health_checks=True,
        ssl_require=env_bool("DB_SSL_REQUIRE", False),
    )
}

# ---------------------------------------------------------------------------
# Cache -- Redis container, falls back to in-process for local dev
# ---------------------------------------------------------------------------

REDIS_URL = os.getenv("REDIS_URL")
if REDIS_URL:
    CACHES = {
        "default": {
            "BACKEND": "django.core.cache.backends.redis.RedisCache",
            "LOCATION": REDIS_URL,
        }
    }
else:
    CACHES = {
        "default": {
            "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
            "LOCATION": "vokim-local",
        }
    }

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

LANGUAGE_CODE = "en-us"
TIME_ZONE = os.getenv("DJANGO_TIME_ZONE", "America/Edmonton")
USE_I18N = True
USE_TZ = True

# ---------------------------------------------------------------------------
# Static files -- Django only serves its own admin/DRF assets now.
# The React bundle is served by the frontend nginx container.
# ---------------------------------------------------------------------------

STATIC_URL = "/django-static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
STORAGES = {
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
    },
}

# ---------------------------------------------------------------------------
# Media -- MinIO (S3-compatible), replacing Cloudinary
# ---------------------------------------------------------------------------

USE_S3_MEDIA = env_bool("USE_S3_MEDIA", True)

AWS_STORAGE_BUCKET_NAME = os.getenv("S3_BUCKET", "vokim-media")
AWS_S3_ENDPOINT_URL = os.getenv("S3_ENDPOINT_URL", "http://minio:9000")
AWS_S3_CUSTOM_DOMAIN = os.getenv("S3_PUBLIC_DOMAIN") or None
AWS_ACCESS_KEY_ID = os.getenv("S3_ACCESS_KEY", "")
AWS_SECRET_ACCESS_KEY = os.getenv("S3_SECRET_KEY", "")
AWS_S3_REGION_NAME = os.getenv("S3_REGION", "us-east-1")
AWS_S3_ADDRESSING_STYLE = os.getenv("S3_ADDRESSING_STYLE", "path")
AWS_S3_SIGNATURE_VERSION = "s3v4"
AWS_QUERYSTRING_AUTH = env_bool("S3_QUERYSTRING_AUTH", False)
AWS_DEFAULT_ACL = None
AWS_S3_FILE_OVERWRITE = False
AWS_S3_OBJECT_PARAMETERS = {"CacheControl": "public, max-age=31536000"}

# Public base path the browser uses to reach media, proxied by Caddy.
MEDIA_URL = os.getenv("MEDIA_URL", "/media/")
# Base path the browser uses to reach imgproxy, proxied by Caddy.
IMGPROXY_BASE_URL = os.getenv("IMGPROXY_BASE_URL", "/img")

if USE_S3_MEDIA:
    STORAGES["default"] = {"BACKEND": "storages.backends.s3.S3Storage"}
else:
    STORAGES["default"] = {"BACKEND": "django.core.files.storage.FileSystemStorage"}
    MEDIA_ROOT = BASE_DIR / "media"

# Prefix inside the bucket that the public gallery reads from.
GALLERY_PREFIX = os.getenv("GALLERY_PREFIX", "gallery/")

# ---------------------------------------------------------------------------
# Email
# ---------------------------------------------------------------------------

EMAIL_BACKEND = os.getenv(
    "EMAIL_BACKEND", "django.core.mail.backends.smtp.EmailBackend"
)
EMAIL_HOST = os.getenv("EMAIL_HOST", "smtp.office365.com")
EMAIL_PORT = int(os.getenv("EMAIL_PORT", "587"))
EMAIL_USE_TLS = env_bool("EMAIL_USE_TLS", True)
EMAIL_HOST_USER = os.getenv("EMAIL_HOST_USER", "")
EMAIL_HOST_PASSWORD = os.getenv("EMAIL_HOST_PASSWORD", "")
DEFAULT_FROM_EMAIL = os.getenv("DEFAULT_FROM_EMAIL", EMAIL_HOST_USER)
ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", EMAIL_HOST_USER)

# ---------------------------------------------------------------------------
# Security -- TLS is terminated by Caddy, which forwards X-Forwarded-Proto
# ---------------------------------------------------------------------------

SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
SECURE_SSL_REDIRECT = env_bool("DJANGO_SECURE_SSL_REDIRECT", not DEBUG)
SESSION_COOKIE_SECURE = not DEBUG
CSRF_COOKIE_SECURE = not DEBUG
SECURE_HSTS_SECONDS = int(os.getenv("DJANGO_HSTS_SECONDS", "0" if DEBUG else "31536000"))
SECURE_HSTS_INCLUDE_SUBDOMAINS = not DEBUG
SECURE_HSTS_PRELOAD = not DEBUG
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_REFERRER_POLICY = "no-referrer-when-downgrade"
X_FRAME_OPTIONS = "SAMEORIGIN"  # YouTube iframe embeds

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "verbose": {"format": "[{levelname}] {asctime} {name}: {message}", "style": "{"},
    },
    "handlers": {
        "console": {"class": "logging.StreamHandler", "formatter": "verbose"},
    },
    "root": {"handlers": ["console"], "level": os.getenv("LOG_LEVEL", "INFO")},
    "loggers": {
        "django.request": {"handlers": ["console"], "level": "ERROR", "propagate": False},
    },
}
