from django.http import JsonResponse
import cloudinary.api
from django.views.decorators.csrf import csrf_exempt
from django.core.cache import cache
from django.conf import settings
import logging
from django.views.decorators.cache import cache_page
from django.views.decorators.vary import vary_on_cookie
import traceback

logger = logging.getLogger(__name__)

@csrf_exempt
@cache_page(60 * 15)  # Cache for 15 minutes
@vary_on_cookie
def get_gallery_images(request):
    try:
        # Get next_cursor from request
        next_cursor = request.GET.get('next_cursor')
        batch_size = 50
        
        # Try to get cached results first
        cache_key = f'gallery_images_{next_cursor}'
        cached_result = cache.get(cache_key)
        
        if cached_result:
            logger.info(f"Returning cached results for cursor: {next_cursor}")
            return JsonResponse(cached_result)
        
        # Log the request parameters
        logger.info(f"Fetching gallery images with cursor: {next_cursor}")
        
        # Basic Cloudinary API call with minimal parameters
        result = cloudinary.api.resources(
            type="upload",
            max_results=batch_size,
            next_cursor=next_cursor,
            resource_type="image"
        )
        
        # Log the number of resources found
        resources = result.get('resources', [])
        logger.info(f"Found {len(resources)} images")
        
        # Format the response with essential image data
        images = [{
            'publicId': resource['public_id'],
            'alt': resource.get('context', {}).get('alt', resource['public_id']),
            'created': resource['created_at'],
            'url': resource.get('secure_url')
        } for resource in resources]
        
        # Include next_cursor for pagination
        response_data = {
            'images': images,
            'next_cursor': result.get('next_cursor'),
            'has_more': bool(result.get('next_cursor'))
        }
        
        # Cache the results for 15 minutes
        cache.set(cache_key, response_data, 60 * 15)
        logger.info(f"Cached results for cursor: {next_cursor}")
        
        return JsonResponse(response_data)
    except cloudinary.exceptions.GeneralError as e:
        error_details = {
            'error': 'Failed to fetch images from Cloudinary',
            'message': str(e),
            'traceback': traceback.format_exc()
        }
        logger.error(f"Cloudinary API error: {error_details}")
        return JsonResponse(error_details, status=500)
    except Exception as e:
        error_details = {
            'error': 'Unexpected error fetching gallery images',
            'message': str(e),
            'traceback': traceback.format_exc()
        }
        logger.error(f"Unexpected error: {error_details}")
        return JsonResponse(error_details, status=500)