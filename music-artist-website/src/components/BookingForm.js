import React, { useState } from "react";
import "./BookingForm.css";
import { Table, TableBody, TableCell, TableContainer, TableRow, Paper } from '@mui/material';
import { Button } from '@mui/material';
import Lottie from 'react-lottie';
import checkMarkAnimation from './check-mark-animation.json';
import axios from 'axios';

const CheckMarkAnimation = () => {
  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: checkMarkAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return <Lottie options={defaultOptions} height={100} width={100} />;
};

const BookingForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    orgPhone: "",
    orgEmail: "",
    website: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    country: "Afghanistan",
    eventName: "",
    eventNature: "",
    expectedFromSarah: [],
    eventDate: "",
    eventTime: "",
    eventAddressLine1: "",
    eventAddressLine2: "",
    eventCity: "",
    eventState: "",
    eventPostalCode: "",
    eventCountry: "Afghanistan",
    additionalInfo: "",
    agreement1: false,
    agreement2: false,
  });
  const [isSubmitted, setIsSubmitted] = useState(false); // Track if form is submitted
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);
  const validateForm = () => {
    const errors = {};
    const requiredFields = [
      'firstName', 'lastName', 'email', 'phone', 'orgPhone', 'orgEmail',
      'addressLine1', 'city', 'state', 'country', 'eventName', 'eventNature',
      'expectedFromSarah', 'eventDate', 'eventTime', 'eventAddressLine1',
      'eventCity', 'eventState', 'eventPostalCode', 'eventCountry'
    ];

    requiredFields.forEach(field => {
      if (!formData[field]) {
        errors[field] = 'This field is required.';
      }
    });

    if (formData.website && !formData.website.match(/^https?:\/\/.+/)) {
      errors.website = 'Enter a valid URL starting with http:// or https://';
    }

    return errors;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submit button clicked");
    setIsLoading(true);
    setError(null);
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setError('Please fill in all required fields and ensure the website URL is valid.');
      setIsLoading(false);
      return;
    }

    try {
      console.log("Sending data to API:", formData);
      const response = await axios.post('http://127.0.0.1:8000/api/booking/', formData);
      console.log("API response:", response);
      if (response.status === 201) {
        console.log("Form submitted successfully");
        setIsSubmitted(true);
      } else {
        throw new Error('Unexpected response status');
      }
    } catch (err) {
      setError('An error occurred while submitting the form. Please try again.');
      console.error('Error submitting form:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    "Personal Information",
    "Organization Information",
    "Event Details",
    "Agreements"
  ];

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <div className="input-group">
              <label htmlFor="firstName">Name <span className="required">*</span></label>
              <div className="input-row">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="input-group">
              <label htmlFor="email">Email <span className="required">*</span></label>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="phone">Phone <span className="required">*</span></label>
              <input
                type="tel"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
          </>
        );
      case 2:
        return (
          <>
            <div className="input-group">
              <label htmlFor="orgPhone">Organization Phone <span className="required">*</span></label>
              <input
                type="tel"
                name="orgPhone"
                placeholder="Phone"
                value={formData.orgPhone}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="orgEmail">Organization Email <span className="required">*</span></label>
              <input
                type="email"
                name="orgEmail"
                placeholder="Email"
                value={formData.orgEmail}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="website">Website / URL</label>
              <input
                type="url"
                name="website"
                placeholder="Website / URL"
                value={formData.website}
                onChange={handleChange}
              />
            </div>
            <div className="input-group">
              <label htmlFor="addressLine1">Church/Organization Address <span className="required">*</span></label>
              <input
                type="text"
                name="addressLine1"
                placeholder="Address Line 1"
                value={formData.addressLine1}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="addressLine2"
                placeholder="Address Line 2"
                value={formData.addressLine2}
                onChange={handleChange}
              />
              <div className="input-row">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="state"
                  placeholder="State / Province"
                  value={formData.state}
                  onChange={handleChange}
                />
              </div>
              <select name="country" value={formData.country} onChange={handleChange}>
                <option value="Afghanistan">Afghanistan</option>
                {/* Add other countries */}
              </select>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <div className="input-group">
              <label htmlFor="eventName">Event Name & Theme <span className="required">*</span></label>
              <input
                type="text"
                name="eventName"
                placeholder="Event Name"
                value={formData.eventName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="eventNature">Nature of Event <span className="required">*</span></label>
              <input
                type="text"
                name="eventNature"
                placeholder="Nature of Event"
                value={formData.eventNature}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-group">
              <label>What is expected from the guest? <span className="required">*</span></label>
              <div className="checkbox-group">
                {["Music Ministration", "Public Speaking", "Public Appearance"].map((item) => (
                  <label key={item}>
                    <input
                      type="checkbox"
                      name="expectedFromSarah"
                      value={item}
                      checked={formData.expectedFromSarah.includes(item)}
                      onChange={(e) => {
                        const updatedExpectations = e.target.checked
                          ? [...formData.expectedFromSarah, item]
                          : formData.expectedFromSarah.filter((i) => i !== item);
                        setFormData({ ...formData, expectedFromSarah: updatedExpectations });
                      }}
                    />
                    {item}
                  </label>
                ))}
              </div>
            </div>
            <div className="input-group">
              <label htmlFor="eventDate">Date & Time of Event <span className="required">*</span></label>
              <div className="input-row">
                <input
                  type="date"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleChange}
                  required
                />
                <input
                  type="time"
                  name="eventTime"
                  value={formData.eventTime}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="input-group">
              <label htmlFor="eventAddressLine1">Event Address <span className="required">*</span></label>
              <input
                type="text"
                name="eventAddressLine1"
                placeholder="Address Line 1"
                value={formData.eventAddressLine1}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="eventAddressLine2"
                placeholder="Address Line 2"
                value={formData.eventAddressLine2}
                onChange={handleChange}
              />
              <div className="input-row">
                <input
                  type="text"
                  name="eventCity"
                  placeholder="City"
                  value={formData.eventCity}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="eventState"
                  placeholder="State / Province"
                  value={formData.eventState}
                  onChange={handleChange}
                />
              </div>
              <div className="input-row">
                <input
                  type="text"
                  name="eventPostalCode"
                  placeholder="Postal Code"
                  value={formData.eventPostalCode}
                  onChange={handleChange}
                />
                <select name="eventCountry" value={formData.eventCountry} onChange={handleChange}>
                  <option value="Canada">Canada</option>
                  {/* Add other countries */}
                </select>
              </div>
            </div>
            <div className="input-group">
              <label htmlFor="additionalInfo">Additional Information about the Event</label>
              <textarea
                name="additionalInfo"
                placeholder="Additional Information"
                value={formData.additionalInfo}
                onChange={handleChange}
              />
            </div>
          </>
        );
      case 4:
        return (
          <>
            <div className="input-group">
              <label>
                <input
                  type="checkbox"
                  name="agreement1"
                  checked={formData.agreement1}
                  onChange={handleChange}
                  required
                />
                This form is used by the management of Sarah Akintunde for scheduling purposes only and does NOT confirm an event <span className="required">*</span>
              </label>
            </div>
            <div className="input-group">
              <label>
                <input
                  type="checkbox"
                  name="agreement2"
                  checked={formData.agreement2}
                  onChange={handleChange}
                  required
                />
                I/we affirm that the information provided in this form is valid <span className="required">*</span>
              </label>
            </div>
          </>
        );
      default:
        return null;
    }
  };
  const renderConfirmation = () => (
    <div className="confirmation-message">
      <CheckMarkAnimation />
      <h2>Thank You for Your Submission!</h2>
      <p>Your event booking has been submitted successfully.</p>
      <h3>Submitted Information:</h3>
      <TableContainer component={Paper}>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>First Name:</TableCell>
            <TableCell>{formData.firstName}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Last Name:</TableCell>
            <TableCell>{formData.lastName}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Email:</TableCell>
            <TableCell>{formData.email}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Phone:</TableCell>
            <TableCell>{formData.phone}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Organization Phone:</TableCell>
            <TableCell>{formData.orgPhone}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Organization Email:</TableCell>
            <TableCell>{formData.orgEmail}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Website:</TableCell>
            <TableCell>{formData.website}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Address Line 1:</TableCell>
            <TableCell>{formData.addressLine1}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Address Line 2:</TableCell>
            <TableCell>{formData.addressLine2}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>City:</TableCell>
            <TableCell>{formData.city}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>State:</TableCell>
            <TableCell>{formData.state}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Country:</TableCell>
            <TableCell>{formData.country}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Event Name:</TableCell>
            <TableCell>{formData.eventName}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Event Nature:</TableCell>
            <TableCell>{formData.eventNature}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Expected From Adeyinka:</TableCell>
            <TableCell>{formData.expectedFromSarah.join(', ')}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Event Date:</TableCell>
            <TableCell>{formData.eventDate}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Event Time:</TableCell>
            <TableCell>{formData.eventTime}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Event Address Line 1:</TableCell>
            <TableCell>{formData.eventAddressLine1}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Event Address Line 2:</TableCell>
            <TableCell>{formData.eventAddressLine2}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Event City:</TableCell>
            <TableCell>{formData.eventCity}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Event State:</TableCell>
            <TableCell>{formData.eventState}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Event Postal Code:</TableCell>
            <TableCell>{formData.eventPostalCode}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Event Country:</TableCell>
            <TableCell>{formData.eventCountry}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Additional Info:</TableCell>
            <TableCell>{formData.additionalInfo}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Agreement 1:</TableCell>
            <TableCell>{formData.agreement1 ? 'Yes' : 'No'}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Agreement 2:</TableCell>
            <TableCell>{formData.agreement2 ? 'Yes' : 'No'}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '10vh' }}>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setIsSubmitted(false)}
        sx={{ backgroundColor: 'blue' }}
      >
        Make Another Booking &rarr;
      </Button>
    </div>
    </div>
  );
  return (
    <div className="booking-form-container">
      <div className="form-header">
        <h2>Booking Form</h2>
        <p>Please fill out the form below to book an event with Sarah Akintunde. All fields marked with an asterisk (*) are required.</p>
      </div>
      <div className="progress-bar">
        <div className="progress" style={{ width: `${(step / 4) * 100}%` }}></div>
      </div>
      <div className="step-indicator">
        Step {step} of 4: {steps[step - 1]}
      </div>
      {isSubmitted ? renderConfirmation() : (
      <form onSubmit={handleSubmit}>
        {renderStepContent()}
        <div className="button-group">
          {step > 1 && (
            <button type="button" className="button-back" onClick={prevStep} disabled={isLoading}>
              Back
            </button>
          )}
          {step < 4 ? (
            <button type="button" className="button-next" onClick={nextStep} disabled={isLoading}>
              Next
            </button>
          ) : (
            <button type="submit" className="button-submit" disabled={isLoading}>
              {isLoading ? 'Submitting...' : 'Submit'}
            </button>
          )}
        </div>
        {error && <div className="error-message">{error}</div>}
      </form>
      )}
    </div>
  );
};

export default BookingForm;