import React, { useState } from 'react';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

const Alert = ({ children, type }) => (
  <div className={`alert ${type}`}>
    {children}
  </div>
);

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    source: '',
    subject: '',
    message: ''
  });

  const [status, setStatus] = useState({
    loading: false,
    success: false,
    error: null
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: null });

    try {
      const response = await fetch('/api/contact/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to submit form');

      setStatus({ loading: false, success: true, error: null });
      setFormData({
        name: '',
        email: '',
        phone: '',
        source: '',
        subject: '',
        message: ''
      });

      setTimeout(() => setStatus(prev => ({ ...prev, success: false })), 5000);
    } catch (error) {
      setStatus({ loading: false, success: false, error: error.message });
      setTimeout(() => setStatus(prev => ({ ...prev, error: null })), 5000);
    }
  };

  return (
    <div className="contact-container">
      <div className="contact-wrapper">
        <header className="contact-header">
          <h1 className="contact-title">GET IN TOUCH</h1>
        </header>

        <div className="contact-card">
          {status.success && (
            <Alert type="success">
              <CheckCircle size={16} />
              <span>Message sent successfully!</span>
            </Alert>
          )}
          
          {status.error && (
            <Alert type="error">
              <XCircle size={16} />
              <span>{status.error}</span>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <input
                type="text"
                name="name"
                placeholder="Your Name *"
                required
                value={formData.name}
                onChange={handleChange}
                disabled={status.loading}
              />
            </div>
            
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Your Email *"
                required
                value={formData.email}
                onChange={handleChange}
                disabled={status.loading}
              />
            </div>
            
            <div className="form-group">
              <input
                type="tel"
                name="phone"
                placeholder="Your Phone *"
                required
                value={formData.phone}
                onChange={handleChange}
                disabled={status.loading}
              />
            </div>
            
            <div className="form-group">
              <select
                name="source"
                value={formData.source}
                onChange={handleChange}
                disabled={status.loading}
              >
                <option value="">How did you hear about us?</option>
                <option value="social">Social Media</option>
                <option value="friend">Friend/Family</option>
                <option value="search">Search Engine</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div className="form-group">
              <input
                type="text"
                name="subject"
                placeholder="Subject *"
                required
                value={formData.subject}
                onChange={handleChange}
                disabled={status.loading}
              />
            </div>
            
            <div className="form-group">
              <textarea
                name="message"
                placeholder="Your Message *"
                required
                value={formData.message}
                onChange={handleChange}
                disabled={status.loading}
              />
            </div>
            
            <button
              type="submit"
              disabled={status.loading}
              className="submit-button"
            >
              {status.loading ? (
                <>
                  <Loader2 size={16} className="spinner" />
                  <span>Sending...</span>
                </>
              ) : (
                'Send Message'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;