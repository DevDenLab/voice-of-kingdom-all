import React, { useState } from 'react';
import { Download, ExternalLink, ChevronRight } from 'lucide-react';

const PublicationsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Sample data - replace with your actual data
  const publications = [
    {
      id: 1,
      title: "Worthy of My Praise",
      category: "The Great Commission",
      subtitle: "Repentance & Yieldedness",
      image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643",
      downloadUrl: "/downloads/worthy-praise-alarm.pdf"
    },
    {
      id: 2,
      title: "The Great Commission",
      category: "New Album",
      subtitle: "Repentance & Yieldedness",
      image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643",
      downloadUrl: "/downloads/great-commission.pdf"
    },
    {
      id: 3,
      title: "A Call to Prayer II",
      subtitle: "Repentance & Yieldedness",
      category: "The Word",
      image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643",
      downloadUrl: "/downloads/call-to-prayer.pdf"
    }
  ];

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = publications.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(publications.length / itemsPerPage);

  const handleDownload = (url) => {
    // Implement download logic here
    console.log('Downloading:', url);
  };

  return (
    <div className="publications-page">
      <div className="hero-section-publication">
        <div className="hero-overlay"></div>
        {/* <h1>VOK Publications</h1> */}
      </div>

      <div className="publications-container">
        <div className="publications-grid">
          {currentItems.map((pub) => (
            <div key={pub.id} className="publication-card">
              <div className="card-image-container">
                <img src={pub.image} alt={pub.title} />
              </div>
              <div className="card-content">
                <span className="category">{pub.category}</span>
                <h3 className="title">{pub.title}</h3>
                <p className="subtitle">{pub.subtitle}</p>
              </div>
              <div className="card-actions">
                <button 
                  className="action-button download"
                  onClick={() => handleDownload(pub.downloadUrl)}
                >
                  <Download size={18} />
                  <span>Download PDF</span>
                </button>
                <button className="action-button read-more">
                  <ExternalLink size={18} />
                  <span>Read More</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                className={`page-button ${currentPage === index + 1 ? 'active' : ''}`}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            {currentPage < totalPages && (
              <button 
                className="page-button next"
                onClick={() => setCurrentPage(curr => curr + 1)}
              >
                <span>Next</span>
                <ChevronRight size={16} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicationsPage;