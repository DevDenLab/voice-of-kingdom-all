"""
Gallery listing.

Was: cloudinary.api.resources()
Now: list objects in the MinIO bucket under GALLERY_PREFIX.

The response shape is unchanged, so the React Gallery component keeps working --
`publicId` is now an S3 object key instead of a Cloudinary public_id, and the
frontend turns it into a resized URL via imgproxy (see frontend/src/lib/imageUrl.js).
"""

import io
import json
import logging
import mimetypes
import os
import re
import secrets
from collections import defaultdict

import boto3
from botocore.client import Config
from botocore.exceptions import BotoCoreError, ClientError
from django.contrib.auth import authenticate, login, logout
from django.conf import settings
from django.core.cache import cache
from django.http import JsonResponse
from django.utils import timezone
from django.utils.decorators import method_decorator
from django.utils.text import slugify
from django.views.decorators.csrf import csrf_exempt, csrf_protect, ensure_csrf_cookie
from PIL import Image, UnidentifiedImageError
from rest_framework import status
from rest_framework.authentication import SessionAuthentication
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView

logger = logging.getLogger(__name__)

CACHE_TTL = 60 * 15  # 15 minutes
CACHE_KEY = "gallery_payload_v2"
IMAGE_EXTENSIONS = (".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif", ".heic")

# Section slug: lowercase words joined by single hyphens (what slugify produces).
SECTION_SLUG_RE = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
# Images sitting directly under GALLERY_PREFIX (no sub-folder) show under this.
LEGACY_SECTION_TITLE = "Uncategorised"


def _s3_client():
    return boto3.client(
        "s3",
        endpoint_url=settings.AWS_S3_ENDPOINT_URL,
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        region_name=settings.AWS_S3_REGION_NAME,
        config=Config(
            signature_version="s3v4",
            s3={"addressing_style": settings.AWS_S3_ADDRESSING_STYLE},
        ),
    )


def _is_image(key: str) -> bool:
    if key.endswith("/"):
        return False
    if key.lower().endswith(IMAGE_EXTENSIONS):
        return True
    guessed, _ = mimetypes.guess_type(key)
    return bool(guessed and guessed.startswith("image/"))


def healthz(request):
    """Liveness probe for Docker/Caddy. Deliberately does not touch the DB."""
    return JsonResponse({"status": "ok"})


# ---------------------------------------------------------------------------
# Gallery sections ("folders")
#
# An image lives at  gallery/<section-slug>/<name>-<rand>.<ext>
# The section's display title + creation time live in a single JSON manifest at
# gallery/.sections.json  ->  {"<slug>": {"title": "...", "created": "..."}}
# Images sitting directly under gallery/ (the pre-sections layout) are shown in
# a synthetic "Uncategorised" section (slug "").
# ---------------------------------------------------------------------------


def _manifest_key():
    return f"{settings.GALLERY_PREFIX}.sections.json"


def _load_manifest(client):
    try:
        obj = client.get_object(
            Bucket=settings.AWS_STORAGE_BUCKET_NAME, Key=_manifest_key()
        )
        data = json.loads(obj["Body"].read())
        return data if isinstance(data, dict) else {}
    except ClientError as exc:
        if exc.response.get("Error", {}).get("Code") in ("NoSuchKey", "404"):
            return {}
        raise
    except (BotoCoreError, ValueError, TypeError):
        logger.exception("Gallery: could not read sections manifest")
        return {}


def _save_manifest(client, data):
    client.put_object(
        Bucket=settings.AWS_STORAGE_BUCKET_NAME,
        Key=_manifest_key(),
        Body=json.dumps(data).encode(),
        ContentType="application/json",
        CacheControl="no-cache",
    )


def _iter_gallery_objects(client):
    params = {
        "Bucket": settings.AWS_STORAGE_BUCKET_NAME,
        "Prefix": settings.GALLERY_PREFIX,
        "MaxKeys": 1000,
    }
    while True:
        result = client.list_objects_v2(**params)
        yield from result.get("Contents", [])
        token = result.get("NextContinuationToken")
        if not token:
            break
        params["ContinuationToken"] = token


