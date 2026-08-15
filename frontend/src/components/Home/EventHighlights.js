import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import React from "react";
import { imageUrl } from "../../lib/imageUrl";

// Media image component -- MinIO object served through imgproxy
const MediaImage = ({ publicId, index }) => {
  const url = imageUrl(publicId, { width: 400, height: 300, resize: "fill" });

  return (
    <img 
      src={url}
      alt={`Event Highlight ${index + 1}`}
      loading="eager"
      width="400"
      height="300"
      style={{ objectFit: 'cover' }}
      onError={(e) => console.log('Image load error:', e)}
    />
  );
};

// Add the VideoPlayer component
const VideoPlayer = ({ video }) => {
  // Ensure the video URL is properly formatted
  const getVideoUrl = (url) => {
    try {
      const videoId = url.split('embed/')[1]?.split('?')[0];
      if (!videoId) return url;
      
      return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1&origin=${window.location.origin}&enablejsapi=1&widgetid=1`;
    } catch (error) {
      console.error('Error formatting video URL:', error);
      return url;
    }
  };

  return (
    <iframe
      width="560"
      height="315"
      src={getVideoUrl(video.url)}
      title="YouTube video player"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerPolicy="strict-origin-when-cross-origin"
      allowFullScreen
      style={{ borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}
      sandbox="allow-same-origin allow-scripts allow-popups allow-presentation"
      loading="lazy"
    />
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
  justify-content: center;

  iframe {
    @media (max-width: 768px) {
      width: 100%;
      height: 315px;
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

  // Preload all images
  React.useEffect(() => {
    images.forEach((publicId) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = imageUrl(publicId, { width: 400, height: 300, resize: "fill" });
      document.head.appendChild(link);
    });
  }, [images]);

  const handleGalleryNavigation = () => {
    navigate("/gallery");
  };

  return (
    <HighlightsWrapper>
      <Title>Event Highlights</Title>
      <Collage>
        {images.slice(0, 6).map((image, index) => (
          <MediaImage 
            key={index} 
            publicId={image}
            index={index}
          />
        ))}
      </Collage>
      {/* <VideoHighlights>
        {videos.slice(0, 2).map((video, index) => (
          <VideoPlayer key={index} video={video} />
        ))}
      </VideoHighlights> */}
      <GalleryButton onClick={handleGalleryNavigation}>
        View Full Gallery
      </GalleryButton>
    </HighlightsWrapper>
  );
};

export default EventHighlights;