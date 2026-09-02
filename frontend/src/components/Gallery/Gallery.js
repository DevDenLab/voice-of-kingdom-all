import React, { useEffect, useState } from 'react';
import './Gallery.css';
import { galleryUrl, previewUrl } from '../../lib/imageUrl';

// Used by App.js to warm the browser cache before the Gallery route mounts.
export const preloadGalleryImages = async () => {
  try {
    const response = await fetch('/api/gallery-images/');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    (data.images || []).slice(0, 12).forEach((image) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = previewUrl(image.publicId);
      document.head.appendChild(link);
    });
    return data;
  } catch (error) {
    console.error('Error preloading gallery images:', error);
    return null;
  }
};

const Gallery = () => {
  const [sections, setSections] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ready | error

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const response = await fetch('/api/gallery-images/');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        if (cancelled) return;
        setSections(data.sections || []);
        setStatus('ready');
      } catch (err) {
        console.error('Error loading images:', err);
        if (!cancelled) setStatus('error');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const visibleSections = sections.filter((s) => s.images && s.images.length > 0);

  return (
    <div className="gallery">
      {status === 'error' && (
        <div className="gallery-error">
          Unable to load gallery images. Please refresh the page.
        </div>
      )}

      {status === 'loading' && (
        <div className="gallery-loading-indicator">
          <div className="loading-spinner"></div>
        </div>
      )}

      {status === 'ready' && visibleSections.length === 0 && (
        <p className="gallery-end">No photos have been added yet.</p>
      )}

      {visibleSections.map((section) => (
        <div className="gallery-year" key={section.slug || 'root'}>
          <h2 className="centered-heading">{section.title}</h2>
          <div className="gallery-items">
            {section.images.map((image) => (
              <div key={image.publicId} className="gallery-item">
                <img
                  src={galleryUrl(image.publicId)}
                  alt={image.alt || image.publicId}
                  className="gallery-image"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="gallery-admin-link">
        <a href="/gallery/manage">Manage gallery (admin)</a>
      </div>
    </div>
  );
};

export default Gallery;
