import React from 'react';
import { Grid, Typography, Box, useTheme, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ArtistSection = () => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/biography'); // Change this to the desired route
  };
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box sx={{ overflow: 'hidden', width: '100%', bgcolor: 'background.paper' }}>
      <Grid 
        container 
        spacing={0} 
        alignItems="center" 
        sx={{
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        {/* Left Section: Image */}
        <Grid item xs={12} md={5} sx={{ p: { xs: 2, md: 4 } }}>
          <Box
            component="img"
            src="/sample_artist.jpg" // replace with your image path
            alt="Artist"
            sx={{
              width: '100%',
              height: { xs: '475px', md: '400px' },
              borderRadius: '10px',
              objectFit: 'cover',
              display: 'block',
              boxShadow: '3px 8px 63px -3px rgba(0,0,0,0.73);',
            }}
          />
        </Grid>

        {/* Right Section: Text */}
        <Grid item xs={12} md={7} sx={{ p: { xs: 2, md: 4 }, display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '5px' }}>
          <Typography variant={isMobile ? "h5" : "h4"} fontWeight="bold" gutterBottom sx={{ fontSize: 32, textAlign: 'center', width: '100%' }}>
            Who is Sarah Akintunde?
          </Typography>

          <Box sx={{ 
            mt: 2, 
            lineHeight: 1.6, 
            fontSize: { xs: '16px', md: '18px' },
            textAlign: 'justify',
            '& > p': {
            mb: 2, // Apply margin-bottom to all paragraphs except the last one
            },
          '& > p:last-child': {
            mb: 0, // Remove margin-bottom from the last paragraph
            },
          }}>
            <Typography component="p" style={{ fontSize: 24, fontFamily: "IM Fell Great Primer", color: "black" }}>
              Discover the enchanting world of Sarah Akintunde, an extraordinary Nigerian gospel artist whose voice transcends borders and captivates hearts.
            </Typography>
            <Typography component="p" style={{ fontSize: 24, fontFamily: "IM Fell Great Primer", color: "black" }}>
              With a divine gift for weaving soulful melodies and heartfelt lyrics, Sarah's music is a powerful vessel that connects listeners to the divine. Her passion for worship and relentless pursuit of excellence have earned her global recognition and multiple accolades.
            </Typography>
            <Typography component="p" style={{ fontSize: 24, fontFamily: "IM Fell Great Primer", color: "black" }}>
              Dive deeper into her remarkable journey, from humble beginnings to becoming a beacon of inspiration in the gospel music industry.
            </Typography>
          </Box>
          {/* Add the button below */}
          <button className="watch-more-button" onClick={handleButtonClick}>
            Read more &rarr;
          </button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ArtistSection;