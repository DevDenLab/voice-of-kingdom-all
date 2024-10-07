from django.db import models
from django.utils import timezone
class Subscriber(models.Model):
    email = models.EmailField(unique=True)
    subscribed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.email

class Document(models.Model):
    title = models.CharField(max_length=255)
    file = models.FileField(upload_to='documents/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
    
class Contact(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    message = models.TextField()
    submitted_at = models.DateTimeField(auto_now_add=True)  # Make sure this field is defined

    def __str__(self):
        return f'{self.name} - {self.email}'

    class Meta:
        verbose_name = 'Contact Submission'
        verbose_name_plural = 'Contact Submissions'
        ordering = ['-submitted_at']

class Booking(models.Model):
    # Personal Information
    firstName = models.CharField(max_length=100)
    lastName = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20)

    # Organization Information
    orgPhone = models.CharField(max_length=20)
    orgEmail = models.EmailField()
    website = models.URLField(blank=True, null=True)
    addressLine1 = models.CharField(max_length=255)
    addressLine2 = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    country = models.CharField(max_length=100)

    # Event Details
    eventName = models.CharField(max_length=255)
    eventNature = models.CharField(max_length=255)
    expectedFromSarah = models.JSONField()  # Store as JSON array
    eventDate = models.DateField()
    eventTime = models.TimeField()
    eventAddressLine1 = models.CharField(max_length=255)
    eventAddressLine2 = models.CharField(max_length=255, blank=True, null=True)
    eventCity = models.CharField(max_length=100)
    eventState = models.CharField(max_length=100)
    eventPostalCode = models.CharField(max_length=20)
    eventCountry = models.CharField(max_length=100)
    additionalInfo = models.TextField(blank=True, null=True)

    # Agreements
    agreement1 = models.BooleanField()
    agreement2 = models.BooleanField()

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.firstName} {self.lastName} - {self.eventName}"
    
    
class MembershipApplication(models.Model):
    # Personal Information
    full_name = models.CharField(max_length=255)
    age = models.IntegerField()
    gender = models.CharField(max_length=50)
    nationality = models.CharField(max_length=100)
    address = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=20)
    email_address = models.EmailField()
    occupation = models.CharField(max_length=100, blank=True, null=True)

    # Music Experience
    instruments = models.CharField(max_length=255, blank=True, null=True)
    vocal_range = models.CharField(max_length=100, blank=True, null=True)
    experience_duration = models.CharField(max_length=100, blank=True, null=True)
    formal_music_training = models.BooleanField(default=False)
    training_details = models.TextField(blank=True, null=True)
    other_music_group = models.BooleanField(default=False)
    other_music_group_details = models.CharField(max_length=255, blank=True, null=True)
    can_read_music = models.BooleanField(default=False)
    live_performance_experience = models.BooleanField(default=False)

    # Spiritual Background
    is_christian = models.BooleanField(default=False)
    church = models.CharField(max_length=100, blank=True, null=True)
    involved_in_ministry = models.BooleanField(default=False)
    ministry_details = models.TextField(blank=True, null=True)
    motivation_to_join = models.TextField()

    # Availability & Commitment
    available_for_rehearsals = models.BooleanField(default=True)
    availability_details = models.CharField(max_length=255, blank=True, null=True)
    commitment_to_attend = models.BooleanField(default=True)

    # Additional Information
    how_heard_about_band = models.CharField(max_length=255, blank=True, null=True)
    special_skills = models.TextField(blank=True, null=True)

    # References
    reference_name = models.CharField(max_length=255)
    reference_contact_number = models.CharField(max_length=20)
    reference_relationship = models.CharField(max_length=100)
    signature = models.CharField(max_length=255)
    date = models.DateField(default=timezone.now)

    def __str__(self):
        return self.full_name
