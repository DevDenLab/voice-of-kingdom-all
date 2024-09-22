import React from 'react';
import { Typography, Grid } from '@mui/material';
// import { useNavigate } from 'react-router-dom';
import './ReadMoreLink.css'; // Import the CSS file here
import './VideoSection.css';

const VideoSection = () => {
  // const navigate = useNavigate();

  const handleButtonClick = () => {
    // navigate('/more-content'); // Change this to the desired route
    window.location.href = 'https://www.spotify.com/';
  };
  return (
    <div style={{ padding: '0 0', textAlign: 'center', marginTop: '-10px' }}>
      <Typography variant="h3" fontWeight="bold">Watch Performances</Typography>
      <Grid container spacing={1} justifyContent="center" style={{ marginTop: '20px' }}>
        <Grid item xs={12} sm={6} md={4}>
          <iframe
            width="98%"
            height="225"
            src="https://www.youtube.com/embed/5y5FD-G_S54?si=p_lQwqSv5fMhNGXW"
            title="Video 1"
            className="my-iframe"
            allowFullScreen
          ></iframe>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <iframe
            width="98%"
            height="225"
            src="https://www.youtube.com/embed/5y5FD-G_S54?si=p_lQwqSv5fMhNGXW"
            title="Video 2"
            className="my-iframe"
            allowFullScreen
          ></iframe>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <iframe
            width="98%"
            height="225"
            src="https://www.youtube.com/embed/5y5FD-G_S54?si=p_lQwqSv5fMhNGXW"
            title="Video 3"
            className="my-iframe"
            allowFullScreen
          ></iframe>
        </Grid>
      </Grid>
      {/* Add the button below */}
      <button className="watch-more-button" onClick={handleButtonClick}>
        Watch More Performances &rarr;
      </button>
    </div>
  );
};

export default VideoSection;
