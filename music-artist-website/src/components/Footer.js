import React from 'react';
import { MDBFooter, MDBContainer, MDBRow, MDBCol, MDBIcon } from 'mdb-react-ui-kit';
import { FaSpotify, FaMusic, FaYoutube, FaAmazon, FaTiktok, FaInstagram, FaTwitter, FaFacebook } from 'react-icons/fa';

export default function Footer() {
  // Social media and streaming links configuration
  const socialLinks = [
    { icon: FaFacebook, url: "https://www.facebook.com/people/VOKIM/61574901202006/", color: '#3b5998' },
    { icon: FaInstagram, url: "https://www.instagram.com/vokim_ministries/", color: '#E1306C' },
    { icon: FaTwitter, url: "https://www.twitter.com", color: '#1DA1F2' }
  ];

  const streamingLinks = [
    { icon: FaSpotify, url: "https://www.spotify.com", color: '#1DB954' },
    { icon: FaTiktok, url: "https://www.tiktok.com/@vokim_ministries", color: '#000000' },
    { icon: FaYoutube, url: "https://www.youtube.com/channel/UCI04HRqeev5ZXlyCUo5smLg", color: '#FF0000' },
    { icon: FaMusic, url: "https://music.apple.com", color: '#FA243C' },
    { icon: FaAmazon, url: "https://music.amazon.com", color: '#232F3E' }
  ];

  // Reusable icon rendering component
  const SocialIconGroup = ({ links, className = '' }) => (
    <div className={`d-flex justify-content-center align-items-center ${className}`} style={{ gap: '1rem' }}>
      {links.map((link, index) => (
        <a 
          key={index} 
          href={link.url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="d-flex align-items-center justify-content-center"
          style={{ 
            color: link.color, 
            transition: 'transform 0.3s ease',
            textDecoration: 'none'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <link.icon size={32} />
        </a>
      ))}
    </div>
  );

  return (
    <MDBFooter style={{ backgroundColor: '#E4A11B' }} className='text-center text-lg-start text-muted'>
      <MDBContainer className='text-center text-md-start '>
        {/* Logo Section */}
        <MDBRow className='mt-5'>
          <MDBCol md="12" className='mx-auto mb-4'>
            <div className='d-flex align-items-center justify-content-center'>
              <img 
                src="static/footer.jpg" 
                alt="Logo" 
                className="me-2" 
                style={{ height: '90px' }} 
              />
              {/* <span style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#ffffff'  }}>
                Voice Of the Kingdom
              </span> */}
            </div>
          </MDBCol>
        </MDBRow>

        {/* Contact, Connect, and Stream Sections */}
        <MDBRow className='mt-3 footer-row'>
          {/* Contact Section */}
          <MDBCol md="4" className='mx-auto mb-4 no-padding footer-section'>
            <h2 className='text-uppercase fw-bold mb-4 text-center' style={{ color: '#ffffff' }}>Contact</h2>
            <div className='text-center'>
              <p>
                <MDBIcon icon="envelope" className="me-3" />
                <a href="mailto:info@vokim.ca" style={{ color: '#ffffff' }}>info@vokim.ca</a>
              </p>
              <p>
                <MDBIcon icon="phone" className="me-3" />
                <a href="tel:780 807 2238" style={{ color: '#ffffff' }}>+1 780 807 2238</a>
              </p>
              <p>
                <MDBIcon icon="phone" className="me-3" />
                <a href="tel:5876642692" style={{ color: '#ffffff' }}>+1 587 664 2692</a>
              </p>
            </div>
          </MDBCol>

          {/* Connect Section */}
          <MDBCol md="4" className='mx-auto mb-4 custom-padding footer-section'>
            <div>
              <h2 className='text-uppercase fw-bold mb-4 text-center' style={{ color: '#ffffff' }}>Connect</h2>
              <SocialIconGroup links={socialLinks} />
            </div>
          </MDBCol>

          {/* Stream Section */}
          <MDBCol md="4" className='mx-auto mb-4 custom-padding footer-section'>
            <h2 className='text-uppercase fw-bold mb-4 text-center' style={{ color: '#ffffff' }}>Stream</h2>
            <SocialIconGroup links={streamingLinks} />
          </MDBCol>
        </MDBRow>
      </MDBContainer>
      
      <div 
        className='text-center p-4' 
        style={{ 
          backgroundColor: 'rgba(18, 8, 7)', 
          color: '#FFFFFF' 
        }}
      >
        © 2024 Voice of the Kingdom Ministries
      </div>
    </MDBFooter>
  );
}