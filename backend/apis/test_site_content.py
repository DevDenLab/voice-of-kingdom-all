"""Tests for editable site content + image variants (voice_of_kingdom/site_content.py)."""

import json
from unittest import mock

from django.contrib.auth import get_user_model
from django.core.cache import cache
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase, override_settings
from rest_framework.test import APIClient

from voice_of_kingdom.variants import PRESETS, variant_key

from .test_gallery_admin import FakeS3, _png_bytes

User = get_user_model()


def _img(name="pic.png"):
    return SimpleUploadedFile(name, _png_bytes(), content_type="image/png")


@override_settings(GALLERY_PREFIX="gallery/", SITE_PREFIX="site/", GALLERY_MAX_UPLOAD_MB=1)
class SiteContentTests(TestCase):
    def setUp(self):
        cache.clear()
        self.client = APIClient()
        self.staff = User.objects.create_user("boss", password="pw", is_staff=True)
        self.s3 = FakeS3()
        patcher = mock.patch("voice_of_kingdom.views._s3_client", return_value=self.s3)
        patcher.start()
        self.addCleanup(patcher.stop)

    def _login(self):
        self.client.force_authenticate(self.staff)

    def _manifest(self):
        return json.loads(self.s3.store["site/content.json"])

    # ---- public ----
    def test_public_content_defaults_when_empty(self):
        r = self.client.get("/api/site-content/")
        self.assertEqual(r.status_code, 200)
        self.assertEqual(
            r.json(),
            {"highlights": [], "poster": {"key": None, "show_countdown": False}, "team": []},
        )

    def test_writes_require_staff(self):
        for url in ("/api/site/highlights/", "/api/site/poster/", "/api/site/team/"):
            self.assertEqual(self.client.post(url, {}).status_code, 403, url)

    # ---- variants ----
    def test_upload_writes_every_variant(self):
        self._login()
        r = self.client.post("/api/site/highlights/", {"files": [_img()]}, format="multipart")
        self.assertEqual(r.status_code, 201)
        key = r.json()["uploaded"][0]["key"]
        for preset in PRESETS:
            self.assertIn(variant_key(preset, key), self.s3.store)

    def test_variant_key_shape(self):
        self.assertEqual(
            variant_key("gallery", "gallery/2025/choir-ab12.jpg"),
            "_v/gallery/gallery/2025/choir-ab12.webp",
        )

    # ---- highlights ----
    def test_highlights_upload_reorder_delete(self):
        self._login()
        r = self.client.post(
            "/api/site/highlights/", {"files": [_img("a.png"), _img("b.png")]}, format="multipart"
        )
        a, b = [u["key"] for u in r.json()["uploaded"]]
        self.assertEqual(self._manifest()["highlights"], [a, b])

        r = self.client.put("/api/site/highlights/", {"keys": [b, a]}, format="json")
        self.assertEqual(r.status_code, 200)
        self.assertEqual(self._manifest()["highlights"], [b, a])
        self.assertEqual(self.client.get("/api/site-content/").json()["highlights"], [b, a])

        r = self.client.delete("/api/site/highlights/", {"key": a}, format="json")
        self.assertEqual(r.status_code, 200)
        self.assertEqual(self._manifest()["highlights"], [b])
        self.assertNotIn(a, self.s3.store)
        self.assertNotIn(variant_key("thumb", a), self.s3.store)

    def test_highlights_reorder_rejects_duplicates(self):
        self._login()
        r = self.client.put("/api/site/highlights/", {"keys": ["x", "x"]}, format="json")
        self.assertEqual(r.status_code, 400)

    def test_highlights_rejects_non_image(self):
        self._login()
        bad = SimpleUploadedFile("evil.exe", b"MZ", content_type="application/octet-stream")
        r = self.client.post("/api/site/highlights/", {"files": [bad]}, format="multipart")
        self.assertEqual(r.status_code, 400)
        self.assertEqual(r.json()["uploaded"], [])

    # ---- poster ----
    def test_poster_upload_replaces_old_and_toggle(self):
        self._login()
        first = self.client.post("/api/site/poster/", {"file": _img()}, format="multipart").json()["key"]
        second = self.client.post("/api/site/poster/", {"file": _img()}, format="multipart").json()["key"]
        self.assertNotEqual(first, second)
        self.assertNotIn(first, self.s3.store)
        self.assertEqual(self._manifest()["poster"]["key"], second)

        r = self.client.patch("/api/site/poster/", {"show_countdown": True}, format="json")
        self.assertEqual(r.status_code, 200)
        self.assertTrue(self._manifest()["poster"]["show_countdown"])
        self.assertEqual(
            self.client.patch("/api/site/poster/", {"show_countdown": "maybe?"}, format="json").status_code,
            400,
        )

        self.client.delete("/api/site/poster/")
        self.assertIsNone(self._manifest()["poster"]["key"])
        self.assertNotIn(second, self.s3.store)

    # ---- team ----
    def test_team_add_edit_reorder_delete(self):
        self._login()
        a = self.client.post(
            "/api/site/team/", {"name": "Ada", "role": "Vocals", "photo": _img()}, format="multipart"
        ).json()
        b = self.client.post("/api/site/team/", {"name": "Ben"}, format="multipart").json()
        self.assertTrue(a["photo"].startswith("site/team/"))
        self.assertIsNone(b["photo"])

        r = self.client.put("/api/site/team/", {"ids": [b["id"], a["id"]]}, format="json")
        self.assertEqual(r.status_code, 200)
        self.assertEqual([m["name"] for m in self._manifest()["team"]], ["Ben", "Ada"])

        r = self.client.patch(
            "/api/site/team/", {"id": a["id"], "role": "Lead vocals", "photo": _img()}, format="multipart"
        )
        self.assertEqual(r.status_code, 200)
        self.assertEqual(r.json()["role"], "Lead vocals")
        self.assertNotIn(a["photo"], self.s3.store)  # old photo cleaned up
        self.assertIn(r.json()["photo"], self.s3.store)

        r = self.client.delete("/api/site/team/", {"id": b["id"]}, format="json")
        self.assertEqual(r.status_code, 200)
        self.assertEqual([m["name"] for m in self._manifest()["team"]], ["Ada"])

    def test_team_requires_name(self):
        self._login()
        r = self.client.post("/api/site/team/", {"name": "  "}, format="multipart")
        self.assertEqual(r.status_code, 400)

    def test_team_unknown_member(self):
        self._login()
        self.assertEqual(
            self.client.patch("/api/site/team/", {"id": "nope", "name": "x"}, format="json").status_code, 404
        )
