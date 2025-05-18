import React, { useEffect, useState, useCallback } from 'react';
import './Gallery.css';
import { CloudinaryContext, Image } from 'cloudinary-react';

// Create a preload function that can be used globally
export const preloadGalleryImages = async () => {
  try {
    const response = await fetch('/api/gallery-images/');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    if (data.images && data.images.length > 0) {
      // Preload first batch of images
      data.images.slice(0, 12).forEach(image => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = `https://res.cloudinary.com/ddkeblfid/image/upload/c_scale,w_800,q_auto:good/${image.publicId}`;
        document.head.appendChild(link);
      });
    }
    return data;
  } catch (error) {
    console.error('Error preloading gallery images:', error);
    return null;
  }
};

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const imagesPerPage = 24;

  // Function to load images with retry logic
  const loadImages = useCallback(async (cursor = null) => {
    if (loading || (!hasMore && cursor)) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/gallery-images/?${cursor ? `next_cursor=${cursor}` : ''}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.images && data.images.length > 0) {
        setImages(prevImages => {
          const existingIds = new Set(prevImages.map(img => img.publicId));
          const newImages = data.images.filter(img => !existingIds.has(img.publicId));
          return [...prevImages, ...newImages];
        });
        setNextCursor(data.next_cursor);
        setHasMore(data.has_more);
        setPage(prev => prev + 1);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading images:', error);
      setError('Failed to load images. Please try again.');
      setTimeout(() => {
        if (hasMore) {
          loadImages(cursor);
        }
      }, 3000);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore]);

  // Load initial batch
  useEffect(() => {
    loadImages();
  }, [loadImages]);

  // Load more images when user scrolls near bottom
  useEffect(() => {
    const handleScroll = () => {
      if (loading || !nextCursor || !hasMore) return;
      
      const scrollPosition = window.innerHeight + window.scrollY;
      const threshold = document.documentElement.scrollHeight - 800;
      
      if (scrollPosition > threshold) {
        loadImages(nextCursor);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [nextCursor, loading, loadImages, hasMore]);

  // Calculate current page images
  const currentImages = images.slice(0, page * imagesPerPage);

  return (
    <CloudinaryContext cloudName="ddkeblfid">
      <div className="gallery">
        <div className="gallery-year">
          <h2 className="centered-heading">Vokim 2025</h2>
          <div className="gallery-items">
            {currentImages.map((image, index) => (
              <div key={image.publicId} className="gallery-item">
                <Image
                  publicId={image.publicId}
                  alt={image.alt}
                  className="gallery-image"
                  loading="eager"
                  width="auto"
                  crop="scale"
                  quality="auto:good"
                  fetchFormat="auto"
                  dpr="auto"
                  responsive
                  responsiveUseBreakpoints
                  transformation={[
                    {
                      width: 1600,
                      height: 1200,
                      crop: 'scale',
                      quality: 'auto:good',
                      fetch_format: 'auto',
                      dpr: 'auto'
                    }
                  ]}
                  breakpoints={[375, 768, 1024, 1366]}
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
            ))}
          </div>
          {error && <div className="gallery-error">{error}</div>}
          {loading && hasMore && (
            <div className="gallery-loading-indicator">
              <div className="loading-spinner"></div>
            </div>
          )}
          {!hasMore && images.length > 0 && (
            <div className="gallery-end">All images loaded</div>
          )}
        </div>
      </div>
    </CloudinaryContext>
  );
};

export default Gallery;