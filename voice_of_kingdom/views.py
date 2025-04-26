from django.http import JsonResponse
import cloudinary.api
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def get_gallery_images(request):
    try:
        # Fetch all images from Cloudinary
        result = cloudinary.api.resources(
            type="upload",
            prefix="",  # Add folder prefix if needed
            max_results=500
        )
        
        # Format the response
        images = [{
            'publicId': resource['public_id'],
            'alt': resource['public_id'],
            'created': resource['created_at']
        } for resource in result['resources']]
        
        return JsonResponse({'images': images})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)