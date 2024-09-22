from django.db import models

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