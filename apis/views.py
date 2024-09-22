from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.core.mail import send_mail,EmailMessage
from django.conf import settings
from .models import Subscriber, Document
from django.template.loader import render_to_string
from .serializers import SubscriberSerializer, DocumentSerializer
from .serializers import ContactSubmissionSerializer,BookingSerializer
import os
from io import BytesIO
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.platypus import Table, TableStyle
from reportlab.lib import colors
import logging

class BookingView(APIView):
    def post(self, request):
        try:
            serializer = BookingSerializer(data=request.data)
            if serializer.is_valid():
                booking = serializer.save()
                self.send_confirmation_email(booking)
                return Response({"message": "Booking created successfully"}, status=status.HTTP_201_CREATED)
            else:
                logging.error(f"Booking creation failed: {serializer.errors}")
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            # Log the detailed error for debugging
            logging.exception(f"An error occurred during booking creation: {str(e)}")
            return Response({"message": f"An internal error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def send_confirmation_email(self, booking):
        pdf_buffer = self.generate_pdf(booking)
        pdf_filename = f"{booking.firstName}_{booking.lastName}_{booking.eventDate}.pdf"

        email = EmailMessage(
            'New Booking Form Submitted',
            'Please find the details about the new booking inquiry.',
            settings.DEFAULT_FROM_EMAIL,
            [booking.email, settings.ADMIN_EMAIL]
        )
        email.attach(pdf_filename, pdf_buffer.getvalue(), 'application/pdf')
        email.send()

    def generate_pdf(self, booking):
        buffer = BytesIO()
        p = canvas.Canvas(buffer, pagesize=letter)
        p.setFont("Helvetica-Bold", 16)
        p.drawString(100, 750, f"Booking Information - {booking.eventName}")

        data = [
            ["Field", "Value"],
            ["Name", f"{booking.firstName} {booking.lastName}"],
            ["Email", booking.email],
            ["Phone", booking.phone],
            ["Organization Phone", booking.orgPhone],
            ["Organization Email", booking.orgEmail],
            ["Website", booking.website or "N/A"],
            ["Address", f"{booking.addressLine1}, {booking.addressLine2 or ''}, {booking.city}, {booking.state}, {booking.country}"],
            ["Event Name", booking.eventName],
            ["Event Nature", booking.eventNature],
            ["Expected from Adeyinka", ", ".join(booking.expectedFromSarah)],
            ["Event Date & Time", f"{booking.eventDate} {booking.eventTime}"],
            ["Event Address", f"{booking.eventAddressLine1}, {booking.eventAddressLine2 or ''}, {booking.eventCity}, {booking.eventState}, {booking.eventPostalCode}, {booking.eventCountry}"],
            ["Additional Info", booking.additionalInfo or "N/A"],
        ]

        table = Table(data)
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 14),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('TEXTCOLOR', (0, 1), (-1, -1), colors.black),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 1), (-1, -1), 12),
            ('TOPPADDING', (0, 1), (-1, -1), 6),
            ('BOTTOMPADDING', (0, 1), (-1, -1), 6),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))

        table.wrapOn(p, 400, 600)
        table.drawOn(p, 72, 300)

        p.showPage()
        p.save()
        buffer.seek(0)
        return buffer
    
class ContactSubmissionView(APIView):
    def post(self, request):
        serializer = ContactSubmissionSerializer(data=request.data)
        if serializer.is_valid():
            # Save submission to DB
            serializer.save()

            # Send email notification
            send_mail(
                'New Contact Form Submission',
                f"Name: {serializer.validated_data['name']}\nEmail: {serializer.validated_data['email']}\nMessage: {serializer.validated_data['message']}",
                settings.DEFAULT_FROM_EMAIL,
                ['tatvajoshi0@gmail.com'],  # Change to the email address where you want to receive notifications
            )

            return Response({"message": "Form submitted successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class SubscribeView(APIView):
    def post(self, request):
        serializer = SubscriberSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Subscription successful"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DocumentUploadView(APIView):
    def post(self, request):
        serializer = DocumentSerializer(data=request.data)
        if serializer.is_valid():
            document = serializer.save()

            # Notify all subscribers
            subscribers = Subscriber.objects.all()
            print("sending the emails")
            for subscriber in subscribers:
                send_mail(
                    'New Document Added',
                    f'A new document titled "{document.title}" has been uploaded.',
                    settings.DEFAULT_FROM_EMAIL,
                    [subscriber.email],
                )
            print("email sent")
            return Response({"message": "Document uploaded and subscribers notified"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
