"""
Editable site content: home Event Highlights, the VOKIM Experience poster
(and its countdown switch), and the team ("Meet the Team") members.

Same storage pattern as the gallery: images live in the media bucket and the
ordering / text lives in one small JSON manifest next to them:

    site/content.json ->
      {
        "highlights": ["site/highlights/a-1f2e.jpg", ...],      # display order
        "poster":     {"key": "site/poster/x-9c.jpg" | null, "show_countdown": false},
        "team":       [{"id": "ab12cd34", "name": "...", "role": "...", "photo": "site/team/..."}]
      }

Public read:   GET /api/site-content/
Admin writes:  /api/site/highlights/ /api/site/poster/ /api/site/team/
               (Django session + is_staff, same accounts as the gallery admin)
"""

import io
import json
import logging
import mimetypes
import os
import secrets

from botocore.exceptions import BotoCoreError, ClientError
from django.conf import settings
from django.core.cache import cache
from django.http import JsonResponse
from django.utils.text import slugify
from PIL import Image, UnidentifiedImageError
from rest_framework import status
from rest_framework.authentication import SessionAuthentication
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView

from . import views as gallery
from .variants import build_variants, delete_variants

logger = logging.getLogger(__name__)

CACHE_KEY = "site_content_v1"
CACHE_TTL = 60 * 15
MAX_NAME = 120


def _content_key():
    return f"{settings.SITE_PREFIX}content.json"


def _empty():
    return {"highlights": [], "poster": {"key": None, "show_countdown": False}, "team": []}


def _load(client):
    try:
        obj = client.get_object(Bucket=settings.AWS_STORAGE_BUCKET_NAME, Key=_content_key())
        data = json.loads(obj["Body"].read())
    except ClientError as exc:
        if exc.response.get("Error", {}).get("Code") in ("NoSuchKey", "404"):
            return _empty()
        raise
    except (ValueError, TypeError):
        logger.exception("Site content: manifest unreadable")
        return _empty()
    if not isinstance(data, dict):
        return _empty()
    out = _empty()
    if isinstance(data.get("highlights"), list):
        out["highlights"] = [k for k in data["highlights"] if isinstance(k, str)]
    if isinstance(data.get("poster"), dict):
        out["poster"]["key"] = data["poster"].get("key") or None
        out["poster"]["show_countdown"] = bool(data["poster"].get("show_countdown"))
    if isinstance(data.get("team"), list):
        out["team"] = [m for m in data["team"] if isinstance(m, dict) and m.get("id")]
    return out


def _save(client, data):
    client.put_object(
        Bucket=settings.AWS_STORAGE_BUCKET_NAME,
        Key=_content_key(),
        Body=json.dumps(data).encode(),
        ContentType="application/json",
        CacheControl="no-cache",
    )
    cache.delete(CACHE_KEY)


def _store_image(client, f, folder):
    """Validate + upload one image under site/<folder>/ and build its variants.
    Returns the object key; raises ValueError with a message safe to show."""
    stem, ext = os.path.splitext(f.name)
    ext = ext.lower()
    if ext not in gallery.IMAGE_EXTENSIONS:
        raise ValueError(f"Unsupported file type '{ext}'.")
    max_mb = settings.GALLERY_MAX_UPLOAD_MB
    if f.size > max_mb * 1024 * 1024:
        raise ValueError(f"Too large (max {max_mb} MB).")
    data = f.read()
    try:
        Image.open(io.BytesIO(data)).verify()
    except (UnidentifiedImageError, OSError, ValueError):
        raise ValueError("Not a valid image file.")

    key = f"{settings.SITE_PREFIX}{folder}/{slugify(stem) or 'image'}-{secrets.token_hex(4)}{ext}"
    try:
        client.put_object(
            Bucket=settings.AWS_STORAGE_BUCKET_NAME,
            Key=key,
            Body=data,
            ContentType=f.content_type or mimetypes.guess_type(key)[0] or "image/jpeg",
            CacheControl=gallery.UPLOAD_CACHE_CONTROL,
        )
    except (ClientError, BotoCoreError) as exc:
        logger.exception("Site content: upload failed for %s", f.name)
        raise ValueError(f"Storage error: {exc}")
    build_variants(client, key, data)
    return key


