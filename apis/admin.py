from django.contrib import admin
from .models import Subscriber, Document, Booking

@admin.register(Subscriber)
class SubscriberAdmin(admin.ModelAdmin):
    list_display = ('email', 'subscribed_at')
    search_fields = ('email',)
    list_filter = ('subscribed_at',)

@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ('title', 'uploaded_at')
    search_fields = ('title',)
    list_filter = ('uploaded_at',)
    
from .models import Contact

class ContactAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'submitted_at')  # Ensure that 'submitted_at' exists in the model
    search_fields = ('name', 'email')
    readonly_fields = ('submitted_at',)  # Ensure 'submitted_at' is defined and accessible in the model

admin.site.register(Contact, ContactAdmin)

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('firstName', 'lastName', 'email', 'eventName', 'eventDate', 'created_at')
    list_filter = ('eventDate', 'country', 'eventCountry')
    search_fields = ('firstName', 'lastName', 'email', 'eventName')
    readonly_fields = ('created_at',)
    fieldsets = (
        ('Personal Information', {
            'fields': ('firstName', 'lastName', 'email', 'phone')
        }),
        ('Organization Information', {
            'fields': ('orgPhone', 'orgEmail', 'website', 'addressLine1', 'addressLine2', 'city', 'state', 'country')
        }),
        ('Event Details', {
            'fields': ('eventName', 'eventNature', 'expected_from_adeyinka', 'eventDate', 'eventTime',
                       'eventAddressLine1', 'eventAddressLine2', 'eventCity', 'eventState',
                       'eventPostalCode', 'eventCountry', 'additionalInfo')
        }),
        ('Agreements', {
            'fields': ('agreement1', 'agreement2')
        }),
        ('Metadata', {
            'fields': ('created_at',)
        })
    )

    def get_readonly_fields(self, request, obj=None):
        if obj:  # editing an existing object
            return self.readonly_fields + ('agreement1', 'agreement2')
        return self.readonly_fields