def _section_of(key):
    rel = key[len(settings.GALLERY_PREFIX):]
    parts = rel.split("/")
    return parts[0] if len(parts) >= 2 else ""


def _collect_gallery(client):
    """One bucket scan -> (sections_meta, images_by_section).

    sections_meta:      {slug: {"title": str, "created": str|None}}
    images_by_section:  {slug: [{"key","size","last_modified"}, ...]}  newest first
    """
    manifest = _load_manifest(client)
    images_by_section = defaultdict(list)
    seen = set()

    for obj in _iter_gallery_objects(client):
        key = obj["Key"]
        if key == _manifest_key() or not _is_image(key):
            continue
        slug = _section_of(key)
        seen.add(slug)
        images_by_section[slug].append(
            {
                "key": key,
                "size": obj["Size"],
                "last_modified": obj["LastModified"].isoformat(),
            }
        )

    for imgs in images_by_section.values():
        imgs.sort(key=lambda i: i["last_modified"], reverse=True)

    sections_meta = {}
    for slug in set(manifest) | seen:
        if slug == "":
            sections_meta[""] = {"title": LEGACY_SECTION_TITLE, "created": None}
            continue
        meta = manifest.get(slug) or {}
        sections_meta[slug] = {
            "title": meta.get("title") or slug.replace("-", " ").title(),
            "created": meta.get("created"),
        }
    return sections_meta, images_by_section


def _ordered_slugs(sections_meta):
    """Real sections by title, Z->A (so "... 2026" sits above "... 2025");
    the legacy "Uncategorised" bucket always last."""
    real = sorted(
        (s for s in sections_meta if s),
        key=lambda s: sections_meta[s]["title"].lower(),
        reverse=True,
    )
    return real + ([""] if "" in sections_meta else [])


def _image_alt(key):
    return key.rsplit("/", 1)[-1].rsplit(".", 1)[0].replace("-", " ")


def _build_public_payload(client):
    sections_meta, images_by_section = _collect_gallery(client)
    sections, flat = [], []
    for slug in _ordered_slugs(sections_meta):
        raw = images_by_section.get(slug, [])
        if slug == "" and not raw:
            continue
        imgs = [
            {
                "publicId": i["key"],
                "alt": _image_alt(i["key"]),
                "created": i["last_modified"],
                "size": i["size"],
                "url": f"{settings.MEDIA_URL.rstrip('/')}/{i['key']}",
            }
            for i in raw
        ]
        sections.append(
            {"slug": slug, "title": sections_meta[slug]["title"], "images": imgs}
        )
        flat.extend(imgs)
    return {"sections": sections, "images": flat}


def _admin_section_list(sections_meta, images_by_section):
    out = []
    for slug in _ordered_slugs(sections_meta):
        if slug == "" and not images_by_section.get(""):
            continue
        out.append(
            {
                "slug": slug,
                "title": sections_meta[slug]["title"],
                "count": len(images_by_section.get(slug, [])),
                "editable": slug != "",
            }
        )
    return out


@csrf_exempt
def get_gallery_images(request):
    # No @cache_page: it stamps Cache-Control: max-age, so browsers keep showing
    # a stale gallery for 15 min after an admin change. Cache server-side only
    # (bustable via _bust_gallery_cache) and let the browser always revalidate.
    payload = cache.get(CACHE_KEY)
    if payload is None:
        try:
            payload = _build_public_payload(_s3_client())
        except (ClientError, BotoCoreError) as exc:
            logger.exception("Failed to build gallery payload")
            return JsonResponse(
                {"error": "Failed to fetch images from object storage", "message": str(exc)},
                status=502,
            )
        cache.set(CACHE_KEY, payload, CACHE_TTL)

    response = JsonResponse(payload)
    response["Cache-Control"] = "no-cache"
    return response