def _remove_image(client, key):
    if not key:
        return
    try:
        client.delete_object(Bucket=settings.AWS_STORAGE_BUCKET_NAME, Key=key)
    except (ClientError, BotoCoreError):
        logger.exception("Site content: could not delete %s", key)
    delete_variants(client, key)


def _storage_error(exc, what):
    logger.exception("Site content: %s failed", what)
    return Response({"detail": f"Storage error: {exc}"}, status=status.HTTP_502_BAD_GATEWAY)


def _is_list_of_unique_str(value):
    return (
        isinstance(value, list)
        and len(set(value)) == len(value)
        and all(isinstance(v, str) for v in value)
    )


def _reorder(current, wanted):
    """Apply an admin-supplied order, tolerating a list that is out of date:
    anything not mentioned keeps its place at the end."""
    known = set(current)
    first = [x for x in wanted if x in known]
    placed = set(first)
    return first + [x for x in current if x not in placed]


# ---------------------------------------------------------------------------
# Public
# ---------------------------------------------------------------------------


def site_content(request):
    payload = cache.get(CACHE_KEY)
    if payload is None:
        try:
            payload = _load(gallery._s3_client())
        except (ClientError, BotoCoreError) as exc:
            logger.exception("Site content: could not load")
            return JsonResponse({"error": "Failed to load site content", "message": str(exc)}, status=502)
        cache.set(CACHE_KEY, payload, CACHE_TTL)
    response = JsonResponse(payload)
    response["Cache-Control"] = "no-cache"
    return response


# ---------------------------------------------------------------------------
# Admin
# ---------------------------------------------------------------------------


class _AdminView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAdminUser]
    parser_classes = [MultiPartParser, FormParser, JSONParser]


class HighlightsView(_AdminView):
    """Home "Event Highlights" images: upload, reorder, delete."""

    def post(self, request):
        files = request.FILES.getlist("files")
        if not files:
            return Response({"detail": "No files provided (field name: 'files')."}, status=400)
        client = gallery._s3_client()
        uploaded, errors = [], []
        try:
            data = _load(client)
            for f in files:
                try:
                    key = _store_image(client, f, "highlights")
                except ValueError as exc:
                    errors.append({"name": f.name, "error": str(exc)})
                    continue
                data["highlights"].append(key)
                uploaded.append({"name": f.name, "key": key})
            if uploaded:
                _save(client, data)
        except (ClientError, BotoCoreError) as exc:
            return _storage_error(exc, "highlight upload")
        code = status.HTTP_201_CREATED if uploaded else status.HTTP_400_BAD_REQUEST
        return Response({"uploaded": uploaded, "errors": errors}, status=code)

    def put(self, request):
        keys = request.data.get("keys")
        if not _is_list_of_unique_str(keys):
            return Response({"detail": "'keys' must be a list of unique image keys."}, status=400)
        client = gallery._s3_client()
        try:
            data = _load(client)
            data["highlights"] = _reorder(data["highlights"], keys)
            _save(client, data)
        except (ClientError, BotoCoreError) as exc:
            return _storage_error(exc, "highlight reorder")
        return Response({"count": len(data["highlights"])})

    def delete(self, request):
        key = (request.data.get("key") or "").strip()
        client = gallery._s3_client()
        try:
            data = _load(client)
            if key not in data["highlights"]:
                return Response({"detail": "Unknown highlight."}, status=404)
            data["highlights"].remove(key)
            _save(client, data)
            _remove_image(client, key)
        except (ClientError, BotoCoreError) as exc:
            return _storage_error(exc, "highlight delete")
        return Response({"deleted": key})


