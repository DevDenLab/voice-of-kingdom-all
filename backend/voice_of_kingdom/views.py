"""
Gallery listing.

Was: cloudinary.api.resources()
Now: list objects in the MinIO bucket under GALLERY_PREFIX.

The response shape is unchanged, so the React Gallery component keeps working --
`publicId` is now an S3 object key instead of a Cloudinary public_id, and the
frontend turns it into a resized URL via imgproxy (see frontend/src/lib/imageUrl.js).
"""

import logging
import mimetypes

import boto3
from botocore.client import Config
from botocore.exceptions import BotoCoreError, ClientError
from django.conf import settings
from django.core.cache import cache
from django.http import JsonResponse
from django.views.decorators.cache import cache_page
from django.views.decorators.csrf import csrf_exempt

logger = logging.getLogger(__name__)

BATCH_SIZE = 50
CACHE_TTL = 60 * 15  # 15 minutes
IMAGE_EXTENSIONS = (".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif", ".heic")


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


@csrf_exempt
@cache_page(CACHE_TTL)
def get_gallery_images(request):
    next_cursor = request.GET.get("next_cursor") or None
    cache_key = f"gallery_images:{next_cursor or 'first'}"

    cached = cache.get(cache_key)
    if cached:
        return JsonResponse(cached)

    params = {
        "Bucket": settings.AWS_STORAGE_BUCKET_NAME,
        "Prefix": settings.GALLERY_PREFIX,
        "MaxKeys": BATCH_SIZE,
    }
    if next_cursor:
        params["ContinuationToken"] = next_cursor

    try:
        result = _s3_client().list_objects_v2(**params)
    except (ClientError, BotoCoreError) as exc:
        logger.exception("Failed to list gallery objects")
        return JsonResponse(
            {"error": "Failed to fetch images from object storage", "message": str(exc)},
            status=502,
        )

    images = [
        {
            "publicId": obj["Key"],
            "alt": obj["Key"].rsplit("/", 1)[-1].rsplit(".", 1)[0].replace("-", " "),
            "created": obj["LastModified"].isoformat(),
            "size": obj["Size"],
            "url": f"{settings.MEDIA_URL.rstrip('/')}/{obj['Key']}",
        }
        for obj in result.get("Contents", [])
        if _is_image(obj["Key"])
    ]

    token = result.get("NextContinuationToken")
    response_data = {
        "images": images,
        "next_cursor": token,
        "has_more": bool(result.get("IsTruncated")),
    }

    cache.set(cache_key, response_data, CACHE_TTL)
    logger.info("Gallery: returned %d images (more=%s)", len(images), response_data["has_more"])
    return JsonResponse(response_data)
