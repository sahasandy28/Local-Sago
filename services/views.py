from math import radians, sin, cos, sqrt, atan2

from django.shortcuts import get_object_or_404
from django.db.models import Q

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import parser_classes

from .models import Notification
from .serializers import NotificationSerializer

from .models import (
    ServiceCategory,
    WorkerProfile,
    WorkerReview,
    ProductCategory,
    Product,
    ProductImage,
    FavoriteWorker,
    FavoriteProduct,
)

from .models import WorkerReport, ProductReport
from .serializers import (
    WorkerReportSerializer,
    ProductReportSerializer,
)

from .serializers import (
    ServiceCategorySerializer,
    WorkerProfileSerializer,
    WorkerReviewSerializer,
    ProductCategorySerializer,
    ProductSerializer,
    FavoriteWorkerSerializer,
    FavoriteProductSerializer,
)


# =========================
# DISTANCE CALCULATION
# =========================

def calculate_distance_km(lat1, lon1, lat2, lon2):
    try:
        lat1 = float(lat1)
        lon1 = float(lon1)
        lat2 = float(lat2)
        lon2 = float(lon2)

        earth_radius = 6371

        dlat = radians(lat2 - lat1)
        dlon = radians(lon2 - lon1)

        a = (
            sin(dlat / 2) ** 2
            + cos(radians(lat1))
            * cos(radians(lat2))
            * sin(dlon / 2) ** 2
        )

        c = 2 * atan2(sqrt(a), sqrt(1 - a))

        return round(earth_radius * c, 2)

    except:
        return None

# =========================
# SERVICE APIs
# =========================

@api_view(["GET"])
def service_list(request):
    services = ServiceCategory.objects.filter(is_active=True)

    serializer = ServiceCategorySerializer(
        services,
        many=True
    )

    return Response(serializer.data)


@api_view(["GET"])
def worker_list(request):
    service = request.GET.get("service")
    search = request.GET.get("search")
    lat = request.GET.get("lat")
    lon = request.GET.get("lon")

    workers = WorkerProfile.objects.filter(
        is_verified=True,
        is_available=True
    )

    if service:
        workers = workers.filter(category__slug=service)

    if search:
        workers = workers.filter(
            Q(name__icontains=search)
            | Q(work_title__icontains=search)
            | Q(work_description__icontains=search)
            | Q(area__icontains=search)
            | Q(city__icontains=search)
        )

    serializer = WorkerProfileSerializer(
        workers,
        many=True,
        context={"request": request}
    )

    data = serializer.data

    if lat and lon:
        updated_data = []

        for item in data:
            distance = calculate_distance_km(
                lat,
                lon,
                item.get("latitude"),
                item.get("longitude")
            )

            item["distance_km"] = distance
            updated_data.append(item)

        updated_data.sort(
            key=lambda x: x["distance_km"] if x["distance_km"] is not None else 999999
        )

        return Response(updated_data)

    return Response(data)


@api_view(["GET"])
def worker_detail(request, pk):
    worker = get_object_or_404(
        WorkerProfile,
        pk=pk,
        is_verified=True
    )

    serializer = WorkerProfileSerializer(
        worker,
        context={"request": request}
    )

    return Response(serializer.data)


@api_view(["POST"])
def worker_register(request):
    serializer = WorkerProfileSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save(is_verified=False)

        return Response({
            "success": True,
            "message": "Worker profile submitted successfully. Waiting for verification.",
            "data": serializer.data,
        })

    return Response({
        "success": False,
        "errors": serializer.errors
    }, status=400)


@api_view(["POST"])
def add_review(request):
    serializer = WorkerReviewSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()

        return Response({
            "success": True,
            "message": "Review added successfully"
        })

    return Response({
        "success": False,
        "errors": serializer.errors
    }, status=400)


# =========================
# PRODUCT APIs
# =========================

@api_view(["GET"])
def product_category_list(request):
    categories = ProductCategory.objects.filter(is_active=True)

    serializer = ProductCategorySerializer(
        categories,
        many=True
    )

    return Response(serializer.data)


