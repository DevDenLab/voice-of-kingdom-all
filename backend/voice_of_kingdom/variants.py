"""
Pre-sized WebP copies of uploaded images, for serving straight from S3/CloudFront.

Every upload is resized once, at upload time, into a few fixed presets. The
browser then fetches a small static file from the CDN edge instead of asking a
server to resize on every request (what imgproxy does).

An original at   gallery/2025/choir-ab12cd34.jpg
gets copies at   _v/<preset>/gallery/2025/choir-ab12cd34.webp

The frontend builds the same path (see frontend/src/lib/imageUrl.js) -- keep the
two preset tables in sync.
"""

import io
import logging

from botocore.exceptions import BotoCoreError, ClientError
from django.conf import settings
from PIL import Image, ImageOps

logger = logging.getLogger(__name__)

VARIANT_PREFIX = "_v/"
VARIANT_CACHE_CONTROL = "public, max-age=31536000, immutable"
WEBP_QUALITY = 80

# preset -> (width, height, mode). height None = scale to width; "cover" crops
# to the exact box, "fit" keeps the whole image.
PRESETS = {
    "gallery": (800, 800, "cover"),   # gallery grid tiles
    "thumb": (400, 300, "cover"),     # home Event Highlights
    "preview": (800, None, "fit"),    # gallery preload
    "full": (1600, None, "fit"),      # poster / large views
    "team": (480, 600, "cover"),      # team member portraits
}


def variant_key(preset, key):
    stem = key.rsplit(".", 1)[0] if "." in key.rsplit("/", 1)[-1] else key
    return f"{VARIANT_PREFIX}{preset}/{stem}.webp"


def _render(img, width, height, mode):
    if mode == "cover":
        return ImageOps.fit(img, (width, height), Image.LANCZOS, centering=(0.5, 0.4))
    if img.width <= width:
        return img.copy()
    ratio = width / img.width
    return img.resize((width, max(1, round(img.height * ratio))), Image.LANCZOS)


def build_variants(client, key, data):
    """Write every preset for `key` from the original bytes. Returns the number
    written. Failures are logged, never raised: the original is already stored
    and the gallery must not break because a resize failed."""
    written = 0
    try:
        with Image.open(io.BytesIO(data)) as src:
            src = ImageOps.exif_transpose(src)
            if src.mode not in ("RGB", "RGBA"):
                src = src.convert("RGBA" if "A" in src.getbands() else "RGB")
            for preset, (width, height, mode) in PRESETS.items():
                out = _render(src, width, height, mode)
                buf = io.BytesIO()
                out.save(buf, format="WEBP", quality=WEBP_QUALITY, method=4)
                client.put_object(
                    Bucket=settings.AWS_STORAGE_BUCKET_NAME,
                    Key=variant_key(preset, key),
                    Body=buf.getvalue(),
                    ContentType="image/webp",
                    CacheControl=VARIANT_CACHE_CONTROL,
                )
                written += 1
    except (OSError, ValueError, ClientError, BotoCoreError):
        logger.exception("Could not build image variants for %s", key)
    return written


def delete_variants(client, key):
    for preset in PRESETS:
        try:
            client.delete_object(
                Bucket=settings.AWS_STORAGE_BUCKET_NAME, Key=variant_key(preset, key)
            )
        except (ClientError, BotoCoreError):
            logger.exception("Could not delete variant %s of %s", preset, key)
