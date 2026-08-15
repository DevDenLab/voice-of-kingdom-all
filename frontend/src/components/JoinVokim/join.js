import React, { useState } from 'react';
import JoinMainContent from './JoinMainContent';

const GospelBandForm = () => {
  const [formType, setFormType] = useState('musician'); // 'musician' or 'non-musician'
  const [formData, setFormData] = useState({
    full_name: '',
    age: '',
    gender: '',
    nationality: '',
    address: '',
    phone_number: '',
    email: '',
    occupation: '',
    instruments: '',
    vocal_range: '',
    experience_years: '',
    formal_training: '',
    training_details: '',
    other_groups: '',
    group_details: '',
    music_notation: '',
    live_performance: '',
    christian: '',
    church: '',
    church_ministry: '',
    ministry_details: '',
    why_join: '',
    weekly_rehearsals: '',
    availability: '',
    regular_commitment: '',
    hear_about: '',
    special_skills: '',
    ref_name: '',
    ref_contact: '',
    ref_relationship: '',
    signature: '',
    date: '',
    declaration: false,
    // Non-musician form fields (new)
    role: '',
    role_other: '',
    prior_experience: '',
    experience_details: '',
    relevant_skills: '',
    worked_with_band: '',
    band_experience_details: '',
    available_for_meetings: '',
    hours_per_week: '',
    willing_to_travel: '',
    motivation: '',
    expectations: '',
    ref_name2: '',
    ref_contact2: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitMusician = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(''); // Reset error message on new submission

    try {
      const response = await fetch('/api/join-musician/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 200) {
        setIsSubmitted(true);
      } else {
        const data = await response.json();
        setErrorMessage(data.message || 'An error occurred while submitting your application.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrorMessage('There was an error submitting the form. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  const handleSubmitNonMusician = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(''); // Reset error message on new submission

    try {
      const response = await fetch('/api/join-non-musician/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 200) {
        setIsSubmitted(true);
      } else {
        const data = await response.json();
        setErrorMessage(data.message || 'An error occurred while submitting your application.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrorMessage('There was an error submitting the form. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  // Toggle between Musician and Non-Musician forms
  const toggleFormType = (type) => {
    setFormType(type);
    setIsSubmitted(false);
    setErrorMessage('');
  };
  return (
    <>
      <div className="form-container">
        <JoinMainContent imageUrl='https://images.unsplash.com/photo-1698954634383-eba274a1b1c7?q=80&w=1854&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&q=100' />
        <div className="form-wrapper">
        <div className="form-header">
          <h1>VOKIM African Gospel Band</h1>
          <h2>Membership Application Form</h2>
          <p>Thank you for your interest in joining our gospel band! Please fill out the form below.</p>
          {/* Form Type Toggle */}
          <div className="form-type-toggle">
              <button 
                className={`toggle-btn ${formType === 'musician' ? 'active' : ''}`}
                onClick={() => toggleFormType('musician')}
              >
                Musician
              </button>
              <button 
                className={`toggle-btn ${formType === 'non-musician' ? 'active' : ''}`}
                onClick={() => toggleFormType('non-musician')}
              >
                Non-Musician
              </button>
            </div>
        </div>
        {formType === 'musician' ? (
        <form onSubmit={handleSubmitMusician}>
          {/* Personal Information Section */}
          <div className="form-section">
            <h3 className="section-title">1. Personal Information</h3>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="full_name"
                className="form-control"
                value={formData.full_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Age</label>
              <input
                type="number"
                name="age"
                className="form-control"
                value={formData.age}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <select
                name="gender"
                className="form-control"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Nationality</label>
              <input
                type="text"
                name="nationality"
                className="form-control"
                value={formData.nationality}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Address</label>
              <textarea
                name="address"
                className="form-control"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone_number"
                className="form-control"
                value={formData.phone_number}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Occupation</label>
              <input
                type="text"
                name="occupation"
                className="form-control"
                value={formData.occupation}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Music Experience Section */}
          <div className="form-section">
            <h3 className="section-title">2. Music Experience</h3>
            <div className="form-group">
              <label>Instrument(s) You Play (if any)</label>
              <input
                type="text"
                name="instruments"
                className="form-control"
                value={formData.instruments}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Vocal Range (if a singer)</label>
              <select
                name="vocal_range"
                className="form-control"
                value={formData.vocal_range}
                onChange={handleChange}
              >
                <option value="">Select Vocal Range</option>
                <option value="soprano">Soprano</option>
                <option value="alto">Alto</option>
                <option value="tenor">Tenor</option>
                <option value="bass">Bass</option>
              </select>
            </div>
            <div className="form-group">
              <label>How long have you been singing/playing?</label>
              <input
                type="text"
                name="experience_years"
                className="form-control"
                value={formData.experience_years}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Have you had formal music training?</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="formal_training"
                    value="yes"
                    checked={formData.formal_training === 'yes'}
                    onChange={handleChange}
                  />
                  Yes
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="formal_training"
                    value="no"
                    checked={formData.formal_training === 'no'}
                    onChange={handleChange}
                  />
                  No
                </label>
              </div>
            </div>
            {formData.formal_training === 'yes' && (
              <div className="form-group">
                <label>Please provide training details</label>
                <textarea
                  name="training_details"
                  className="form-control"
                  value={formData.training_details}
                  onChange={handleChange}
                />
              </div>
            )}
            <div className="form-group">
              <label>Are you a part of any other music group or band?</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="other_groups"
                    value="yes"
                    checked={formData.other_groups === 'yes'}
                    onChange={handleChange}
                  />
                  Yes
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="other_groups"
                    value="no"
                    checked={formData.other_groups === 'no'}
                    onChange={handleChange}
                  />
                  No
                </label>
              </div>
            </div>
            {formData.other_groups === 'yes' && (
              <div className="form-group">
                <label>Please specify</label>
                <textarea
                  name="group_details"
                  className="form-control"
                  value={formData.group_details}
                  onChange={handleChange}
                />
              </div>
            )}
            <div className="form-group">
              <label>Can you read music notation?</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="music_notation"
                    value="yes"
                    checked={formData.music_notation === 'yes'}
                    onChange={handleChange}
                  />
                  Yes
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="music_notation"
                    value="no"
                    checked={formData.music_notation === 'no'}
                    onChange={handleChange}
                  />
                  No
                </label>
              </div>
            </div>
            <div className="form-group">
              <label>Do you have experience with live performances?</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="live_performance"
                    value="yes"
                    checked={formData.live_performance === 'yes'}
                    onChange={handleChange}
                  />
                  Yes
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="live_performance"
                    value="no"
                    checked={formData.live_performance === 'no'}
                    onChange={handleChange}
                  />
                  No
                </label>
              </div>
            </div>
          </div>

          {/* Spiritual Background Section */}
          <div className="form-section">
            <h3 className="section-title">3. Spiritual Background</h3>
            <div className="form-group">
              <label>Are you a Christian?</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="christian"
                    value="yes"
                    checked={formData.christian === 'yes'}
                    onChange={handleChange}
                  />
                  Yes
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="christian"
                    value="no"
                    checked={formData.christian === 'no'}
                    onChange={handleChange}
                  />
                  No
                </label>
              </div>
            </div>
            <div className="form-group">
              <label>Which church do you attend?</label>
              <input
                type="text"
                name="church"
                className="form-control"
                value={formData.church}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Are you involved in any church ministry?</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="church_ministry"
                    value="yes"
                    checked={formData.church_ministry === 'yes'}
                    onChange={handleChange}
                  />
                  Yes
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="church_ministry"
                    value="no"
                    checked={formData.church_ministry === 'no'}
                    onChange={handleChange}
                  />
                  No
                </label>
              </div>
            </div>
            {formData.church_ministry === 'yes' && (
              <div className="form-group">
                <label>Please provide details</label>
                <textarea
                  name="ministry_details"
                  className="form-control"
                  value={formData.ministry_details}
                  onChange={handleChange}
                />
              </div>
            )}
            <div className="form-group">
              <label>Why do you want to join our gospel band?</label>
              <textarea
                name="why_join"
                className="form-control"
                value={formData.why_join}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Availability & Commitment Section */}
          <div className="form-section">
            <h3 className="section-title">4. Availability & Commitment</h3>
            <div className="form-group">
              <label>Are you available for weekly rehearsals?</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="weekly_rehearsals"
                    value="yes"
                    checked={formData.weekly_rehearsals === 'yes'}
                    onChange={handleChange}
                  />
                  Yes
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="weekly_rehearsals"
                    value="no"
                    checked={formData.weekly_rehearsals === 'no'}
                    onChange={handleChange}
                  />
                  No
                </label>
              </div>
            </div>
            {formData.weekly_rehearsals === 'no' && (
              <div className="form-group">
                <label>Please provide your availability</label>
                <textarea
                  name="availability"
                  className="form-control"
                  value={formData.availability}
                  onChange={handleChange}
                />
              </div>
            )}
            <div className="form-group">
              <label>Are you willing to commit to attending church services, band rehearsals, and performances regularly?</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="regular_commitment"
                    value="yes"
                    checked={formData.regular_commitment === 'yes'}
                    onChange={handleChange}
                  />
                  Yes
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="regular_commitment"
                    value="no"
                    checked={formData.regular_commitment === 'no'}
                    onChange={handleChange}
                  />
                  No
                </label>
              </div>
            </div>
          </div>

          {/* Additional Information Section */}
          <div className="form-section">
            <h3 className="section-title">5. Additional Information</h3>
            <div className="form-group">
              <label>How did you hear about the band?</label>
              <input
                type="text"
                name="hear_about"
                className="form-control"
                value={formData.hear_about}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Do you have any special skills or experience that you believe will be valuable to the band?</label>
              <textarea
                name="special_skills"
                className="form-control"
                value={formData.special_skills}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* References Section */}
          <div className="form-section">
            <h3 className="section-title">6. References</h3>
            <div className="form-group">
              <label>Reference Name</label>
              <input
                type="text"
                name="ref_name"
                className="form-control"
                value={formData.ref_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Reference Contact Number *</label>
              <input
                type="tel"
                name="ref_contact"
                className="form-control"
                value={formData.ref_contact}
                onChange={handleChange}
                required
                placeholder="Enter contact number"
              />
            </div>
            <div className="form-group">
              <label>Relationship to Reference *</label>
              <input
                type="text"
                name="ref_relationship"
                className="form-control"
                value={formData.ref_relationship}
                onChange={handleChange}
                required
                placeholder="e.g., Pastor, Music Teacher"
              />
            </div>
            
          </div>
           
          <div className="form-section">
            <h3 className="section-title">7. Declaration</h3>
            <div className="form-group">
              <label>Digital Signature *</label>
              <input
                type="text"
                name="signature"
                className="form-control"
                value={formData.signature}
                onChange={handleChange}
                required
                placeholder="Type your full name as signature"
              />
            </div>
            <div className="form-group">
              <label>Date *</label>
              <input
                type="date"
                name="date"
                className="form-control"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
    <label className="checkbox-label">
      <input
        type="checkbox"
        name="declaration"
        checked={formData.declaration}
        onChange={(e) => setFormData({...formData, declaration: e.target.checked})}
        required
      />
      I confirm that the information provided above is accurate. I understand that being part of VOKIM requires commitment, teamwork, and professionalism.
    </label>
  </div>
            <p className="form-note">* Required fields</p>
          </div>
          <button 
            type="submit" 
            className="submit-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Submitting...' : 'Submit Application'}
          </button>

          {isSubmitted && (
            <div className="success-message">
              <span className="checkmark">✓</span>
              <span>Your application has been successfully submitted!</span>
            </div>
          )}
          {errorMessage && (
            <div className="error-message" style={{ color: 'red' }}>
              {errorMessage}
            </div>
          )}
        </form>
        ):(// Non-Musician Form
        <form onSubmit={handleSubmitNonMusician}>
          {/* Personal Information Section (Common for both forms) */}
          <div className="form-section">
            <h3 className="section-title">1. Personal Information</h3>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="full_name"
                className="form-control"
                value={formData.full_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Age</label>
              <input
                type="number"
                name="age"
                className="form-control"
                value={formData.age}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <select
                name="gender"
                className="form-control"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Nationality</label>
              <input
                type="text"
                name="nationality"
                className="form-control"
                value={formData.nationality}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Address</label>
              <textarea
                name="address"
                className="form-control"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone_number"
                className="form-control"
                value={formData.phone_number}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Occupation</label>
              <input
                type="text"
                name="occupation"
                className="form-control"
                value={formData.occupation}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Role Application Section */}
          <div className="form-section">
            <h3 className="section-title">2. Role Application</h3>
            <div className="form-group">
              <label>Select the role you are applying for</label>
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="radio"
                    name="role"
                    value="Administration"
                    checked={formData.role === 'Administration'}
                    onChange={handleChange}
                    required
                  />
                  Administration
                </label>
                <label className="checkbox-label">
                  <input
                    type="radio"
                    name="role"
                    value="Media & Communications"
                    checked={formData.role === 'Media & Communications'}
                    onChange={handleChange}
                  />
                  Media & Communications
                </label>
                <label className="checkbox-label">
                  <input
                    type="radio"
                    name="role"
                    value="Technical & Production"
                    checked={formData.role === 'Technical & Production'}
                    onChange={handleChange}
                  />
                  Technical & Production
                </label>
                <label className="checkbox-label">
                  <input
                    type="radio"
                    name="role"
                    value="Hospitality & Logistics"
                    checked={formData.role === 'Hospitality & Logistics'}
                    onChange={handleChange}
                  />
                  Hospitality & Logistics
                </label>
                <label className="checkbox-label">
                  <input
                    type="radio"
                    name="role"
                    value="Ministry & Spiritual Support"
                    checked={formData.role === 'Ministry & Spiritual Support'}
                    onChange={handleChange}
                  />
                  Ministry & Spiritual Support
                </label>
                <label className="checkbox-label">
                  <input
                    type="radio"
                    name="role"
                    value="Event Day Support"
                    checked={formData.role === 'Event Day Support'}
                    onChange={handleChange}
                  />
                  Event Day Support
                </label>
                <label className="checkbox-label">
                  <input
                    type="radio"
                    name="role"
                    value="Dancers"
                    checked={formData.role === 'Dancers'}
                    onChange={handleChange}
                  />
                  Dancers
                </label>
                <label className="checkbox-label">
                  <input
                    type="radio"
                    name="role"
                    value="Others"
                    checked={formData.role === 'Others'}
                    onChange={handleChange}
                  />
                  Others
                </label>
              </div>
            </div>
            {formData.role === 'Others' && (
              <div className="form-group">
                <label>Please specify your role</label>
                <input
                  type="text"
                  name="role_other"
                  className="form-control"
                  value={formData.role_other}
                  onChange={handleChange}
                  required
                  placeholder="Describe your role"
                />
              </div>
            )}
          </div>

          {/* Experience & Skills Section */}
          <div className="form-section">
            <h3 className="section-title">3. Experience & Skills</h3>
            <div className="form-group">
              <label>Do you have prior experience in this role?</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="prior_experience"
                    value="yes"
                    checked={formData.prior_experience === 'yes'}
                    onChange={handleChange}
                    required
                  />
                  Yes
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="prior_experience"
                    value="no"
                    checked={formData.prior_experience === 'no'}
                    onChange={handleChange}
                  />
                  No
                </label>
              </div>
            </div>
            {formData.prior_experience === 'yes' && (
              <div className="form-group">
                <label>If yes, provide details</label>
                <textarea
                  name="experience_details"
                  className="form-control"
                  value={formData.experience_details}
                  onChange={handleChange}
                  required
                />
              </div>
            )}
            <div className="form-group">
              <label>Relevant Skills (e.g., leadership, communication, technical skills)</label>
              <textarea
                name="relevant_skills"
                className="form-control"
                value={formData.relevant_skills}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Have you worked with a band or entertainment group before?</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="worked_with_band"
                    value="yes"
                    checked={formData.worked_with_band === 'yes'}
                    onChange={handleChange}
                    required
                  />
                  Yes
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="worked_with_band"
                    value="no"
                    checked={formData.worked_with_band === 'no'}
                    onChange={handleChange}
                  />
                  No
                </label>
              </div>
            </div>
            {formData.worked_with_band === 'yes' && (
              <div className="form-group">
                <label>If yes, give details</label>
                <textarea
                  name="band_experience_details"
                  className="form-control"
                  value={formData.band_experience_details}
                  onChange={handleChange}
                  required
                />
              </div>
            )}
          </div>

          {/* Availability & Commitment Section */}
          <div className="form-section">
            <h3 className="section-title">4. Availability & Commitment</h3>
            <div className="form-group">
              <label>Are you available for meetings, rehearsals, and events?</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="available_for_meetings"
                    value="yes"
                    checked={formData.available_for_meetings === 'yes'}
                    onChange={handleChange}
                    required
                  />
                  Yes
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="available_for_meetings"
                    value="no"
                    checked={formData.available_for_meetings === 'no'}
                    onChange={handleChange}
                  />
                  No
                </label>
              </div>
            </div>
            <div className="form-group">
              <label>How many hours per week can you commit?</label>
              <input
                type="number"
                name="hours_per_week"
                className="form-control"
                value={formData.hours_per_week}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Are you willing to travel if necessary?</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="willing_to_travel"
                    value="yes"
                    checked={formData.willing_to_travel === 'yes'}
                    onChange={handleChange}
                    required
                  />
                  Yes
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="willing_to_travel"
                    value="no"
                    checked={formData.willing_to_travel === 'no'}
                    onChange={handleChange}
                  />
                  No
                </label>
              </div>
            </div>
          </div>

          {/* Motivation & Expectations Section */}
          <div className="form-section">
            <h3 className="section-title">5. Motivation & Expectations</h3>
            <div className="form-group">
              <label>Why do you want to be part of VOKIM African Band?</label>
              <textarea
                name="motivation"
                className="form-control"
                value={formData.motivation}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>What do you hope to achieve as part of the team?</label>
              <textarea
                name="expectations"
                className="form-control"
                value={formData.expectations}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* References Section */}
          <div className="form-section">
            <h3 className="section-title">6. References (Optional)</h3>
            <div className="form-group">
              <label>Reference Name</label>
              <input
                type="text"
                name="ref_name"
                className="form-control"
                value={formData.ref_name}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Reference Contact</label>
              <input
                type="tel"
                name="ref_contact"
                className="form-control"
                value={formData.ref_contact}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Second Reference Name</label>
              <input
                type="text"
                name="ref_name2"
                className="form-control"
                value={formData.ref_name2}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Second Reference Contact</label>
              <input
                type="tel"
                name="ref_contact2"
                className="form-control"
                value={formData.ref_contact2}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Declaration Section */}
          <div className="form-section">
            <h3 className="section-title">7. Declaration</h3>
            
            <div className="form-group">
              <label>Digital Signature *</label>
              <input
                type="text"
                name="signature"
                className="form-control"
                value={formData.signature}
                onChange={handleChange}
                required
                placeholder="Type your full name as signature"
              />
            </div>
            <div className="form-group">
              <label>Date *</label>
              <input
                type="date"
                name="date"
                className="form-control"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="declaration"
                checked={formData.declaration}
                onChange={(e) => setFormData({...formData, declaration: e.target.checked})}
                required
              />I confirm that the information provided above is accurate. I understand that being part of VOKIM requires commitment, teamwork, and professionalism.
            </label>
          </div>
            <p className="form-note">* Required fields</p>
          </div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
      )}

      {isSubmitted && (
        <div className="success-message">
          <span className="checkmark">✓</span>
          <span>Your application has been successfully submitted!</span>
        </div>
      )}
      {errorMessage && (
        <div className="error-message" style={{ color: 'red' }}>
          {errorMessage}
        </div>
      )}
      </div>
      </div>
    </>
  );
};

export default GospelBandForm;