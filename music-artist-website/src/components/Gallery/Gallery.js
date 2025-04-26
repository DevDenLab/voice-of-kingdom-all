import React, { useEffect, useState } from 'react';
import './Gallery.css';
import { CloudinaryContext, Image } from 'cloudinary-react';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        // Using Django backend endpoint instead of direct Cloudinary API
        const response = await fetch('/api/gallery-images/');
        const data = await response.json();
        
        setImages(data.images);
        setLoading(false);
      } catch (error) {
        console.error('Error loading images:', error);
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (loading) {
    return <div className="gallery-loading">Loading gallery...</div>;
  }

  return (
    <CloudinaryContext cloudName="ddkeblfid">
      <div className="gallery">
        <div className="gallery-year">
          <h2 className="centered-heading">Vokim 2025</h2>
          <div className="gallery-items">
            {images.map((image, index) => (
              <div key={index} className="gallery-item">
                <Image
                  publicId={image.publicId}
                  alt={image.alt}
                  className="gallery-image"
                  loading="lazy"
                  width="auto"
                  crop="scale"
                  quality="auto"
                  fetchFormat="auto"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </CloudinaryContext>
  );
};

export default Gallery;