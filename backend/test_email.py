# test_email.py
import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "voice_of_kingdom.settings")
django.setup()

from django.core.mail import EmailMessage

def test_email():
    subject = "Test Email"
    message = "This is a test email from your Django application."
    from_email = 'info@vokim.ca'
    recipient_list = ['info@vokim.ca']
    
    email = EmailMessage(
        subject,
        message,
        from_email,
        recipient_list,
    )
    
    try:
        email.send()
        print("Email sent successfully!")
    except Exception as e:
        print(f"Failed to send email: {e}")

if __name__ == "__main__":
    test_email()