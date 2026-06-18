from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import WorkerProfile, Product, Notification


@receiver(post_save, sender=WorkerProfile)
def worker_verified_notification(sender, instance, created, **kwargs):
    if created:
        return

    if instance.is_verified:
        exists = Notification.objects.filter(
            phone=instance.phone,
            title="Worker Profile Verified",
            message__icontains=instance.name,
        ).exists()

        if not exists:
            Notification.objects.create(
                title="Worker Profile Verified",
                message=f"Hi {instance.name}, your {instance.work_title} profile has been approved and is now visible to customers.",
                phone=instance.phone,
            )


@receiver(post_save, sender=Product)
def product_verified_notification(sender, instance, created, **kwargs):
    if created:
        return

    if instance.is_verified:
        exists = Notification.objects.filter(
            phone=instance.seller_phone,
            title="Product Approved",
            message__icontains=instance.title,
        ).exists()

        if not exists:
            Notification.objects.create(
                title="Product Approved",
                message=f"Hi {instance.seller_name}, your product '{instance.title}' has been approved and is now live.",
                phone=instance.seller_phone,
            )