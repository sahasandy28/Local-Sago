from rest_framework import serializers
from .models import Notification

from .models import (
    ServiceCategory,
    WorkerProfile,
    WorkerImage,
    WorkerReview,
    ProductCategory,
    Product,
    ProductImage,
    FavoriteWorker,
    FavoriteProduct,
)

from .models import WorkerReport, ProductReport

class WorkerReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkerReport
        fields = "__all__"


class ProductReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductReport
        fields = "__all__"


# =========================
# SERVICE SERIALIZERS
# =========================

class ServiceCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceCategory
        fields = "__all__"


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


class WorkerReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkerReview
        fields = "__all__"


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
            total = sum(review.rating for review in reviews)
            return round(total / reviews.count(), 1)

        return 0

    def get_total_reviews(self, obj):
        return obj.reviews.count()


# =========================
# PRODUCT SERIALIZERS
# =========================

class ProductCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductCategory
        fields = "__all__"


class ProductImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = ProductImage
        fields = [
            "id",
            "image",
            "image_url",
            "caption",
            "uploaded_at",
        ]

    def get_image_url(self, obj):
        request = self.context.get("request")

        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)

        return None


class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    category_name = serializers.CharField(
        source="category.name",
        read_only=True
    )

    class Meta:
        model = Product
        fields = "__all__"
        
class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = "__all__"
        
class FavoriteWorkerSerializer(serializers.ModelSerializer):
    worker = WorkerProfileSerializer(read_only=True)

    class Meta:
        model = FavoriteWorker
        fields = "__all__"


class FavoriteProductSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)

    class Meta:
        model = FavoriteProduct
        fields = "__all__"