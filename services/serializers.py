from rest_framework import serializers
from .models import (
    Notification,
    ServiceCategory,
    WorkerProfile,
    WorkerImage,
    WorkerReview,
    ProductCategory,
    Product,
    ProductImage,
    FavoriteWorker,
    FavoriteProduct,
    WorkerReport,
    ProductReport,
)

# =========================
# REPORT SERIALIZERS
# =========================
class WorkerReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkerReport
        fields = "__all__"


class ProductReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductReport
        fields = "__all__"


# =========================
# SERVICE
# =========================
class ServiceCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceCategory
        fields = "__all__"


# =========================
# WORKER IMAGES
# =========================
class WorkerImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = WorkerImage
        fields = ["id", "image", "image_url", "uploaded_at"]

    def get_image_url(self, obj):
        request = self.context.get("request")
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return None


# =========================
# WORKER REVIEWS
# =========================
class WorkerReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkerReview
        fields = ["id", "reviewer_name", "rating", "comment", "created_at"]


# =========================
# WORKER PROFILE
# =========================
class WorkerProfileSerializer(serializers.ModelSerializer):
    images = WorkerImageSerializer(many=True, read_only=True)
    reviews = WorkerReviewSerializer(many=True, read_only=True)

    average_rating = serializers.SerializerMethodField()
    total_reviews = serializers.SerializerMethodField()

    class Meta:
        model = WorkerProfile
        fields = "__all__"

    def get_average_rating(self, obj):
        reviews = obj.reviews.all()
        if reviews.exists():
            total = sum(r.rating for r in reviews)
            return round(total / reviews.count(), 1)
        return 0

    def get_total_reviews(self, obj):
        return obj.reviews.count()


# =========================
# PRODUCT CATEGORY
# =========================
class ProductCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductCategory
        fields = "__all__"


# =========================
# PRODUCT IMAGES
# =========================
class ProductImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = ProductImage
        fields = ["id", "image", "image_url", "caption", "uploaded_at"]

    def get_image_url(self, obj):
        request = self.context.get("request")
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return None


# =========================
# PRODUCT
# =========================
class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    category_name = serializers.CharField(source="category.name", read_only=True)

    class Meta:
        model = Product
        fields = "__all__"


# =========================
# NOTIFICATION
# =========================
class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = "__all__"


# =========================
# FAVORITES
# =========================
class FavoriteWorkerSerializer(serializers.ModelSerializer):
    worker = WorkerProfileSerializer(read_only=True)

    class Meta:
        model = FavoriteWorker
        fields = ["id", "phone", "worker", "created_at"]


class FavoriteProductSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)

    class Meta:
        model = FavoriteProduct
        fields = ["id", "phone", "product", "created_at"]