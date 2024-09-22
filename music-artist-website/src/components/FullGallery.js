import React from 'react';
import { Grid, Typography } from '@mui/material';

const FullGallery = () => {
  return (
    <div style={{ padding: '50px 0', textAlign: 'center' }}>
      <Typography variant="h3" fontWeight="bold">Full Photo Gallery</Typography>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={6} md={3}>
          <img src="path/to/photo1.jpg" alt="Gallery Image" style={{ width: '100%' }} />
        </Grid>
        <Grid item xs={6} md={3}>
          <img src="path/to/photo2.jpg" alt="Gallery Image" style={{ width: '100%' }} />
        </Grid>
        <Grid item xs={6} md={3}>
          <img src="path/to/photo3.jpg" alt="Gallery Image" style={{ width: '100%' }} />
        </Grid>
        {/* Add more images as needed */}
      </Grid>
    </div>
  );
};

export default FullGallery;
