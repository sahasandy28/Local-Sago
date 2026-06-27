from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenRefreshView
from .auth_views import signup, login_user
from .views import report_worker, report_product

urlpatterns = [

    # ----------------------------
    # TEST API
    # ----------------------------
    path("test/", views.test_api, name="test"),

    # ----------------------------
    # SERVICE APIs
    # ----------------------------
    path("services/", views.service_list, name="service-list"),

    path("workers/", views.worker_list, name="worker-list"),

    path(
        "workers/<int:pk>/",
        views.worker_detail,
        name="worker-detail",
    ),

    path(
        "workers/register/",
        views.worker_register,
        name="worker-register",
    ),

    path(
        "reviews/add/",
        views.add_review,
        name="add-review",
    ),

    # ----------------------------
    # PRODUCT APIs
    # ----------------------------
    path(
        "product-categories/",
        views.product_category_list,
        name="product-category-list",
    ),

    path(
        "products/",
        views.product_list,
        name="product-list",
    ),

    path(
        "products/<int:pk>/",
        views.product_detail,
        name="product-detail",
    ),

    path(
        "products/register/",
        views.product_register,
        name="product-register",
    ),

    # ----------------------------
    # SEARCH
    # ----------------------------
    path(
        "search/",
        views.unified_search,
        name="unified-search",
    ),

    # ----------------------------
    # AUTH
    # ----------------------------
    path(
        "auth/signup/",
        signup,
        name="signup",
    ),

    path(
        "auth/login/",
        login_user,
        name="login",
    ),

    path(
        "auth/refresh/",
        TokenRefreshView.as_view(),
        name="token_refresh",
    ),

    # ----------------------------
    # HOME
    # ----------------------------
    path(
        "home-stats/",
        views.home_stats,
        name="home-stats",
    ),

    # ----------------------------
    # MY SUBMISSIONS
    # ----------------------------
    path(
        "workers/my-submissions/",
        views.my_worker_submissions,
        name="my-worker-submissions",
    ),

    path(
        "products/my-submissions/",
        views.my_product_submissions,
        name="my-product-submissions",
    ),

    # ----------------------------
    # NOTIFICATIONS
    # ----------------------------
    path(
        "notifications/",
        views.notification_list,
        name="notifications",
    ),

    path(
        "notifications/<int:pk>/read/",
        views.mark_notification_read,
        name="notification-read",
    ),

    # ----------------------------
    # FAVORITES
    # ----------------------------
    path(
        "favorite-worker/",
        views.favorite_worker,
        name="favorite-worker",
    ),

    path(
        "favorite-product/",
        views.favorite_product,
        name="favorite-product",
    ),

    path(
        "my-favorites/",
        views.my_favorites,
        name="my-favorites",
    ),

    path(
        "favorite-worker/<int:pk>/remove/",
        views.remove_favorite_worker,
        name="remove-favorite-worker",
    ),

    path(
        "favorite-product/<int:pk>/remove/",
        views.remove_favorite_product,
        name="remove-favorite-product",
    ),

    # ----------------------------
    # REPORTS
    # ----------------------------
    path(
        "report-worker/",
        report_worker,
        name="report-worker",
    ),

    path(
        "report-product/",
        report_product,
        name="report-product",
    ),
]