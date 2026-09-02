"""Tests for the admin gallery endpoints (voice_of_kingdom/views.py)."""

import io
import json
from datetime import datetime, timezone
from unittest import mock

from botocore.exceptions import ClientError
from django.contrib.auth import get_user_model
from django.core.cache import cache
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase, override_settings
from PIL import Image
from rest_framework.test import APIClient

User = get_user_model()


def _png_bytes(color=(255, 0, 0)):
    buf = io.BytesIO()
    Image.new("RGB", (2, 2), color).save(buf, format="PNG")
    return buf.getvalue()


class FakeS3:
    """Just enough of the boto3 S3 client for the gallery views."""

    def __init__(self):
        self.store = {}  # key -> bytes

    def put_object(self, Bucket, Key, Body, **kw):
        self.store[Key] = Body if isinstance(Body, (bytes, bytearray)) else Body.read()
        return {}

    def get_object(self, Bucket, Key):
        if Key not in self.store:
            raise ClientError(
                {"Error": {"Code": "NoSuchKey", "Message": "missing"}}, "GetObject"
            )
        return {"Body": io.BytesIO(self.store[Key])}

    def delete_object(self, Bucket, Key):
        self.store.pop(Key, None)
        return {}

    def list_objects_v2(self, Bucket, Prefix="", MaxKeys=1000, ContinuationToken=None):
        keys = sorted(k for k in self.store if k.startswith(Prefix))
        return {
            "Contents": [
                {
                    "Key": k,
                    "Size": len(self.store[k]),
                    "LastModified": datetime(2026, 1, 1, tzinfo=timezone.utc),
                }
                for k in keys
            ],
            "IsTruncated": False,
        }


