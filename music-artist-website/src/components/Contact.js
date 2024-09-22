import React, { useState } from 'react';
import { 
  Typography, 
  Grid, 
  TextField, 
  Button, 
  Paper, 
  Box,
  Container
} from '@mui/material';
import { 
  Phone as PhoneIcon, 
  Email as EmailIcon, 
  LocationOn as LocationIcon 
} from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link } from '@mui/material';

const theme = createTheme({
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    h2: {
      fontWeight: 700,
      fontSize: '2.5rem',
      marginBottom: '1rem',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);  // State to track form submission
  const [error, setError] = useState(false);  // State to track submission error

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(false);  // Reset submission status
    setError(false);  // Reset error status
    const csrftoken = getCookie('csrftoken');

    try {
      const response = await fetch('/api/contact/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);  // Show success message
        setFormData({ name: '', email: '', message: '' });  // Reset form fields
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setError(true);  // Show error message
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg" sx={{ py: 8, backgroundColor: '#ffffcc' }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 4, height: '92%' }}>
              <Typography variant="h2" gutterBottom>
                Get In Touch
              </Typography>
              <Typography variant="body1" paragraph>
                Connect, collaborate, book or simply say hello. Reach out to us today!
              </Typography>
              <Box sx={{ my: 3 }}>
                <Typography variant="body1" sx={{ fontSize: 20, display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PhoneIcon sx={{ mr: 2, color: 'primary.main' }} />
                  <Link href="tel:+17348112030870" color="inherit" sx={{ textDecoration: 'underline' }}>
                    +1 734 811 203 0870
                  </Link>
                </Typography>
                <Typography variant="body1" sx={{ fontSize: 20, display: 'flex', alignItems: 'center', mb: 2 }}>
                  <EmailIcon sx={{ mr: 2, color: 'primary.main' }} />
                  <Link href="mailto:info@voiceofkingdom.com" color="inherit" sx={{ textDecoration: 'underline' }}>
                    info@voiceofkingdom.com
                  </Link>
                </Typography>
                <Typography variant="body1" sx={{ fontSize: 20, display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocationIcon sx={{ mr: 2, color: 'primary.main' }} />
                  <Link
                    href="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d9484.033081727364!2d-113.49919795!3d53.53976655!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x53a02247b272d369%3A0x612824385e498946!2sDowntown%2C%20Edmonton%2C%20AB!5e0!3m2!1sen!2sca!4v1726701731294!5m2!1sen!2sca"
                    color="inherit"
                    sx={{ textDecoration: 'underline' }}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    39 edmonton street canada
                  </Link>
                </Typography>
              </Box>
              <Typography variant="h6" gutterBottom>
                Get direction
              </Typography>
              <Box sx={{ height: 250, width: '100%', mt: 2 }}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3939.6483741744416!2d3.3631549!3d6.5394738!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8d12ef7b736b%3A0xf108e4418b73d3a7!2s39%20Shyllon%20St%2C%20Ilupeju%20102415%2C%20Lagos!5e0!3m2!1sen!2sng!4v1631241234567"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  title='map'
                  loading="lazy"
                ></iframe>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 4, height: '92%' }}>
              <Typography variant="h2" gutterBottom sx={{ textAlign: 'center' }}>
                Send A Message
              </Typography>
              <Typography variant="h8" gutterBottom sx={{ textAlign: 'center'}} style={{ fontSize: 22, fontFamily: "IM Fell Great Primer", color: "black" }}>
                Send your thoughts, questions, or greetings our way
              </Typography>
              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Message"
                  name="message"
                  multiline
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  margin="normal"
                />
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary" 
                  size="large"
                  sx={{ mt: 2 }}
                >
                  Submit
                </Button>
              </form>

              {/* Display Success or Error Message */}
              {submitted && (
                <Typography variant="h6" sx={{ mt: 2, color: 'green' }}>
                  Form submitted successfully!
                </Typography>
              )}
              {error && (
                <Typography variant="h6" sx={{ mt: 2, color: 'red' }}>
                  Error submitting form. Please try again.
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
};

export default Contact;
