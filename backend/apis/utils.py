from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
import io
import tempfile
import os
def generate_booking_pdf(booking):
    # Create a temporary file
    import tempfile
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.pdf')
    filename = temp_file.name
    temp_file.close()
    
    # Create the PDF document
    doc = SimpleDocTemplate(filename, pagesize=letter)
    elements = []

    # Define styles with better wrapping properties
    styles = getSampleStyleSheet()
    normal_style = styles["Normal"]
    normal_style.wordWrap = 'CJK'  # Better word wrapping
    
    # Setup data with Paragraph objects for text wrapping
    data = [
        ["Booking Details", ""],
        ["Event Host", Paragraph(booking.event_host or "N/A", normal_style)],
        ["Host Pastor", Paragraph(booking.host_pastor or "N/A", normal_style)],
        ["Event Name", Paragraph(booking.event_name or "N/A", normal_style)],
        ["Scripture", Paragraph(booking.scripture or "N/A", normal_style)],
        ["Other Ministers", Paragraph(booking.other_ministers or "N/A", normal_style)],
        ["Location", Paragraph(booking.location or "N/A", normal_style)],
        ["Start Time", booking.start_time.strftime("%I:%M %p") if booking.start_time else "N/A"],
        ["End Time", booking.end_time.strftime("%I:%M %p") if booking.end_time else "N/A"],
        ["Description", Paragraph(booking.description or "N/A", normal_style)],
        ["Event Type", Paragraph(booking.event_type or "N/A", normal_style)],
        ["VOKIM Expectations", Paragraph(booking.vokim_expectations or "N/A", normal_style)],
        ["Additional Details", Paragraph(booking.additional_details or "N/A", normal_style)],
        ["Contact Information", ""],
        ["Contact Name", Paragraph(booking.contact_name or "N/A", normal_style)],
        ["Contact Phone", Paragraph(booking.contact_phone or "N/A", normal_style)],
        ["Contact Email", Paragraph(booking.contact_email or "N/A", normal_style)],
        ["Organization", Paragraph(booking.organization or "N/A", normal_style)],
        ["Performance Requirements", ""],
        ["Duration", Paragraph(booking.performance_duration or "N/A", normal_style)],
        ["Sound Equipment", Paragraph(booking.sound_equipment or "N/A", normal_style)],
        ["Equipment Details", Paragraph(booking.equipment_details or "N/A", normal_style)],
        ["Additional Information", ""],
        ["Event Category", Paragraph(booking.event_category or "N/A", normal_style)],
        ["Song Requests", Paragraph(booking.song_requests or "N/A", normal_style)],
        ["Dress Code", Paragraph(booking.dress_code or "N/A", normal_style)],
        ["Other Notes", Paragraph(booking.other_notes or "N/A", normal_style)],
    ]

    # Set better column widths - make second column wider and first column narrower
    col_widths = [150, 350]  # Adjusted for better text wrapping

    # Create table with specific column widths
    table = Table(data, colWidths=col_widths)
    
    # Apply table styling with explicit cell padding
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),  # Add left padding
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),  # Add right padding
        ('TOPPADDING', (0, 0), (-1, -1), 3),    # Add top padding
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3), # Add bottom padding
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),    # Align text to top of cell
    ]))

    elements.append(table)
    doc.build(elements)
    
    return filename