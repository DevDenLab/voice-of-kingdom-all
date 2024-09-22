import React from 'react';
import { Typography, Grid } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';

const WelcomeSection = () => {
  const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <Grid container justifyContent="center" alignItems="center" direction="column" style={{ padding: '50px 0', textAlign: 'center' }}>
      <Grid item xs={12}>
        <img
          src="/path-to-welcome-image.jpg"
          alt="Welcome"
          style={{ width: isMobile ? '100%' : '80%' }} // Adjust size based on screen width
        />
        <Typography variant={isMobile ? 'h5' : 'h3'} style={{ marginTop: '20px' }}>
          Welcome to My Website
        </Typography>
      </Grid>
    </Grid>
  );
};

export default WelcomeSection;
