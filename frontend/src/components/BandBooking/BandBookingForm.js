// BandBookingForm.js
import React, { useState } from 'react';

const BandBookingForm = () => {
  const [formData, setFormData] = useState({
    // Event Details
    eventHost: '',
    hostPastor: '',
    eventName: '',
    scripture: '',
    email: '',
    phone: '',
    otherMinisters: '',
    location: '',
    startTime: '',
    endTime: '',
    description: '',
    eventType: 'in-person',
    otherEventType: '',
    vokimExpectations: '',
    additionalDetails: '',
    
    // Contact Information
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    organization: '',
    
    // Performance Requirements
    performanceDuration: '',
    customDuration: '',
    soundEquipment: 'no',
    equipmentDetails: '',
    
    // Additional Information
    eventCategory: '',
    songRequests: '',
    dressCode: '',
    otherNotes: '',
    
    termsAccepted: false
  });
  // Add new state for submission status
  const [submissionStatus, setSubmissionStatus] = useState({
    submitted: false,
    success: false,
    message: ''
  });
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
      // Clear dependent fields if necessary
      ...(name === 'soundEquipment' && value === 'no' ? { equipmentDetails: '' } : {}),
      ...(name === 'eventType' && value !== 'other' ? { otherEventType: '' } : {}),
      ...(name === 'performanceDuration' && value !== 'custom' ? { customDuration: '' } : {})
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/bookings/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_host: formData.eventHost,
          host_pastor: formData.hostPastor,
          event_name: formData.eventName,
          scripture: formData.scripture,
          other_ministers: formData.otherMinisters,
          location: formData.location,
          start_time: formData.startTime,
          end_time: formData.endTime,
          description: formData.description,
          event_type: formData.eventType,
          other_event_type: formData.otherEventType,
          vokim_expectations: formData.vokimExpectations,
          additional_details: formData.additionalDetails,
          contact_name: formData.contactName,
          contact_phone: formData.contactPhone,
          contact_email: formData.contactEmail,
          organization: formData.organization,
          performance_duration: formData.performanceDuration === 'custom' 
            ? formData.customDuration 
            : formData.performanceDuration,
          custom_duration: formData.customDuration,
          sound_equipment: formData.soundEquipment,
          equipment_details: formData.equipmentDetails,
          event_category: formData.eventCategory,
          song_requests: formData.songRequests,
          dress_code: formData.dressCode,
          other_notes: formData.otherNotes,
          terms_accepted: formData.termsAccepted
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSubmissionStatus({
          submitted: true,
          success: true,
          message: data.message
        });
        
        // Scroll to the success message
        setTimeout(() => {
          window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth'
          });
        }, 100);
        
        // Reset form
        setFormData({
          eventHost: '',
          hostPastor: '',
          eventName: '',
          scripture: '',
          otherMinisters: '',
          location: '',
          startTime: '',
          endTime: '',
          description: '',
          eventType: 'in-person',
          otherEventType: '',
          vokimExpectations: '',
          additionalDetails: '',
          contactName: '',
          contactPhone: '',
          contactEmail: '',
          organization: '',
          performanceDuration: '',
          customDuration: '',
          soundEquipment: 'no',
          equipmentDetails: '',
          eventCategory: '',
          songRequests: '',
          dressCode: '',
          otherNotes: '',
          termsAccepted: false
        });
      } else {
        throw new Error(data.message || 'Failed to submit form');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmissionStatus({
        submitted: true,
        success: false,
        message: 'There was an error submitting your request. Please try again or contact us directly.'
      });
    }
  };

  return (
    <div className="band-booking-container">
      <div className="band-booking-header">
        <h1 className="band-booking-title">VOKIM BAND BOOKING FORM</h1>
        <p className="band-booking-subtitle">
          Thank you for considering us for your event! Please complete the following details, and we will get back to you shortly.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="band-booking-form">
        {/* Event Details Section */}
        <div className="band-booking-section">
          <h2>Event Details</h2>
          
          <div className="band-booking-field">
            <label htmlFor="eventHost">Event Host/Church name*</label>
            <input
              type="text"
              id="eventHost"
              name="eventHost"
              value={formData.eventHost}
              onChange={handleChange}
              required
            />
          </div>

          <div className="band-booking-field">
            <label htmlFor="hostPastor">Host pastor (first & last name)*</label>
            <input
              type="text"
              id="hostPastor"
              name="hostPastor"
              value={formData.hostPastor}
              onChange={handleChange}
              required
            />
          </div>

          <div className="band-booking-field">
            <label htmlFor="eventName">Event name and the vision/theme for the event?*</label>
            <textarea
              id="eventName"
              name="eventName"
              value={formData.eventName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="band-booking-field">
            <label htmlFor="scripture">Is there a scripture that the Lord has given you concerning this event?</label>
            <textarea
              id="scripture"
              name="scripture"
              value={formData.scripture}
              onChange={handleChange}
            />
          </div>

          <div className="band-booking-field">
            <label htmlFor="otherMinisters">Are there other ministers ministering? If yes, who are they?</label>
            <textarea
              id="otherMinisters"
              name="otherMinisters"
              value={formData.otherMinisters}
              onChange={handleChange}
            />
          </div>

          <div className="band-booking-field">
            <label htmlFor="location">Event Location/Address*</label>
            <textarea
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>

          <div className="band-booking-row">
            <div className="band-booking-field">
              <label htmlFor="startTime">Start Time*</label>
              <input
                type="time"
                id="startTime"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
              />
            </div>

            <div className="band-booking-field">
              <label htmlFor="endTime">End Time*</label>
              <input
                type="time"
                id="endTime"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="band-booking-field">
            <label htmlFor="description">Description of event*</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="band-booking-field">
            <label>Event Type*</label>
            <div className="band-booking-radio-group">
              <label className="band-booking-radio">
                <input
                  type="radio"
                  name="eventType"
                  value="in-person"
                  checked={formData.eventType === 'in-person'}
                  onChange={handleChange}
                  required
                />
                <span className="radio-label">In-person</span>
              </label>
              <label className="band-booking-radio">
                <input
                  type="radio"
                  name="eventType"
                  value="virtual"
                  checked={formData.eventType === 'virtual'}
                  onChange={handleChange}
                />
                <span className="radio-label">Virtual</span>
              </label>
              <label className="band-booking-radio">
                <input
                  type="radio"
                  name="eventType"
                  value="other"
                  checked={formData.eventType === 'other'}
                  onChange={handleChange}
                />
                <span className="radio-label">Other</span>
              </label>
            </div>
          </div>

          {formData.eventType === 'other' && (
            <div className="band-booking-field">
              <label htmlFor="otherEventType">Specify other*</label>
              <input
                type="text"
                id="otherEventType"
                name="otherEventType"
                value={formData.otherEventType}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="band-booking-field">
            <label htmlFor="vokimExpectations">What are your expectations for VOKIM participation in this event?*</label>
            <textarea
              id="vokimExpectations"
              name="vokimExpectations"
              placeholder="Include details about how many sessions you want the team to minister at"
              value={formData.vokimExpectations}
              onChange={handleChange}
              required
            />
          </div>

          <div className="band-booking-field">
            <label htmlFor="additionalDetails">Are there any other details you think we should know?</label>
            <textarea
              id="additionalDetails"
              name="additionalDetails"
              value={formData.additionalDetails}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="band-booking-section">
          <h2>Contact Information</h2>
          
          <div className="band-booking-field">
            <label htmlFor="contactName">Contact Person Name*</label>
            <input
              type="text"
              id="contactName"
              name="contactName"
              value={formData.contactName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="band-booking-field">
            <label htmlFor="contactPhone">Phone Number*</label>
            <input
              type="tel"
              id="contactPhone"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="band-booking-field">
            <label htmlFor="contactEmail">Email Address*</label>
            <input
              type="email"
              id="contactEmail"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleChange}
              required
            />
          </div>

          <div className="band-booking-field">
            <label htmlFor="organization">Organization (if applicable)</label>
            <input
              type="text"
              id="organization"
              name="organization"
              value={formData.organization}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Performance Requirements Section */}
        <div className="band-booking-section">
          <h2>Performance Requirements</h2>
          
          <div className="band-booking-field">
            <label>Preferred Performance Duration*</label>
            <div className="band-booking-radio-group">
              <label className="band-booking-radio">
                <input
                  type="radio"
                  name="performanceDuration"
                  value="30"
                  checked={formData.performanceDuration === '30'}
                  onChange={handleChange}
                  required
                />
                <span className="radio-label">30 Minutes</span>
              </label>
              <label className="band-booking-radio">
                <input
                  type="radio"
                  name="performanceDuration"
                  value="60"
                  checked={formData.performanceDuration === '60'}
                  onChange={handleChange}
                />
                <span className="radio-label">1 Hour</span>
              </label>
              <label className="band-booking-radio">
                <input
                  type="radio"
                  name="performanceDuration"
                  value="90"
                  checked={formData.performanceDuration === '90'}
                  onChange={handleChange}
                />
                <span className="radio-label">1.5 Hours</span>
              </label>
              <label className="band-booking-radio">
                <input
                  type="radio"
                  name="performanceDuration"
                  value="custom"
                  checked={formData.performanceDuration === 'custom'}
                  onChange={handleChange}
                />
                <span className="radio-label">Custom Duration</span>
              </label>
            </div>
          </div>

          {formData.performanceDuration === 'custom' && (
            <div className="band-booking-field">
              <label htmlFor="customDuration">Specify custom duration*</label>
              <input
                type="text"
                id="customDuration"
                name="customDuration"
                value={formData.customDuration}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="band-booking-field">
            <label>Sound Equipment Provided by Event*</label>
            <div className="band-booking-radio-group">
              <label className="band-booking-radio">
                <input
                  type="radio"
                  name="soundEquipment"
                  value="yes"
                  checked={formData.soundEquipment === 'yes'}
                  onChange={handleChange}
                  required
                />
                <span className="radio-label">Yes</span>
              </label>
              <label className="band-booking-radio">
                <input
                  type="radio"
                  name="soundEquipment"
                  value="no"
                  checked={formData.soundEquipment === 'no'}
                  onChange={handleChange}
                />
                <span className="radio-label">No</span>
              </label>
            </div>
          </div>

          {formData.soundEquipment === 'yes' && (
            <div className="band-booking-field">
              <label htmlFor="equipmentDetails">Please specify equipment*</label>
              <textarea
                id="equipmentDetails"
                name="equipmentDetails"
                value={formData.equipmentDetails}
                onChange={handleChange}
                required
              />
            </div>
          )}
        </div>

        {/* Additional Information Section */}
        <div className="band-booking-section">
          <h2>Additional Information</h2>
          
          <div className="band-booking-field">
            <label htmlFor="eventCategory">Type of Event*</label>
            <input
              type="text"
              id="eventCategory"
              name="eventCategory"
              placeholder="e.g., Church Service, Wedding, Concert, etc."
              value={formData.eventCategory}
              onChange={handleChange}
              required
            />
          </div>

          <div className="band-booking-field">
            <label htmlFor="songRequests">Special Song Requests (if any)</label>
            <textarea
              id="songRequests"
              name="songRequests"
              value={formData.songRequests}
              onChange={handleChange}
            />
          </div>

          <div className="band-booking-field">
            <label htmlFor="dressCode">Dress Code (if applicable)</label>
            <input
              type="text"
              id="dressCode"
              name="dressCode"
              value={formData.dressCode}
              onChange={handleChange}
            />
          </div>

          <div className="band-booking-field">
            <label htmlFor="otherNotes">Other Notes/Requests</label>
            <textarea
              id="otherNotes"
              name="otherNotes"
              value={formData.otherNotes}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Terms Acceptance */}
        <div className="band-booking-section">
          <div className="band-booking-field">
            <label className="band-booking-checkbox-label">
              <input
                type="checkbox"
                name="termsAccepted"
                checked={formData.termsAccepted}
                onChange={handleChange}
                required
              />
              <span className="checkbox-text">
                I understand that this Event Request Form will be used by VOKIM for the purpose of coordinating agendas. 
                Submission of this form is only a request and DOES NOT CONFIRM his participation in said event.
              </span>
            </label>
          </div>
        </div>

        <button type="submit" className="band-booking-submit">Submit Booking Request</button>
      </form>
      {/* Success/Error Message */}
      {submissionStatus.submitted && (
        <div 
          className={`band-booking-message ${
            submissionStatus.success ? 'band-booking-success' : 'band-booking-error'
          }`}
        >
          <div className="band-booking-message-content">
            {submissionStatus.success && (
              <svg 
                className="band-booking-success-icon" 
                viewBox="0 0 24 24"
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <path d="M20 6L9 17l-5-5"/>
              </svg>
            )}
            <p>{submissionStatus.message}</p>
            {submissionStatus.success && (
              <div className="band-booking-success-details">
                <p>Next steps:</p>
                <ul>
                  <li>Check your email for a confirmation of your submission</li>
                  <li>Our team will review your request within 2-3 business days</li>
                  <li>We'll contact you to discuss details and confirm availability</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BandBookingForm;