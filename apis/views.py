from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from .models import Subscriber, Document
import json
from django.views.decorators.csrf import csrf_exempt, csrf_protect
from django.utils.html import strip_tags
import os
from django.core.files.storage import default_storage
from django.conf import settings
import os
from .serializers import BandBookingSerializer
from .utils import generate_booking_pdf
from django.http import JsonResponse
from django.core.mail import EmailMessage
from .models import BandBooking
import json
import os

from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view

@csrf_protect
def subscribe(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            if not email:
                return JsonResponse({'error': 'Email is required'}, status=400)

            subscriber, created = Subscriber.objects.get_or_create(email=email)
            if not created:
                return JsonResponse({'message': 'Already subscribed'}, status=200)

            return JsonResponse({'message': 'Subscription successful'}, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Invalid request method'}, status=400)

@csrf_exempt
def upload_document(request):
    if request.method == 'POST':
        title = request.POST.get('title')
        file = request.FILES.get('file')

        if not title or not file:
            return JsonResponse({'error': 'Title and file are required'}, status=400)

        # Validate file type if needed
        allowed_extensions = ['.pdf', '.doc', '.docx']
        file_extension = os.path.splitext(file.name)[1].lower()
        if file_extension not in allowed_extensions:
            return JsonResponse({'error': 'Invalid file type'}, status=400)

        # Save document with file size limit
        if file.size > 10 * 1024 * 1024:  # 10MB limit
            return JsonResponse({'error': 'File size too large'}, status=400)

        document = Document.objects.create(title=title, file=file)
        send_newsletter_to_subscribers(document)
        return JsonResponse({'message': 'Document uploaded successfully'}, status=201)

    return JsonResponse({'error': 'Invalid request method'}, status=400)

@csrf_exempt
def send_newsletter_to_subscribers(document):
    try:
        subscribers = Subscriber.objects.all()
        subject = f"New Newsletter: {document.title}"
        
        for subscriber in subscribers:
            # Render HTML content
            html_message = render_to_string('emails/newsletter_template.html', {
                'document': document,
                'media_url': settings.MEDIA_URL,
                'domain': settings.ALLOWED_HOSTS[0]
            })
            
            # Create plain text version
            plain_message = strip_tags(html_message)
            
            # Create email message
            email = EmailMultiAlternatives(
                subject=subject,
                body=plain_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[subscriber.email]
            )
            
            # Attach HTML version
            email.attach_alternative(html_message, "text/html")
            
            # Attach the document file
            if document.file:
                file_path = document.file.path
                filename = os.path.basename(file_path)
                
                with open(file_path, 'rb') as f:
                    content = f.read()
                    email.attach(filename, content, get_content_type(filename))
            
            # Send email
            email.send(fail_silently=False)
            
    except Exception as e:
        print(f"Error sending newsletter: {str(e)}")

def get_content_type(filename):
    """Return the content type based on file extension"""
    extension = os.path.splitext(filename)[1].lower()
    content_types = {
        '.pdf': 'application/pdf',
        '.doc': 'application/msword',
        '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    }
    return content_types.get(extension, 'application/octet-stream')



@csrf_exempt
def band_booking(request):
    if request.method == "POST":
        try:
            form_data = json.loads(request.body.decode('utf-8', errors='replace'))
            print(f"Received form data: {form_data}")  # Enhanced logging
            
            # Deserialize and save the data
            serializer = BandBookingSerializer(data=form_data)
            if serializer.is_valid():
                booking = serializer.save()  # Save to database only once
            else:
                return JsonResponse({"error": f"Invalid form data: {serializer.errors}"}, status=400)

            # Generate PDF
            pdf_file = generate_booking_pdf(booking)
            
            # Email to admin
            subject = f"New Booking Request: {booking.event_host}"
            message = f"A new band booking request has been submitted. Please find the details in the attached PDF."
            from_email = settings.DEFAULT_FROM_EMAIL
            recipient_list = [settings.ADMIN_EMAIL]  # Just use the admin email

            admin_email = EmailMessage(
                subject,
                message,
                from_email,
                recipient_list,
                reply_to=[form_data.get('email')]  # Set reply-to as the form submitter's email
            )
            
            # Attach PDF to admin email
            with open(pdf_file, 'rb') as f:
                file_data = f.read()
                admin_email.attach(os.path.basename(pdf_file), file_data, 'application/pdf')
            
            try:
                admin_email.send()
                print(f"Admin email sent successfully to {recipient_list}")
            except Exception as email_error:
                print(f"Error sending admin email: {email_error}")
            
            # Send confirmation email to the user
            user_email = form_data.get('contact_email')
            print(f"User email extracted from form: {user_email}")  # Verify email extraction
            
            if not user_email:
                print("Warning: No user email found in form data")
                # Try to get email from the saved booking object if available
                try:
                    user_email = booking.email
                    print(f"Retrieved email from booking object: {user_email}")
                except AttributeError:
                    print("Email not found in booking object either")
            
            if user_email:
                # Get user details for the email
                contact_name = form_data.get('contact_name', form_data.get('name', 'there')).split()[0]
                
                # Access date directly from form_data 
                event_date = form_data.get('event_date', 'your requested date')
                # Format the date if it's a string in ISO format
                if isinstance(event_date, str) and event_date != 'your requested date':
                    try:
                        from datetime import datetime
                        parsed_date = datetime.strptime(event_date, '%Y-%m-%d')
                        event_date = parsed_date.strftime('%B %d, %Y')
                    except ValueError:
                        # If date parsing fails, keep the original string
                        pass
                
                # Get other event details with fallbacks
                event_name = form_data.get('event_name', 'your event')
                venue_name = form_data.get('venue_name', 'your venue')
                event_host = form_data.get('event_host', 'your organization')
                
                # Create confirmation email
                confirmation_subject = "Your VOKIM Gospel Band Booking Request Confirmation"
                confirmation_message = f"""Dear {contact_name},

Thank you for your interest in booking VOKIM Gospel Band for {event_name} on {event_date}!

We have received your booking request and are reviewing the details. A member of our team will be in touch with you shortly to discuss your event requirements and availability.

Here's a summary of your booking request:
- Event: {event_name}
- Date: {event_date}
- Venue: {venue_name}
- Event Host: {event_host}

If you need to make any changes to your booking or have any questions, please don't hesitate to reply to this email or contact us directly.

We look forward to the possibility of sharing our music ministry at your event!

Blessings,
VOKIM
"""
                # Create email message object
                confirmation_email = EmailMessage(
                    confirmation_subject,
                    confirmation_message,
                    from_email,
                    [user_email]
                )
                
                # Try sending with better error handling
                try:
                    print(f"Attempting to send confirmation email to: {user_email}")
                    confirmation_email.send(fail_silently=False)
                    print(f"Confirmation email sent successfully to {user_email}")
                except Exception as email_error:
                    print(f"Error sending confirmation email: {email_error}")
                    # Continue execution even if confirmation email fails
            else:
                print("Cannot send confirmation email: No valid email address found")
            
            os.remove(pdf_file)  # Clean up
            
            return JsonResponse({"message": "Your booking request has been submitted. We'll get back to you soon!"}, status=201)

        except Exception as e:
            print(f"Error processing booking request: {e}")  # Log the error for debugging
            return JsonResponse({"error": f"Failed to process booking request: {str(e)}"}, status=500)

    return JsonResponse({"error": "Invalid HTTP method"}, status=405)



# views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import ContactUsSubmission
from .serializers import ContactUsSubmissionSerializer
from django.core.mail import EmailMessage
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
def contact_us_submission(request):
    if request.method == "POST":
        try:
            form_data = json.loads(request.body)
            print(form_data)
            
            # Deserialize and save the data
            serializer = ContactUsSubmissionSerializer(data=form_data)
            if serializer.is_valid():
                serializer.save()  # Save to database only once
            else:
                return JsonResponse({"error": f"Invalid form data: {serializer.errors}"}, status=400)

            subject = f"New Contact Us Submission: {form_data.get('subject')}"
            message = f"""
                You have received a new contact submission:

                Name: {form_data.get('name')}
                Email: {form_data.get('email')}
                Phone: {form_data.get('phone')}
                Source: {form_data.get('source')}
                Subject: {form_data.get('subject')}
                Message: {form_data.get('message')}
            """
            from_email = settings.DEFAULT_FROM_EMAIL
            recipient_list = [settings.ADMIN_EMAIL]  # Just use the admin email

            email = EmailMessage(
                subject,
                message,
                from_email,
                recipient_list,
                reply_to=[form_data.get('email')]  # Set reply-to as the form submitter's email
            )
            email.send()
            
            return JsonResponse({"message": "Your response has been submitted. We'll get back to you soon!"}, status=201)

        except Exception as e:
            print(f"Error processing form: {e}")  # Log the error for debugging
            return JsonResponse({"error": f"Failed to process submission: {str(e)}"}, status=500)

    return JsonResponse({"error": "Invalid HTTP method"}, status=405)


from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import EmailMessage
from .models import GospelBandApplication
import json
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle
from io import BytesIO

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from io import BytesIO
import json
from django.core.mail import EmailMessage
from django.conf import settings
import tempfile
import os
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import EmailMessage
from .models import GospelBandApplication
import json
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph
from reportlab.lib.styles import getSampleStyleSheet
from io import BytesIO
import tempfile
import os
from django.conf import settings

def generate_pdf(data, application_type):
    """Generate PDF for application data"""
    # Create a temporary file
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.pdf')
    filename = temp_file.name
    temp_file.close()
    
    # Generate PDF
    doc = SimpleDocTemplate(filename, pagesize=letter)
    elements = []
    
    # Create styles for text wrapping
    styles = getSampleStyleSheet()
    normal_style = styles["Normal"]
    normal_style.wordWrap = 'CJK'  # Better word wrapping
    
    # Format the data with proper text wrapping
    table_data = []
    table_data.append([f"{application_type.title()} Application Details", ""])
    
    # Process each field for the table
    for k, v in data.items():
        # Skip date fields that might cause issues and null values
        if k == 'created_at' or v is None:
            continue
            
        key = k.replace('_', ' ').title()
        
        # Convert all text values to Paragraph objects for proper wrapping
        if isinstance(v, str) and len(v) > 20:
            value = Paragraph(v, normal_style)
        else:
            value = v
            
        table_data.append([key, value])
    
    # Set column widths - make second column wider for text wrapping
    col_widths = [150, 350]
    
    # Create table with specific column widths
    t = Table(table_data, colWidths=col_widths)
    
    # Apply table styling with proper cell padding
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 12),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('TEXTCOLOR', (0, 1), (-1, -1), colors.black),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 1), (-1, -1), 10),
        ('TOPPADDING', (0, 1), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 1), (-1, -1), 6),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),  # Align text to top of cell
        ('GRID', (0, 0), (-1, -1), 1, colors.black)
    ]))
    
    elements.append(t)
    doc.build(elements)
    
    return filename