@override_settings(GALLERY_PREFIX="gallery/", GALLERY_MAX_UPLOAD_MB=1)
class GalleryAdminTests(TestCase):
    def setUp(self):
        cache.clear()
        self.client = APIClient()
        self.staff = User.objects.create_user("boss", password="pw", is_staff=True)
        self.plain = User.objects.create_user("joe", password="pw")
        self.s3 = FakeS3()
        patcher = mock.patch("voice_of_kingdom.views._s3_client", return_value=self.s3)
        patcher.start()
        self.addCleanup(patcher.stop)

    def _login(self):
        self.client.force_authenticate(self.staff)

    def _make_section(self, slug="2025", title="Vokim 2025"):
        self.s3.store["gallery/.sections.json"] = json.dumps(
            {slug: {"title": title, "created": "2026-01-01T00:00:00"}}
        ).encode()

    # ---- auth ----
    def test_login_rejects_bad_credentials(self):
        r = self.client.post("/api/gallery/login/", {"username": "boss", "password": "x"})
        self.assertEqual(r.status_code, 401)

    def test_login_rejects_non_staff(self):
        r = self.client.post("/api/gallery/login/", {"username": "joe", "password": "pw"})
        self.assertEqual(r.status_code, 403)

    def test_login_accepts_staff(self):
        r = self.client.post("/api/gallery/login/", {"username": "boss", "password": "pw"})
        self.assertEqual(r.status_code, 200)

    def test_manage_requires_auth(self):
        self.assertEqual(self.client.get("/api/gallery/manage/").status_code, 403)

    def test_sections_requires_auth(self):
        self.assertEqual(self.client.get("/api/gallery/sections/").status_code, 403)

    # ---- sections ----
    def test_create_section(self):
        self._login()
        r = self.client.post("/api/gallery/sections/", {"title": "Vokim 2024"}, format="json")
        self.assertEqual(r.status_code, 201)
        self.assertEqual(r.json()["slug"], "vokim-2024")
        manifest = json.loads(self.s3.store["gallery/.sections.json"])
        self.assertIn("vokim-2024", manifest)

    def test_create_section_blank(self):
        self._login()
        r = self.client.post("/api/gallery/sections/", {"title": "   "}, format="json")
        self.assertEqual(r.status_code, 400)

    def test_create_section_duplicate(self):
        self._login()
        self._make_section("vokim-2025", "Vokim 2025")
        r = self.client.post("/api/gallery/sections/", {"title": "Vokim 2025"}, format="json")
        self.assertEqual(r.status_code, 400)

    def test_delete_section_cascades(self):
        self._login()
        self._make_section("2025", "Vokim 2025")
        self.s3.store["gallery/2025/a-1111.png"] = _png_bytes()
        self.s3.store["gallery/2025/b-2222.png"] = _png_bytes()
        r = self.client.delete("/api/gallery/sections/", {"slug": "2025"}, format="json")
        self.assertEqual(r.status_code, 200)
        self.assertEqual(r.json()["removed_images"], 2)
        self.assertNotIn("gallery/2025/a-1111.png", self.s3.store)
        self.assertNotIn("2025", json.loads(self.s3.store["gallery/.sections.json"]))

    # ---- upload ----
    def test_upload_requires_section(self):
        self._login()
        f = SimpleUploadedFile("p.png", _png_bytes(), content_type="image/png")
        r = self.client.post("/api/gallery/upload/", {"files": f}, format="multipart")
        self.assertEqual(r.status_code, 400)

    def test_upload_unknown_section(self):
        self._login()
        f = SimpleUploadedFile("p.png", _png_bytes(), content_type="image/png")
        r = self.client.post(
            "/api/gallery/upload/", {"files": f, "section": "ghost"}, format="multipart"
        )
        self.assertEqual(r.status_code, 400)

    def test_upload_valid_image_into_section(self):
        self._login()
        self._make_section("2025", "Vokim 2025")
        f = SimpleUploadedFile("Choir Photo.png", _png_bytes(), content_type="image/png")
        r = self.client.post(
            "/api/gallery/upload/", {"files": f, "section": "2025"}, format="multipart"
        )
        self.assertEqual(r.status_code, 201)
        key = r.json()["uploaded"][0]["key"]
        self.assertTrue(key.startswith("gallery/2025/choir-photo-"))
        self.assertIn(key, self.s3.store)

    def test_upload_rejects_non_image(self):
        self._login()
        self._make_section("2025")
        f = SimpleUploadedFile("evil.png", b"not a png", content_type="image/png")
        r = self.client.post(
            "/api/gallery/upload/", {"files": f, "section": "2025"}, format="multipart"
        )
        self.assertEqual(r.status_code, 400)
        self.assertEqual(r.json()["errors"][0]["name"], "evil.png")

    # ---- delete image ----
    def test_delete_image_guards_prefix(self):
        self._login()
        r = self.client.delete(
            "/api/gallery/delete/", {"key": "newsletters/x.pdf"}, format="json"
        )
        self.assertEqual(r.status_code, 400)

    def test_delete_image(self):
        self._login()
        self.s3.store["gallery/2025/a-1111.png"] = _png_bytes()
        r = self.client.delete(
            "/api/gallery/delete/", {"key": "gallery/2025/a-1111.png"}, format="json"
        )
        self.assertEqual(r.status_code, 200)
        self.assertNotIn("gallery/2025/a-1111.png", self.s3.store)

    # ---- public listing ----
    def test_public_gallery_groups_by_section(self):
        self._make_section("2025", "Vokim 2025")
        self.s3.store["gallery/2025/a-1111.png"] = _png_bytes()
        self.s3.store["gallery/legacy-9999.png"] = _png_bytes()  # pre-sections image
        r = self.client.get("/api/gallery-images/")
        self.assertEqual(r.status_code, 200)
        data = r.json()
        titles = [s["title"] for s in data["sections"]]
        self.assertIn("Vokim 2025", titles)
        self.assertIn("Uncategorised", titles)
        self.assertEqual(len(data["images"]), 2)
