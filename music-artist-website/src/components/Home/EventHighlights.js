import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { Cloudinary } from "@cloudinary/url-gen";

// Initialize Cloudinary
const cld = new Cloudinary({
  cloud: {
    cloudName: 'ddkeblfid'
  }
});

// Add the CloudinaryImage component
const CloudinaryImage = ({ publicId }) => {
  // Remove format and quality transformations since they're causing issues
  const imageUrl = cld.image(publicId).toURL();

  return (
    <img 
      src={imageUrl}
      alt={`Highlight`}
      loading="lazy"
      onError={(e) => console.log('Image load error:', e)} // For debugging
    />
  );
};

// Add the VideoPlayer component
const VideoPlayer = ({ video }) => {
  const [error, setError] = useState(false);

  const handleError = (e) => {
    console.error("Error loading video:", e);
    setError(true);
  };

  if (error) {
    return <div>Error loading video. Please try again later.</div>;
  }

  return (
    <video 
      controls
      width="300px"
      height="200px"
      preload="metadata"
      playsInline
      style={{ borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}
      onError={handleError}
    >
      <source 
        src={video.url} 
        type="video/quicktime"
      />
      <source 
        src={video.url.replace('.MOV', '.mp4')} 
        type="video/mp4"
      />
      Your browser does not support the video format.
    </video>
  );
};

// Styled Components
const HighlightsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  margin-top: 30px;
  padding: 0 15px; /* Add padding for smaller screens */
`;

const Title = styled.h2`
  font-family: "Montserrat", sans-serif;
  font-size: 2.4rem;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
  letter-spacing: 0.5px;
  font-weight: 700;

  @media (max-width: 768px) {
    font-size: 2rem; /* Adjust font size for tablets */
  }

  @media (max-width: 480px) {
    font-size: 1.8rem; /* Adjust font size for mobile devices */
  }
`;

const Collage = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  width: 100%;
  margin-bottom: 20px;

  img {
    width: 100%;
    height: auto;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr); /* Adjust grid for tablets */
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr; /* Adjust grid for mobile devices */
  }
`;

// Update the VideoHighlights styled component
const VideoHighlights = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  flex-wrap: wrap;

  video {
    @media (max-width: 768px) {
      width: 100%;
      height: auto;
    }
  }
`;

const GalleryButton = styled.button`
  background-color: #E4A11B;
  color: white;
  font-size: 1rem;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color:rgb(96, 66, 4);
  }

  @media (max-width: 480px) {
    font-size: 0.9rem; /* Adjust font size for mobile devices */
    padding: 8px 16px; /* Adjust padding for mobile devices */
  }
`;

// Update the main EventHighlights component
const EventHighlights = ({ images = [], videos = [] }) => {
  const navigate = useNavigate();

  const handleGalleryNavigation = () => {
    navigate("/gallery");
  };

  return (
    <HighlightsWrapper>
      <Title>Event Highlights</Title>
      <Collage>
        {images.slice(0, 6).map((image, index) => (
          <CloudinaryImage 
            key={index} 
            publicId={image} // Pass just the ID part, e.g., 'VOKIM187_rjlgag'
          />
        ))}
      </Collage>
      <VideoHighlights>
        {videos.slice(0, 2).map((video, index) => (
          <VideoPlayer key={index} video={video} />
        ))}
      </VideoHighlights>
      <GalleryButton onClick={handleGalleryNavigation}>
        View Full Gallery
      </GalleryButton>
    </HighlightsWrapper>
  );
};

export default EventHighlights;