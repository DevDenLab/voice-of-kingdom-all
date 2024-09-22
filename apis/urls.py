from django.urls import path
from .views import SubscribeView, DocumentUploadView, ContactSubmissionView, BookingView
urlpatterns = [
    path('subscribe/', SubscribeView.as_view(), name='subscribe'),
    path('upload-document/', DocumentUploadView.as_view(), name='upload-document'),
    path('contact/', ContactSubmissionView.as_view(), name='contact_submission'),
    path('booking/', BookingView.as_view(), name='booking'),
]
