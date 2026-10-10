"""
Create the pre-sized WebP copies (see voice_of_kingdom/variants.py) for images
that were uploaded before variants existed -- i.e. everything migrated over
from Cloudinary/MinIO.

    python manage.py backfill_variants            # only images missing variants
    python manage.py backfill_variants --force    # regenerate everything

Safe to re-run. Run it BEFORE pointing the site at CloudFront
(REACT_APP_CDN_BASE), otherwise old images would 404 on the CDN.
"""

from botocore.exceptions import ClientError
from django.conf import settings
from django.core.management.base import BaseCommand

from voice_of_kingdom import views
from voice_of_kingdom.variants import PRESETS, VARIANT_PREFIX, build_variants, variant_key


class Command(BaseCommand):
    help = "Generate resized WebP variants for existing bucket images."

    def add_arguments(self, parser):
        parser.add_argument("--force", action="store_true", help="Regenerate even if present.")

    def _has_all_variants(self, client, key):
        for preset in PRESETS:
            try:
                client.head_object(
                    Bucket=settings.AWS_STORAGE_BUCKET_NAME, Key=variant_key(preset, key)
                )
            except ClientError:
                return False
        return True

    def handle(self, *args, **opts):
        client = views._s3_client()
        bucket = settings.AWS_STORAGE_BUCKET_NAME
        params = {"Bucket": bucket, "MaxKeys": 1000}
        made = skipped = failed = 0

        while True:
            result = client.list_objects_v2(**params)
            for obj in result.get("Contents", []):
                key = obj["Key"]
                if key.startswith(VARIANT_PREFIX) or not views._is_image(key):
                    continue
                if not opts["force"] and self._has_all_variants(client, key):
                    skipped += 1
                    continue
                body = client.get_object(Bucket=bucket, Key=key)["Body"].read()
                if build_variants(client, key, body) == len(PRESETS):
                    made += 1
                    self.stdout.write(f"ok      {key}")
                else:
                    failed += 1
                    self.stderr.write(f"FAILED  {key}")
            token = result.get("NextContinuationToken")
            if not token:
                break
            params["ContinuationToken"] = token

        self.stdout.write(
            self.style.SUCCESS(f"Done: {made} built, {skipped} already had variants, {failed} failed.")
        )