class PosterView(_AdminView):
    """The VOKIM Experience poster plus the hero countdown on/off switch."""

    def post(self, request):
        f = request.FILES.get("file")
        if not f:
            return Response({"detail": "No file provided (field name: 'file')."}, status=400)
        client = gallery._s3_client()
        try:
            key = _store_image(client, f, "poster")
        except ValueError as exc:
            return Response({"detail": str(exc)}, status=400)
        try:
            data = _load(client)
            old = data["poster"]["key"]
            data["poster"]["key"] = key
            _save(client, data)
            if old and old != key:
                _remove_image(client, old)
        except (ClientError, BotoCoreError) as exc:
            return _storage_error(exc, "poster save")
        return Response({"key": key}, status=status.HTTP_201_CREATED)

    def patch(self, request):
        flag = request.data.get("show_countdown")
        if isinstance(flag, str):
            # multipart/form posts send "true"/"false" strings
            flag = {"1": True, "true": True, "on": True, "0": False, "false": False, "off": False}.get(
                flag.strip().lower()
            )
        if not isinstance(flag, bool):
            return Response({"detail": "'show_countdown' must be true or false."}, status=400)
        client = gallery._s3_client()
        try:
            data = _load(client)
            data["poster"]["show_countdown"] = flag
            _save(client, data)
        except (ClientError, BotoCoreError) as exc:
            return _storage_error(exc, "countdown toggle")
        return Response({"show_countdown": flag})

    def delete(self, request):
        client = gallery._s3_client()
        try:
            data = _load(client)
            old = data["poster"]["key"]
            data["poster"]["key"] = None
            _save(client, data)
            _remove_image(client, old)
        except (ClientError, BotoCoreError) as exc:
            return _storage_error(exc, "poster delete")
        return Response({"deleted": old})


class TeamView(_AdminView):
    """Team members: add, edit, reorder, delete."""

    @staticmethod
    def _clean(value):
        return (value or "").strip()[:MAX_NAME]

    def post(self, request):
        name = self._clean(request.data.get("name"))
        if not name:
            return Response({"detail": "A name is required."}, status=400)
        client = gallery._s3_client()
        photo = None
        f = request.FILES.get("photo")
        if f:
            try:
                photo = _store_image(client, f, "team")
            except ValueError as exc:
                return Response({"detail": str(exc)}, status=400)
        member = {
            "id": secrets.token_hex(4),
            "name": name,
            "role": self._clean(request.data.get("role")),
            "photo": photo,
        }
        try:
            data = _load(client)
            data["team"].append(member)
            _save(client, data)
        except (ClientError, BotoCoreError) as exc:
            return _storage_error(exc, "team add")
        return Response(member, status=status.HTTP_201_CREATED)

    def patch(self, request):
        member_id = (request.data.get("id") or "").strip()
        client = gallery._s3_client()
        try:
            data = _load(client)
            member = next((m for m in data["team"] if m["id"] == member_id), None)
            if member is None:
                return Response({"detail": "Unknown team member."}, status=404)
            if "name" in request.data:
                name = self._clean(request.data.get("name"))
                if not name:
                    return Response({"detail": "A name is required."}, status=400)
                member["name"] = name
            if "role" in request.data:
                member["role"] = self._clean(request.data.get("role"))
            old_photo = None
            f = request.FILES.get("photo")
            if f:
                try:
                    new_photo = _store_image(client, f, "team")
                except ValueError as exc:
                    return Response({"detail": str(exc)}, status=400)
                old_photo, member["photo"] = member.get("photo"), new_photo
            _save(client, data)
            _remove_image(client, old_photo)
        except (ClientError, BotoCoreError) as exc:
            return _storage_error(exc, "team edit")
        return Response(member)

    def put(self, request):
        ids = request.data.get("ids")
        if not _is_list_of_unique_str(ids):
            return Response({"detail": "'ids' must be a list of unique member ids."}, status=400)
        client = gallery._s3_client()
        try:
            data = _load(client)
            by_id = {m["id"]: m for m in data["team"]}
            order = _reorder(list(by_id), ids)
            data["team"] = [by_id[i] for i in order]
            _save(client, data)
        except (ClientError, BotoCoreError) as exc:
            return _storage_error(exc, "team reorder")
        return Response({"count": len(data["team"])})

    def delete(self, request):
        member_id = (request.data.get("id") or "").strip()
        client = gallery._s3_client()
        try:
            data = _load(client)
            member = next((m for m in data["team"] if m["id"] == member_id), None)
            if member is None:
                return Response({"detail": "Unknown team member."}, status=404)
            data["team"].remove(member)
            _save(client, data)
            _remove_image(client, member.get("photo"))
        except (ClientError, BotoCoreError) as exc:
            return _storage_error(exc, "team delete")
        return Response({"deleted": member_id})
