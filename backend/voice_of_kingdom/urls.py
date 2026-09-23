from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

from apis.urls import csrf

from . import views

urlpatterns = [
    # Health probe for Docker HEALTHCHECK / Caddy
    path("healthz/", views.healthz, name="healthz"),

    path("admin/", admin.site.urls),

    # API
    path("api/", include("apis.urls")),
    path("api/gallery-images/", views.get_gallery_images, name="gallery-images"),

    # Admin gallery management (session + is_staff)
    path("api/gallery/session/", views.GallerySessionView.as_view(), name="gallery-session"),
    path("api/gallery/login/", views.GalleryLoginView.as_view(), name="gallery-login"),
    path("api/gallery/logout/", views.GalleryLogoutView.as_view(), name="gallery-logout"),
    path("api/gallery/sections/", views.GallerySectionsView.as_view(), name="gallery-sections"),
    path("api/gallery/manage/", views.GalleryManageView.as_view(), name="gallery-manage"),
    path("api/gallery/upload/", views.GalleryUploadView.as_view(), name="gallery-upload"),
    path("api/gallery/delete/", views.GalleryDeleteView.as_view(), name="gallery-delete"),

    # Legacy top-level CSRF endpoint (kept for the existing frontend)
    path("csrf/", csrf, name="csrf"),
]

# In local dev without MinIO, serve uploaded files off disk.
if settings.DEBUG and not settings.USE_S3_MEDIA:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# NOTE: the React catch-all route that used to live here is gone.
# The SPA is served by the `frontend` nginx container; Caddy routes
# /api, /admin, /django-static, /healthz here and everything else there.
