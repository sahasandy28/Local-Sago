from django.db import models


# =========================
# SERVICE CATEGORY
# =========================

class ServiceCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True)
    icon = models.CharField(max_length=50, blank=True, null=True)
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Service Categories"

    def __str__(self):
        return self.name


# =========================
# WORKER PROFILE
# =========================

class WorkerProfile(models.Model):
    category = models.ForeignKey(
        ServiceCategory,
        on_delete=models.CASCADE,
        related_name="workers"
    )

    name = models.CharField(max_length=120)
    phone = models.CharField(max_length=15)
    email = models.EmailField(blank=True, null=True)

    work_title = models.CharField(max_length=150)

    work_description = models.TextField()

    experience = models.PositiveIntegerField(default=0)

    service_charge = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    address = models.TextField()

    area = models.CharField(
        max_length=120,
        blank=True,
        null=True
    )

    city = models.CharField(max_length=120)

    latitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        blank=True,
        null=True
    )

    longitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        blank=True,
        null=True
    )

    is_verified = models.BooleanField(default=False)
    is_available = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


# =========================
# WORKER IMAGES
# =========================

class WorkerImage(models.Model):
    worker = models.ForeignKey(
        WorkerProfile,
        on_delete=models.CASCADE,
        related_name="images"
    )

    image = models.ImageField(upload_to="worker_images/")

    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.worker.name} Image"


# =========================
# WORKER REVIEWS
# =========================

class WorkerReview(models.Model):
    worker = models.ForeignKey(
        WorkerProfile,
        on_delete=models.CASCADE,
        related_name="reviews"
    )

    reviewer_name = models.CharField(max_length=120)

    rating = models.IntegerField(default=5)

    comment = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.worker.name} Review"


# =========================
# PRODUCT CATEGORY
# =========================

class ProductCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)

    slug = models.SlugField(
        max_length=120,
        unique=True
    )

    icon = models.CharField(
        max_length=50,
        blank=True,
        null=True
    )

    description = models.TextField(
        blank=True,
        null=True
    )

    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Product Categories"

    def __str__(self):
        return self.name


# =========================
# PRODUCT
# =========================

class Product(models.Model):

    CONDITION_CHOICES = (
        ("new", "New"),
        ("used", "Used"),
    )

    category = models.ForeignKey(
        ProductCategory,
        on_delete=models.CASCADE,
        related_name="products"
    )

    seller_name = models.CharField(max_length=120)

    seller_phone = models.CharField(max_length=15)

    title = models.CharField(max_length=160)

    description = models.TextField()

    price = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    condition = models.CharField(
        max_length=20,
        choices=CONDITION_CHOICES,
        default="new"
    )

    address = models.TextField()

    area = models.CharField(
        max_length=120,
        blank=True,
        null=True
    )

    city = models.CharField(max_length=120)

    latitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        blank=True,
        null=True
    )

    longitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        blank=True,
        null=True
    )

    is_verified = models.BooleanField(default=False)

    is_available = models.BooleanField(default=True)

    is_sold = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


# =========================
# PRODUCT IMAGES
# =========================

class ProductImage(models.Model):

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="images"
    )

    image = models.ImageField(
        upload_to="product_images/"
    )

    caption = models.CharField(
        max_length=150,
        blank=True,
        null=True
    )

    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.product.title} Image"
    
# =========================
# NOTIFICATION
# =========================

class Notification(models.Model):
    title = models.CharField(max_length=150)
    message = models.TextField()
    phone = models.CharField(max_length=15, blank=True, null=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

# =========================
# FAVORITES
# =========================

class FavoriteWorker(models.Model):
    phone = models.CharField(max_length=15)

    worker = models.ForeignKey(
        WorkerProfile,
        on_delete=models.CASCADE,
        related_name="favorite_workers"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("phone", "worker")

    def __str__(self):
        return f"{self.phone} - {self.worker.name}"


class FavoriteProduct(models.Model):
    phone = models.CharField(max_length=15)

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="favorite_products"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("phone", "product")

    def __str__(self):
        return f"{self.phone} - {self.product.title}"
    
    # =========================
# REPORT SYSTEM
# =========================

class WorkerReport(models.Model):
    REPORT_CHOICES = (
        ("fake", "Fake Profile"),
        ("wrong_contact", "Wrong Contact"),
        ("bad_behavior", "Bad Behavior"),
        ("spam", "Spam"),
        ("other", "Other"),
    )

    worker = models.ForeignKey(
        WorkerProfile,
        on_delete=models.CASCADE,
        related_name="reports"
    )

    reporter_phone = models.CharField(max_length=15)

    reason = models.CharField(
        max_length=50,
        choices=REPORT_CHOICES
    )

    description = models.TextField(
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.worker.name} - {self.reason}"


class ProductReport(models.Model):
    REPORT_CHOICES = (
        ("fake", "Fake Product"),
        ("wrong_info", "Wrong Information"),
        ("spam", "Spam"),
        ("scam", "Scam"),
        ("other", "Other"),
    )

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="reports"
    )

    reporter_phone = models.CharField(max_length=15)

    reason = models.CharField(
        max_length=50,
        choices=REPORT_CHOICES
    )

    description = models.TextField(
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.product.title} - {self.reason}"