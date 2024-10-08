# Generated by Django 4.2.13 on 2024-09-22 02:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('apis', '0005_rename_expected_from_adeyinka_booking_expected_from_sarah'),
    ]

    operations = [
        migrations.RenameField(
            model_name='booking',
            old_name='address_line1',
            new_name='addressLine1',
        ),
        migrations.RenameField(
            model_name='booking',
            old_name='event_address_line2',
            new_name='addressLine2',
        ),
        migrations.RenameField(
            model_name='booking',
            old_name='event_address_line1',
            new_name='eventAddressLine1',
        ),
        migrations.RenameField(
            model_name='booking',
            old_name='address_line2',
            new_name='eventAddressLine2',
        ),
        migrations.RenameField(
            model_name='booking',
            old_name='event_city',
            new_name='eventCity',
        ),
        migrations.RenameField(
            model_name='booking',
            old_name='event_country',
            new_name='eventCountry',
        ),
        migrations.RenameField(
            model_name='booking',
            old_name='event_date',
            new_name='eventDate',
        ),
        migrations.RenameField(
            model_name='booking',
            old_name='event_name',
            new_name='eventName',
        ),
        migrations.RenameField(
            model_name='booking',
            old_name='event_nature',
            new_name='eventNature',
        ),
        migrations.RenameField(
            model_name='booking',
            old_name='event_postal_code',
            new_name='eventPostalCode',
        ),
        migrations.RenameField(
            model_name='booking',
            old_name='event_state',
            new_name='eventState',
        ),
        migrations.RenameField(
            model_name='booking',
            old_name='event_time',
            new_name='eventTime',
        ),
        migrations.RenameField(
            model_name='booking',
            old_name='expected_from_sarah',
            new_name='expectedFromSarah',
        ),
        migrations.RenameField(
            model_name='booking',
            old_name='first_name',
            new_name='firstName',
        ),
        migrations.RenameField(
            model_name='booking',
            old_name='last_name',
            new_name='lastName',
        ),
        migrations.RenameField(
            model_name='booking',
            old_name='org_email',
            new_name='orgEmail',
        ),
        migrations.RenameField(
            model_name='booking',
            old_name='org_phone',
            new_name='orgPhone',
        ),
        migrations.RemoveField(
            model_name='booking',
            name='additional_info',
        ),
        migrations.AddField(
            model_name='booking',
            name='additionalInfo',
            field=models.TextField(blank=True, null=True),
        ),
    ]
