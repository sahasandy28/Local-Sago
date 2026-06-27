from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

# JWT import
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView
)

urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),

    # Main API routes
    path('api/', include('services.urls')),

    # 🔐 JWT AUTH ROUTES (IMPORTANT)
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

# Media files (images/uploads)
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)