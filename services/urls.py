from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .auth_views import signup, login_user
from .views import report_worker, report_product


urlpatterns = [
    # SERVICE APIs
    path("services/", views.service_list, name="service-list"),

    path("workers/", views.worker_list, name="worker-list"),

    path(
        "workers/<int:pk>/",
        views.worker_detail,
        name="worker-detail"
    ),

    path(
        "workers/register/",
        views.worker_register,
        name="worker-register"
    ),

    path(
        "reviews/add/",
        views.add_review,
        name="add-review"
    ),

    # PRODUCT APIs
    path(
        "product-categories/",
        views.product_category_list,
        name="product-category-list"
    ),

    path(
        "products/",
        views.product_list,
        name="product-list"
    ),

    path(
        "products/<int:pk>/",
        views.product_detail,
        name="product-detail"
    ),

    path(
        "products/register/",
        views.product_register,
        name="product-register"
    ),
    
    path(
        "search/", 
         views.unified_search,
         name="unified-search"
    ),
    
    path(
        "auth/refresh/", 
         TokenRefreshView.as_view(), 
         name="token_refresh"
    ),
    
    path(
        "auth/signup/", 
        signup, name="signup"
    ),
    
    path(
        "auth/login/",
        login_user, 
        name="login"
    ),
    
    path(
        "home-stats/", 
        views.home_stats, 
        name="home-stats"
    ),
    
    path(
        "workers/my-submissions/", 
        views.my_worker_submissions
        
    ),
    
    path(
        "products/my-submissions/", 
        views.my_product_submissions
    
    ),
    
    path(
        "notifications/", 
        views.notification_list
    
    ),
    
    path(
        "notifications/<int:pk>/read/", 
        views.mark_notification_read
    
    ),
    
    path(
        "report-worker/",
        report_worker,
    ),

    path(
        "report-product/",
        report_product,
    ),
    
    path("favorite-worker/", views.favorite_worker),
    path("favorite-product/", views.favorite_product),
    path("my-favorites/", views.my_favorites),
    path("favorite-worker/<int:pk>/remove/", views.remove_favorite_worker),
    path("favorite-product/<int:pk>/remove/", views.remove_favorite_product),
    
    
]