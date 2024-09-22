import React from 'react';
import { Typography } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';

const MapSection = () => {
  const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <div style={{ padding: '0 0', textAlign: 'center', marginTop: '-20px' }}>
      <Typography variant="h3" fontWeight="bold" mb={3}>Our Location</Typography>
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d9484.033081727364!2d-113.49919795!3d53.53976655!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x53a02247b272d369%3A0x612824385e498946!2sDowntown%2C%20Edmonton%2C%20AB!5e0!3m2!1sen!2sca!4v1726701731294!5m2!1sen!2sca"
        width={isMobile ? "99%" : "600"}
        height="400"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        title='map'
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
};

export default MapSection;
