from rest_framework import serializers
from .models import Subscriber, Document, Contact, Booking

class SubscriberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscriber
        fields = ['email']

class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = ['title', 'file']

class ContactSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = ['name', 'email', 'message']
        

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = '__all__'

    def validate_website(self, value):
        if value and not value.startswith(('http://', 'https://')):
            raise serializers.ValidationError("Enter a valid URL starting with 'http://' or 'https://'")
        return value