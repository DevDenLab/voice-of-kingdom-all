import React from 'react';
import { Typography, Grid, Box } from '@mui/material';
// import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const PhotoGallery = () => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/gallery'); // Change this to the desired route
  };
  const images = [
    { src: "/sample_artist.jpg", alt: "Gallery 1" },
    { src: "/sample_artist.jpg", alt: "Gallery 2" },
    { src: "/sample_artist.jpg", alt: "Gallery 3" },
    { src: "/sample_artist.jpg", alt: "Gallery 4" },
    { src: "/sample_artist.jpg", alt: "Gallery 5" },
    { src: "/sample_artist.jpg", alt: "Gallery 6" }
  ];

  return (
    <Box sx={{ padding: '30px 15px', textAlign: 'center', marginTop: '-45px' }}>
      <Typography variant="h3" fontWeight="bold" mb={3}>
        Photo Gallery
      </Typography>
      <Grid container spacing={1} justifyContent="center">
        <Grid item xs={12} md={6}>
          <Box
            component="img"
            src={images[0].src}
            alt={images[0].alt}
            sx={{
              width: '100%',
              height: '300px',
              objectFit: 'cover',
              borderRadius: '4px',
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Grid container spacing={1}>
            {images.slice(1, 5).map((image, index) => (
              <Grid item xs={6} key={index}>
                <Box
                  component="img"
                  src={image.src}
                  alt={image.alt}
                  sx={{
                    width: '100%',
                    height: '145px',
                    objectFit: 'cover',
                    borderRadius: '4px',
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Box 
            position="relative" 
            sx={{ 
              width: '100%', 
              height: '145px', 
              borderRadius: '4px',
              overflow: 'hidden'
            }}
          >
            <Box
              component="img"
              src={images[5].src}
              alt={images[5].alt}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '24px',
                fontWeight: 'bold',
              }}
            >
              +50 More
            </Box>
          </Box>
        </Grid>
      </Grid>
      {/* Add the button below */}
      <button className="watch-more-button" onClick={handleButtonClick}>
        Go to Gallery &rarr;
      </button>
    </Box>
  );
};

export default PhotoGallery;