@api_view(["GET"])
def product_list(request):
    category = request.GET.get("category")
    search = request.GET.get("search")
    lat = request.GET.get("lat")
    lon = request.GET.get("lon")

    products = Product.objects.filter(
        is_verified=True,
        is_available=True,
        is_sold=False
    )

    if category:
        products = products.filter(category__slug=category)

    if search:
        products = products.filter(
            Q(title__icontains=search)
            | Q(description__icontains=search)
            | Q(area__icontains=search)
            | Q(city__icontains=search)
            | Q(seller_name__icontains=search)
        )

    serializer = ProductSerializer(
        products,
        many=True,
        context={"request": request}
    )

    data = serializer.data

    if lat and lon:
        updated_data = []

        for item in data:
            distance = calculate_distance_km(
                lat,
                lon,
                item.get("latitude"),
                item.get("longitude")
            )

            item["distance_km"] = distance
            updated_data.append(item)

        updated_data.sort(
            key=lambda x: x["distance_km"] if x["distance_km"] is not None else 999999
        )

        return Response(updated_data)

    return Response(data)

@api_view(["GET"])
def product_detail(request, pk):
    product = get_object_or_404(
        Product,
        pk=pk,
        is_verified=True
    )

    serializer = ProductSerializer(
        product,
        context={"request": request}
    )

    return Response(serializer.data)


@api_view(["POST"])
@parser_classes([MultiPartParser, FormParser])
def product_register(request):
    serializer = ProductSerializer(data=request.data)

    if serializer.is_valid():
        product = serializer.save(is_verified=False)

        images = request.FILES.getlist("images")

        for image in images:
            ProductImage.objects.create(
                product=product,
                image=image
            )

        return Response({
            "success": True,
            "message": "Product submitted successfully. Waiting for verification.",
            "data": ProductSerializer(
                product,
                context={"request": request}
            ).data,
        })

    return Response({
        "success": False,
        "errors": serializer.errors
    }, status=400)
    
@api_view(["GET"])
def unified_search(request):
    search = request.GET.get("search")

    if not search:
        return Response({
            "workers": [],
            "products": []
        })

    workers = WorkerProfile.objects.filter(
        is_verified=True,
        is_available=True
    ).filter(
        Q(name__icontains=search)
        | Q(city__icontains=search)
        | Q(area__icontains=search)
        | Q(work_title__icontains=search)
        | Q(work_description__icontains=search)
    )[:5]

    products = Product.objects.filter(
        is_verified=True,
        is_available=True,
        is_sold=False
    ).filter(
        Q(title__icontains=search)
        | Q(description__icontains=search)
        | Q(city__icontains=search)
        | Q(area__icontains=search)
        | Q(seller_name__icontains=search)
    )[:5]

    worker_serializer = WorkerProfileSerializer(
        workers,
        many=True,
        context={"request": request}
    )

    product_serializer = ProductSerializer(
        products,
        many=True,
        context={"request": request}
    )

    return Response({
        "workers": worker_serializer.data,
        "products": product_serializer.data
        
    })
    
@api_view(["GET"])
def home_stats(request):
    verified_workers = WorkerProfile.objects.filter(
        is_verified=True
    ).count()

    service_categories = ServiceCategory.objects.count()

    verified_products = Product.objects.filter(
        is_verified=True,
        is_sold=False
    ).count()

    return Response({
        "verified_workers": verified_workers,
        "nearby_services": service_categories,
        "local_products": verified_products,
    })
    
@api_view(["GET"])
def my_worker_submissions(request):
    phone = request.GET.get("phone")

    workers = WorkerProfile.objects.all().order_by("-id")

    if phone:
        workers = workers.filter(phone=phone)

    serializer = WorkerProfileSerializer(
        workers,
        many=True,
        context={"request": request}
    )

    return Response(serializer.data)


@api_view(["GET"])
def my_product_submissions(request):
    phone = request.GET.get("phone")

    products = Product.objects.all().order_by("-id")

    if phone:
        products = products.filter(seller_phone=phone)

    serializer = ProductSerializer(
        products,
        many=True,
        context={"request": request}
    )

    return Response(serializer.data)

