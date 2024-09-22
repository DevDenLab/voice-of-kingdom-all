import React from 'react';
import { Typography, Grid } from '@mui/material';
// import { useNavigate } from 'react-router-dom';
import './ReadMoreLink.css'; // Import the CSS file here

const SpotifySection = () => {
  // const navigate = useNavigate();

  const handleButtonClick = () => {
    window.location.href = 'https://www.spotify.com/';
  };

  return (
    <div style={{ padding: '10px 0', textAlign: 'center' }}>
      <Typography variant="h3" fontWeight="bold" gutterBottom>
        Latest Album
      </Typography>

      {/* Grid container for Spotify embeds */}
      <Grid container spacing={1} justifyContent="center" style={{ marginTop: '5px', padding: '0px' }}>
        
        {/* First Spotify Embed */}
        <Grid item xs={12} md={6} sx={{ marginBottom: { xs: '-70px', md: '0px' } }}>
          <iframe
            src="https://open.spotify.com/embed/show/7iQXmUT7XGuZSzAMjoNWlX/video?si=a23d94d50c524c8c&utm_source=oembed"
            width="96%" // Set width to 100% for responsiveness
            height="300"
            allow="encrypted-media"
            title="Spotify Player 1"
            style={{ border: 'none' }}
          ></iframe>
        </Grid>

        {/* Second Spotify Embed */}
        <Grid item xs={12} md={6} sx={{ marginBottom: { xs: '-70px', md: '0px' } }}>
          <iframe
            src="https://open.spotify.com/embed/track/5G2f63n7IPVPPjfNIGih7Q?si=b1cb5a61a49244ed&utm_source=oembed"
            width="96%" // Set width to 100% for responsiveness
            height="300"
            allow="encrypted-media"
            title="Spotify Player 2"
            style={{ border: 'none' }}
          ></iframe>
        </Grid>

      </Grid>

      {/* Button directly below the last embed */}
      <button
        className="watch-more-button"
        onClick={handleButtonClick}
        style={{ marginTop: '0px', padding: '10px 20px',marginBottom:"10px" }} // Reduce margin to bring it closer
      >
        Explore More Content &rarr;
      </button>
    </div>
  );
};

export default SpotifySection;
