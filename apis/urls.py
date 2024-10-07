# from django.urls import path
# from .views import SubscribeView, DocumentUploadView, ContactSubmissionView, BookingView
# from .views import MembershipApplicationViewSet
# urlpatterns = [
#     path('subscribe/', SubscribeView.as_view(), name='subscribe'),
#     path('upload-document/', DocumentUploadView.as_view(), name='upload-document'),
#     path('contact/', ContactSubmissionView.as_view(), name='contact_submission'),
#     path('booking/', BookingView.as_view(), name='booking'),
#     path('membership-form/', MembershipApplicationViewSet.as_view(), name='membership')
# ]
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SubscribeView, DocumentUploadView, ContactSubmissionView, BookingView, MembershipApplicationViewSet

# Initialize the router
router = DefaultRouter()

# Register the MembershipApplicationViewSet with the router
router.register(r'membership-form', MembershipApplicationViewSet, basename='membership')

# Define urlpatterns
urlpatterns = [
    path('subscribe/', SubscribeView.as_view(), name='subscribe'),
    path('upload-document/', DocumentUploadView.as_view(), name='upload-document'),
    path('contact/', ContactSubmissionView.as_view(), name='contact_submission'),
    path('booking/', BookingView.as_view(), name='booking'),
    # Include the router's URLs
    path('', include(router.urls)),  # This includes the auto-generated routes for the viewset
]