# ---------------------------------------------------------------------------
# Admin gallery management -- sections + upload / list / delete of images.
#
# Auth: Django session + `is_staff` (the same accounts used for /admin/).
# The React page lives at /gallery/manage (linked from the public gallery).
# ---------------------------------------------------------------------------

UPLOAD_CACHE_CONTROL = "public, max-age=31536000"


def _bust_gallery_cache():
    """Drop the cached gallery payload so the next public request rebuilds it."""
    cache.delete(CACHE_KEY)


@method_decorator(ensure_csrf_cookie, name="dispatch")
class GallerySessionView(APIView):
    """GET current auth state; also sets the CSRF cookie for the SPA."""

    authentication_classes = [SessionAuthentication]
    permission_classes = []

    def get(self, request):
        user = request.user
        authed = user.is_authenticated and user.is_staff
        return Response(
            {"authenticated": authed, "username": user.get_username() if authed else None}
        )


@method_decorator(csrf_protect, name="dispatch")
class GalleryLoginView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = []

    def post(self, request):
        username = (request.data.get("username") or "").strip()
        password = request.data.get("password") or ""
        user = authenticate(request, username=username, password=password)
        if user is None:
            return Response(
                {"detail": "Incorrect username or password."},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        if not user.is_staff:
            return Response(
                {"detail": "This account is not an admin account."},
                status=status.HTTP_403_FORBIDDEN,
            )
        login(request, user)
        return Response({"authenticated": True, "username": user.get_username()})


class GalleryLogoutView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = []

    def post(self, request):
        logout(request)
        return Response({"authenticated": False})


class GalleryManageView(APIView):
    """Every gallery image, each tagged with its section, plus the section list."""

    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAdminUser]

    def get(self, request):
        try:
            sections_meta, images_by_section = _collect_gallery(_s3_client())
        except (ClientError, BotoCoreError) as exc:
            logger.exception("Gallery admin: list failed")
            return Response(
                {"detail": f"Object storage error: {exc}"},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        images = []
        for slug in _ordered_slugs(sections_meta):
            for item in images_by_section.get(slug, []):
                images.append({**item, "section": slug})
        return Response(
            {
                "images": images,
                "sections": _admin_section_list(sections_meta, images_by_section),
            }
        )


class GallerySectionsView(APIView):
    """Create / list / delete gallery sections ("folders")."""

    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAdminUser]

    def get(self, request):
        try:
            sections_meta, images_by_section = _collect_gallery(_s3_client())
        except (ClientError, BotoCoreError) as exc:
            logger.exception("Gallery admin: section list failed")
            return Response(
                {"detail": f"Object storage error: {exc}"},
                status=status.HTTP_502_BAD_GATEWAY,
            )
        return Response(
            {"sections": _admin_section_list(sections_meta, images_by_section)}
        )

    def post(self, request):
        title = (request.data.get("title") or "").strip()
        if not title:
            return Response(
                {"detail": "A section name is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        slug = slugify(title)
        if not slug or not SECTION_SLUG_RE.match(slug):
            return Response(
                {"detail": "That name doesn't produce a valid section id."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        client = _s3_client()
        try:
            manifest = _load_manifest(client)
            if slug in manifest:
                return Response(
                    {"detail": f"A section \"{manifest[slug].get('title', slug)}\" already exists."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            manifest[slug] = {"title": title, "created": timezone.now().isoformat()}
            _save_manifest(client, manifest)
        except (ClientError, BotoCoreError) as exc:
            logger.exception("Gallery admin: section create failed")
            return Response(
                {"detail": f"Storage error: {exc}"}, status=status.HTTP_502_BAD_GATEWAY
            )

        _bust_gallery_cache()
        return Response({"slug": slug, "title": title}, status=status.HTTP_201_CREATED)

    def delete(self, request):
        slug = (request.data.get("slug") or "").strip()
        if not slug or not SECTION_SLUG_RE.match(slug):
            return Response(
                {"detail": "A valid section id is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        client = _s3_client()
        prefix = f"{settings.GALLERY_PREFIX}{slug}/"
        try:
            keys = [
                obj["Key"]
                for obj in _iter_gallery_objects(client)
                if obj["Key"].startswith(prefix)
            ]
            for key in keys:
                client.delete_object(
                    Bucket=settings.AWS_STORAGE_BUCKET_NAME, Key=key
                )
            manifest = _load_manifest(client)
            if manifest.pop(slug, None) is not None:
                _save_manifest(client, manifest)
        except (ClientError, BotoCoreError) as exc:
            logger.exception("Gallery admin: section delete failed")
            return Response(
                {"detail": f"Storage error: {exc}"}, status=status.HTTP_502_BAD_GATEWAY
            )

        _bust_gallery_cache()
        return Response({"deleted": slug, "removed_images": len(keys)})


class GalleryUploadView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAdminUser]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        files = request.FILES.getlist("files")
        if not files:
            return Response(
                {"detail": "No files provided (field name: 'files')."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        section = (request.data.get("section") or "").strip()
        if not section or not SECTION_SLUG_RE.match(section):
            return Response(
                {"detail": "Choose a section to upload into."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        client = _s3_client()
        if section not in _load_manifest(client):
            return Response(
                {"detail": f"Unknown section \"{section}\". Create it first."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        max_bytes = settings.GALLERY_MAX_UPLOAD_MB * 1024 * 1024
        uploaded, errors = [], []

        for f in files:
            stem, ext = os.path.splitext(f.name)
            ext = ext.lower()
            if ext not in IMAGE_EXTENSIONS:
                errors.append({"name": f.name, "error": f"Unsupported file type '{ext}'."})
                continue
            if f.size > max_bytes:
                errors.append(
                    {"name": f.name, "error": f"Too large (max {settings.GALLERY_MAX_UPLOAD_MB} MB)."}
                )
                continue

            data = f.read()
            try:
                Image.open(io.BytesIO(data)).verify()
            except (UnidentifiedImageError, OSError, ValueError):
                errors.append({"name": f.name, "error": "Not a valid image file."})
                continue

            slug = slugify(stem) or "image"
            key = f"{settings.GALLERY_PREFIX}{section}/{slug}-{secrets.token_hex(4)}{ext}"
            content_type = f.content_type or mimetypes.guess_type(key)[0] or "image/jpeg"
            try:
                client.put_object(
                    Bucket=settings.AWS_STORAGE_BUCKET_NAME,
                    Key=key,
                    Body=data,
                    ContentType=content_type,
                    CacheControl=UPLOAD_CACHE_CONTROL,
                )
            except (ClientError, BotoCoreError) as exc:
                logger.exception("Gallery admin: upload failed for %s", f.name)
                errors.append({"name": f.name, "error": f"Storage error: {exc}"})
                continue

            uploaded.append({"name": f.name, "key": key})

        if uploaded:
            _bust_gallery_cache()

        http_status = status.HTTP_201_CREATED if uploaded else status.HTTP_400_BAD_REQUEST
        return Response({"uploaded": uploaded, "errors": errors}, status=http_status)


class GalleryDeleteView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAdminUser]

    def delete(self, request):
        key = (request.data.get("key") or "").strip()
        if not key or not key.startswith(settings.GALLERY_PREFIX):
            return Response(
                {"detail": "A 'key' inside the gallery prefix is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            _s3_client().delete_object(
                Bucket=settings.AWS_STORAGE_BUCKET_NAME, Key=key
            )
        except (ClientError, BotoCoreError) as exc:
            logger.exception("Gallery admin: delete failed for %s", key)
            return Response(
                {"detail": f"Storage error: {exc}"},
                status=status.HTTP_502_BAD_GATEWAY,
            )
        _bust_gallery_cache()
        return Response({"deleted": key})
