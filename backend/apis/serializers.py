from rest_framework import serializers
from .models import Subscriber, Document
from .models import BandBooking,ContactUsSubmission

class SubscriberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscriber
        fields = ['email']

class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = ['title', 'file']


class BandBookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = BandBooking
        fields = '__all__'
        
class ContactUsSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactUsSubmission
        fields = '__all__'