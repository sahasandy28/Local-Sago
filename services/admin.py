from django.contrib import admin
from .models import (
    ServiceCategory,
    WorkerProfile,
    WorkerImage,
    WorkerReview,
    ProductCategory,
    Product,
    ProductImage,
    Notification,
    FavoriteWorker,
    FavoriteProduct,
    WorkerReport,
    ProductReport,
)

# =========================
# REPORTS
# =========================
admin.site.register(WorkerReport)
admin.site.register(ProductReport)


# =========================
# INLINE IMAGES
# =========================
class WorkerImageInline(admin.TabularInline):
    model = WorkerImage
    extra = 1


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1


# =========================
# SERVICE CATEGORY
# =========================
@admin.register(ServiceCategory)
class ServiceCategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "is_active", "created_at")
    list_filter = ("is_active",)
    search_fields = ("name", "slug")
    prepopulated_fields = {"slug": ("name",)}


# =========================
# WORKERS
# =========================
@admin.register(WorkerProfile)
class WorkerProfileAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "phone",
        "category",
        "city",
        "service_charge",
        "is_verified",
        "is_available",
        "created_at",
    )

    list_filter = (
        "category",
        "city",
        "is_verified",
        "is_available",
    )

    search_fields = (
        "name",
        "phone",
        "city",
        "area",
        "work_title",
    )

    list_editable = (
        "is_verified",
        "is_available",
    )

    inlines = [WorkerImageInline]


@admin.register(WorkerImage)
class WorkerImageAdmin(admin.ModelAdmin):
    list_display = ("worker", "uploaded_at")
    search_fields = ("worker__name",)


@admin.register(WorkerReview)
class WorkerReviewAdmin(admin.ModelAdmin):
    list_display = ("worker", "reviewer_name", "rating", "created_at")
    list_filter = ("rating",)
    search_fields = ("worker__name", "reviewer_name", "comment")


# =========================
# PRODUCTS
# =========================
@admin.register(ProductCategory)
class ProductCategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "is_active", "created_at")
    list_filter = ("is_active",)
    search_fields = ("name", "slug")
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "seller_name",
        "seller_phone",
        "category",
        "city",
        "price",
        "condition",
        "is_verified",
        "is_available",
        "is_sold",
        "created_at",
    )

    list_filter = (
        "category",
        "city",
        "condition",
        "is_verified",
        "is_available",
        "is_sold",
    )

    search_fields = (
        "title",
        "seller_name",
        "seller_phone",
        "city",
        "area",
        "description",
    )

    list_editable = (
        "is_verified",
        "is_available",
        "is_sold",
    )

    inlines = [ProductImageInline]


@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ("product", "caption", "uploaded_at")
    search_fields = ("product__title", "caption")


# =========================
# MISC
# =========================
admin.site.register(Notification)
admin.site.register(FavoriteWorker)
admin.site.register(FavoriteProduct)