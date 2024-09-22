from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import EmailMessage
from django.conf import settings
from django.template.loader import render_to_string
from .models import Document, Subscriber

@receiver(post_save, sender=Document)
def send_document_notification(sender, instance, created, **kwargs):
    if created:  # Only send email when a new document is created
        subscribers = Subscriber.objects.all()
        document_path = instance.file.path  # Path to the uploaded document file
        
        for subscriber in subscribers:
            # Create email with attachment
            email = EmailMessage(
                subject='New Document Added',
                body=f'A new document titled "{instance.title}" has been uploaded.',
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[subscriber.email],
            )
            
            # Attach the document
            email.attach_file(document_path)

            # Send the email
            email.send()
        
        print("Emails sent to all subscribers with document attached.")