def send_emails(data, pdf_filename, application_type):
    """Send confirmation emails to admin and applicant"""
    # Read the PDF file
    with open(pdf_filename, 'rb') as f:
        pdf_data = f.read()
    
    # Send email with PDF attachment to VOKIM
    admin_email = EmailMessage(
        f'New {application_type.title()} Application',
        f'Please find attached the new {application_type} application form from {data.get("full_name", "Applicant")}.',
        settings.DEFAULT_FROM_EMAIL,
        ['info@vokim.ca']
    )
    admin_email.attach('application.pdf', pdf_data, 'application/pdf')
    admin_email.send()
    
    # Send confirmation email to the applicant
    applicant_email = data.get('email')
    username = data.get('full_name', 'Applicant').split()[0]  # Get first name as username
    
    if applicant_email:
        confirmation_email = EmailMessage(
            'Your VOKIM Gospel Band Application',
            f'''Hello {username},
            
Thank you for your interest in joining VOKIM! We have received your {application_type} application and appreciate your passion to support God's work. Our team will carefully review your submission, and we will reach out to you soon regarding the next steps.

If you have any questions in the meantime, feel free to reply to this email. Stay blessed, and we look forward to connecting with you!

Blessings,
VOKIM''',
            settings.DEFAULT_FROM_EMAIL,
            [applicant_email]
        )
        confirmation_email.send()

