from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from django.conf import settings
from django.conf.urls.static import static
from apis.urls import csrf
from . import views
urlpatterns = [
    # Admin URL must come before the catch-all route
    path('admin/', admin.site.urls),
    
    # API endpoints
    path('api/', include('apis.urls')),
    
    # CSRF endpoint
    path('csrf/', csrf, name='csrf'),
    
    path('api/gallery-images/', views.get_gallery_images, name='gallery-images'),
    
    
    # Static and media files
    *static(settings.STATIC_URL, document_root=settings.STATIC_ROOT),
    *static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT),
    
    # Catch-all route for React app - must be last
    re_path(r'^(?!admin|api|csrf|static|media).*$', TemplateView.as_view(template_name='index.html')),
]

# Debug-only media serving
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)