@api_view(["GET"])
def notification_list(request):
    phone = request.GET.get("phone")

    notifications = Notification.objects.all().order_by("-created_at")

    if phone:
        notifications = notifications.filter(phone=phone)

    serializer = NotificationSerializer(notifications, many=True)
    return Response(serializer.data)


@api_view(["POST"])
def mark_notification_read(request, pk):
    try:
        notification = Notification.objects.get(id=pk)
        notification.is_read = True
        notification.save()

        return Response({"message": "Notification marked as read"})
    except Notification.DoesNotExist:
        return Response({"error": "Notification not found"}, status=404)


@api_view(["POST"])
def favorite_worker(request):
    phone = request.data.get("phone")
    worker_id = request.data.get("worker")

    if not phone or not worker_id:
        return Response({"error": "Phone and worker id required"}, status=400)

    try:
        worker = WorkerProfile.objects.get(id=worker_id)

        favorite, created = FavoriteWorker.objects.get_or_create(
            phone=phone,
            worker=worker
        )

        if created:
            return Response({"message": "Worker saved successfully"}, status=201)

        return Response({"message": "Worker already saved"}, status=200)

    except WorkerProfile.DoesNotExist:
        return Response({"error": "Worker not found"}, status=404)


@api_view(["POST"])
def favorite_product(request):
    phone = request.data.get("phone")
    product_id = request.data.get("product")

    if not phone or not product_id:
        return Response({"error": "Phone and product id required"}, status=400)

    try:
        product = Product.objects.get(id=product_id)

        favorite, created = FavoriteProduct.objects.get_or_create(
            phone=phone,
            product=product
        )

        if created:
            return Response({"message": "Product saved successfully"}, status=201)

        return Response({"message": "Product already saved"}, status=200)

    except Product.DoesNotExist:
        return Response({"error": "Product not found"}, status=404)


@api_view(["GET"])
def my_favorites(request):
    phone = request.GET.get("phone")

    if not phone:
        return Response({"error": "Phone required"}, status=400)

    workers = FavoriteWorker.objects.filter(phone=phone).order_by("-created_at")
    products = FavoriteProduct.objects.filter(phone=phone).order_by("-created_at")

    worker_serializer = FavoriteWorkerSerializer(
        workers,
        many=True,
        context={"request": request}
    )

    product_serializer = FavoriteProductSerializer(
        products,
        many=True,
        context={"request": request}
    )

    return Response({
        "workers": worker_serializer.data,
        "products": product_serializer.data
    })


@api_view(["DELETE"])
def remove_favorite_worker(request, pk):
    phone = request.GET.get("phone")

    try:
        favorite = FavoriteWorker.objects.get(worker_id=pk, phone=phone)
        favorite.delete()

        return Response({"message": "Worker removed from favorites"})

    except FavoriteWorker.DoesNotExist:
        return Response({"error": "Favorite worker not found"}, status=404)


@api_view(["DELETE"])
def remove_favorite_product(request, pk):
    phone = request.GET.get("phone")

    try:
        favorite = FavoriteProduct.objects.get(product_id=pk, phone=phone)
        favorite.delete()

        return Response({"message": "Product removed from favorites"})

    except FavoriteProduct.DoesNotExist:
        return Response({"error": "Favorite product not found"}, status=404)
    
@api_view(["POST"])
def report_worker(request):

    serializer = WorkerReportSerializer(
        data=request.data
    )

    if serializer.is_valid():
        serializer.save()

        return Response(
            {"message": "Worker reported successfully"}
        )

    return Response(
        serializer.errors,
        status=400
    )


@api_view(["POST"])
def report_product(request):

    serializer = ProductReportSerializer(
        data=request.data
    )

    if serializer.is_valid():
        serializer.save()

        return Response(
            {"message": "Product reported successfully"}
        )

    return Response(
        serializer.errors,
        status=400
    )