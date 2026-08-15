from django.contrib import admin
from .models import Subscriber, Document, BandBooking, ContactUsSubmission,GospelBandApplication

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

# Register BandBooking with the correct fields
@admin.register(BandBooking)
class BandBookingAdmin(admin.ModelAdmin):
    list_display = ('event_host', 'event_name', 'location', 'start_time', 'created_at')
    search_fields = ('event_host', 'event_name', 'location')
    list_filter = ('created_at', 'event_type', 'event_category', 'start_time')

from django.contrib import admin
from .models import GospelBandApplication

@admin.register(GospelBandApplication)
class GospelBandApplicationAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'email', 'phone_number', 'date')
    list_filter = ('gender', 'nationality', 'christian', 'weekly_rehearsals', 'regular_commitment')
    search_fields = ('full_name', 'email', 'phone_number')
    readonly_fields = ('date',)
    fieldsets = (
        ('Personal Information', {
            'fields': ('full_name', 'age', 'gender', 'nationality', 'address', 'phone_number', 'email', 'occupation')
        }),
        ('Music Experience', {
            'fields': ('instruments', 'vocal_range', 'experience_years', 'formal_training', 'training_details', 'other_groups', 'group_details', 'music_notation', 'live_performance')
        }),
        ('Spiritual Background', {
            'fields': ('christian', 'church', 'church_ministry', 'ministry_details', 'why_join')
        }),
        ('Availability & Commitment', {
            'fields': ('weekly_rehearsals', 'availability', 'regular_commitment')
        }),
        ('Additional Information', {
            'fields': ('hear_about', 'special_skills')
        }),
        ('References', {
            'fields': ('ref_name', 'ref_contact', 'ref_relationship')
        }),
        ('Submission Details', {
            'fields': ('signature', 'date')
        }),
    )

    def get_readonly_fields(self, request, obj=None):
        if obj:  # editing an existing object
            return self.readonly_fields + ('signature', 'date')
        return self.readonly_fields

