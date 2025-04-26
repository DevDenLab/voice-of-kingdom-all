from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Document
from .views import send_newsletter_to_subscribers

@receiver(post_save, sender=Document)
def notify_subscribers(sender, instance, created, **kwargs):
    if created:
        send_newsletter_to_subscribers(instance)
