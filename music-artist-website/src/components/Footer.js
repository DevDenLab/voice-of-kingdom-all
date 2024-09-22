import React, { useState } from 'react';
import { Typography, Button, Box, TextField, IconButton } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import axios from 'axios';  // or use fetch if you prefer

const Footer = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Email validation function
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      // Example API request to subscribe
      const response = await axios.post('/api/subscribe/', { email }); // Change to the correct API endpoint

      if (response.status === 201) {
        setSuccessMessage('Subscribed!');
        setEmail('');  // Clear the email field after success
      } else {
        setError('Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Failed to subscribe. Please try again later.');
    }
  };

  return (
    <Box
      component="footer"
      sx={{
        padding: '50px 0',
        textAlign: 'center',
        background: 'linear-gradient(135deg, #1e3c72, #2a5298)',
        color: 'white',
      }}
    >
      {/* Contact Info Section */}
      <Typography variant="h4" sx={{ marginBottom: '20px', fontWeight: 'bold' }}>
        Stay Connected
      </Typography>

      {/* Subscription Form */}
      <Box
        component="form"
        onSubmit={handleSubscribe}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: '10px',
          marginBottom: '30px',
          flexWrap: 'wrap',
        }}
      >
        <TextField
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          variant="outlined"
          sx={{
            input: { color: 'white' },
            '& .MuiOutlinedInput-root': {
              borderRadius: '30px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              '&:hover fieldset': {
                borderColor: 'white',
              },
            },
            '& .MuiOutlinedInput-notchedOutline': {
              border: 'none',
            },
            width: { xs: '100%', sm: '300px' },
          }}
          InputLabelProps={{ sx: { color: 'white' } }}
        />
        <Button
          variant="contained"
          color="primary"
          type="submit"
          sx={{
            borderRadius: '30px',
            padding: '10px 30px',
            backgroundColor: '#ff6f61',
            '&:hover': {
              backgroundColor: '#ff5a4e',
            },
          }}
        >
          Subscribe
        </Button>
      </Box>

      {/* Error or Success Messages */}
      {error && <Typography sx={{ color: 'red' }}>{error}</Typography>}
      {successMessage && <Typography sx={{ color: 'green' }}>{successMessage}</Typography>}

      {/* Social Media Icons */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '30px' }}>
        <IconButton href="https://facebook.com" target="_blank" color="inherit">
          <FacebookIcon fontSize="large" sx={{ color: 'white', '&:hover': { color: '#ff6f61' } }} />
        </IconButton>
        <IconButton href="https://twitter.com" target="_blank" color="inherit">
          <TwitterIcon fontSize="large" sx={{ color: 'white', '&:hover': { color: '#ff6f61' } }} />
        </IconButton>
        <IconButton href="https://instagram.com" target="_blank" color="inherit">
          <InstagramIcon fontSize="large" sx={{ color: 'white', '&:hover': { color: '#ff6f61' } }} />
        </IconButton>
      </Box>

      {/* Contact Information */}
      <Box sx={{ marginBottom: '30px' }}>
        <Typography
          variant="h6"
          sx={{
            fontFamily: 'Roboto, sans-serif',
            fontWeight: '500',
            color: 'rgba(255, 255, 255, 0.8)',
          }}
        >
          Contact Info:
        </Typography>

        <Typography variant="body1" sx={{ marginBottom: '5px' }}>
          Email: <a href="mailto:john.doe@example.com" style={{ color: '#ff6f61' }}>john.doe@example.com</a>
        </Typography>

        <Typography variant="body1" sx={{ marginBottom: '5px' }}>
          Phone: <a href="tel:+1234567890" style={{ color: '#ff6f61' }}>+1 (234) 567-890</a>
        </Typography>

        <Typography variant="body1" sx={{ marginBottom: '5px' }}>
          Address: <a href="https://www.google.com/maps/place/Edmonton,+AB" style={{ color: '#ff6f61' }}>123 abc street, NW, Edmonton, Canada</a>
        </Typography>

        <Typography
          variant="h5"
          sx={{
            marginTop: '10px',
            fontFamily: '"Playfair Display", serif',
            fontWeight: '700',
            color: '#ff6f61',
          }}
        >
          Sarah Akintunde
        </Typography>

        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          Founder & CEO
        </Typography>
      </Box>

      {/* Footer Text */}
      <Typography variant="body2" sx={{ marginTop: '20px', color: 'rgba(255, 255, 255, 0.7)' }}>
        © 2024 Voice Of Kingdom. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
