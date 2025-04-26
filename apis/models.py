from django.db import models

class Subscriber(models.Model):
    email = models.EmailField(unique=True)
    subscribed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.email


class Document(models.Model):
    title = models.CharField(max_length=255)
    file = models.FileField(upload_to='apis/newsletters/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class BandBooking(models.Model):
    # Event Details
    event_host = models.CharField(max_length=255)
    host_pastor = models.CharField(max_length=255)
    event_name = models.TextField()
    scripture = models.TextField(blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    other_ministers = models.TextField(blank=True, null=True)
    location = models.TextField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    description = models.TextField()
    event_type = models.CharField(max_length=20)
    other_event_type = models.CharField(max_length=255, blank=True, null=True)
    vokim_expectations = models.TextField()
    additional_details = models.TextField(blank=True, null=True)
    
    # Contact Information
    contact_name = models.CharField(max_length=255)
    contact_phone = models.CharField(max_length=20)
    contact_email = models.EmailField()
    organization = models.CharField(max_length=255, blank=True, null=True)
    
    # Performance Requirements
    performance_duration = models.CharField(max_length=20)
    custom_duration = models.CharField(max_length=50, blank=True, null=True)
    sound_equipment = models.CharField(max_length=3)
    equipment_details = models.TextField(blank=True, null=True)
    
    # Additional Information
    event_category = models.CharField(max_length=255)
    song_requests = models.TextField(blank=True, null=True)
    dress_code = models.CharField(max_length=255, blank=True, null=True)
    other_notes = models.TextField(blank=True, null=True)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    terms_accepted = models.BooleanField()

    def __str__(self):
        return f"{self.event_host} - {self.event_name}"
    
class ContactUsSubmission(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    source = models.CharField(max_length=50)
    subject = models.CharField(max_length=100)
    message = models.TextField()
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
    
    
from django.db import models

class GospelBandApplication(models.Model):
    APPLICATION_TYPE_CHOICES = [
        ('musician', 'Musician'),
        ('non-musician', 'Non-Musician'),
    ]
    
    # Application type field to distinguish between musician and non-musician
    application_type = models.CharField(max_length=20, choices=APPLICATION_TYPE_CHOICES, default='musician')
    
    # Common fields for both musician and non-musician
    full_name = models.CharField(max_length=100)
    age = models.IntegerField()
    gender = models.CharField(max_length=10)
    nationality = models.CharField(max_length=50)
    address = models.TextField()
    phone_number = models.CharField(max_length=20)
    email = models.EmailField()
    occupation = models.CharField(max_length=100)
    declaration = models.BooleanField(default=False)
    signature = models.CharField(max_length=100)
    date = models.DateField()
    
    # Musician-specific fields
    instruments = models.CharField(max_length=200, blank=True, null=True)
    vocal_range = models.CharField(max_length=20, blank=True, null=True)
    experience_years = models.CharField(max_length=50, blank=True, null=True)
    formal_training = models.CharField(max_length=3, blank=True, null=True)
    training_details = models.TextField(blank=True, null=True)
    other_groups = models.CharField(max_length=3, blank=True, null=True)
    group_details = models.TextField(blank=True, null=True)
    music_notation = models.CharField(max_length=3, blank=True, null=True)
    live_performance = models.CharField(max_length=3, blank=True, null=True)
    christian = models.CharField(max_length=3, blank=True, null=True)
    church = models.CharField(max_length=100, blank=True, null=True)
    church_ministry = models.CharField(max_length=3, blank=True, null=True)
    ministry_details = models.TextField(blank=True, null=True)
    why_join = models.TextField(blank=True, null=True)
    weekly_rehearsals = models.CharField(max_length=3, blank=True, null=True)
    availability = models.TextField(blank=True, null=True)
    regular_commitment = models.CharField(max_length=3, blank=True, null=True)
    hear_about = models.CharField(max_length=100, blank=True, null=True)
    special_skills = models.TextField(blank=True, null=True)
    ref_name = models.CharField(max_length=100, blank=True, null=True)
    ref_contact = models.CharField(max_length=20, blank=True, null=True)
    ref_relationship = models.CharField(max_length=50, blank=True, null=True)
    
    # Non-musician specific fields
    role = models.CharField(max_length=100, blank=True, null=True)
    role_other = models.CharField(max_length=100, blank=True, null=True)
    prior_experience = models.CharField(max_length=3, blank=True, null=True)
    experience_details = models.TextField(blank=True, null=True)
    relevant_skills = models.TextField(blank=True, null=True)
    worked_with_band = models.CharField(max_length=3, blank=True, null=True)
    band_experience_details = models.TextField(blank=True, null=True)
    available_for_meetings = models.CharField(max_length=3, blank=True, null=True)
    hours_per_week = models.IntegerField(blank=True, null=True)
    willing_to_travel = models.CharField(max_length=3, blank=True, null=True)
    motivation = models.TextField(blank=True, null=True)
    expectations = models.TextField(blank=True, null=True)
    ref_name2 = models.CharField(max_length=100, blank=True, null=True)
    ref_contact2 = models.CharField(max_length=20, blank=True, null=True)
    
    # Common metadata
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.full_name} - {self.get_application_type_display()}"