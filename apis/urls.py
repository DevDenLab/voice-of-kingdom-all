from django.urls import path
from .views import (
    subscribe, 
    upload_document, 
    band_booking, 
    contact_us_submission, 
    submit_musician_application,
    submit_non_musician_application
)
from django.middleware.csrf import get_token
from django.http import JsonResponse

def csrf(request):
    return JsonResponse({'csrfToken': get_token(request)})

urlpatterns = [
    path('subscribe/', subscribe, name='subscribe'),
    path('upload-document/', upload_document, name='upload_document'),
    path('bookings/', band_booking, name='band_booking'),
    path('contact/', contact_us_submission, name='contact-us-submit'),
    # New application endpoints
    path('join-musician/', submit_musician_application, name='submit_musician_application'),
    path('join-non-musician/', submit_non_musician_application, name='submit_non_musician_application'),
    path("csrf/", csrf, name="csrf"),
]