@csrf_exempt
def submit_musician_application(request):
    """Handle musician application submission"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            # Convert empty strings to None for integer fields
            if data.get('hours_per_week') == '':
                data['hours_per_week'] = None
            # Add application type
            data['application_type'] = 'musician'
            
            # Create application
            application = GospelBandApplication.objects.create(**data)
            
            # Generate PDF
            pdf_filename = generate_pdf(data, 'musician')
            
            # Send emails
            send_emails(data, pdf_filename, 'musician')
            
            # Clean up the temporary file
            os.remove(pdf_filename)
            
            return JsonResponse({
                'status': 'success', 
                'message': 'Your musician application has been successfully submitted! Someone from our team will be in contact soon.'
            })
        
        except Exception as e:
            print(f"Error processing musician application: {e}")
            return JsonResponse({
                'status': 'error', 
                'message': f'An error occurred: {str(e)}'
            }, status=500)
            
    return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=405)

@csrf_exempt
def submit_non_musician_application(request):
    """Handle non-musician application submission"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            # Add application type
            data['application_type'] = 'non-musician'
            
            # Create application
            application = GospelBandApplication.objects.create(**data)
            
            # Generate PDF
            pdf_filename = generate_pdf(data, 'non-musician')
            
            # Send emails
            send_emails(data, pdf_filename, 'non-musician')
            
            # Clean up the temporary file
            os.remove(pdf_filename)
            
            return JsonResponse({
                'status': 'success', 
                'message': 'Your non-musician application has been successfully submitted! Someone from our team will be in contact soon.'
            })
        
        except Exception as e:
            print(f"Error processing non-musician application: {e}")
            return JsonResponse({
                'status': 'error', 
                'message': f'An error occurred: {str(e)}'
            }, status=500)
            
    return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=405)
