import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaTiktok } from 'react-icons/fa';

const AboutUs = () => {
  const values = [
    {
      title: 'Faith-Driven',
      description: 'We believe in using our music as a ministry to encourage faith and share God\'s love.',
    },
    {
      title: 'Unity',
      description: 'We celebrate the power of community and seek to bring people together through music.',
    },
    {
      title: 'Excellence',
      description: 'We are committed to delivering high-quality music that honors God and inspires others.',
    },
  ];

  const socialLinks = [
    {
      icon: FaFacebook,
      href: 'https://www.facebook.com/people/VOKIM/61574901202006/',
      color: '#3b5998',
      label: 'Facebook',
    },
    {
      icon: FaTwitter,
      href: 'https://www.twitter.com/yourpage',
      color: '#1DA1F2',
      label: 'Twitter',
    },
    {
      icon: FaInstagram,
      href: 'https://www.instagram.com/yourpage',
      color: '#E1306C',
      label: 'Instagram',
    },
    {
      icon: FaTiktok,
      href: 'https://www.tiktok.com/yourpage',
      color: '#000000',
      label: 'TikTok',
    },
  ];

  return (
    <div className="about-page">
      {/* <div className="hero-section-about">
        <div className="hero-overlay"></div>
        <h1>ABOUT US</h1>
      </div> */}

      <div className="about-container">
        <section className="mission-vision-section">
          <div className="mission-vision-grid">
            <div className="info-card-about">
              <h3>Our Mission</h3>
              <p>Marching forward in harmony, proclaiming the Good News and transforming lives for the glory of God.</p>
            </div>

            <div className="info-card-about">
              <h3>Our Vision</h3>
              <p>With voices raised in praise and instruments tuned to the melodies of divine grace, we endeavor to touch hearts, uplift spirits, and glorify God, sharing His light in a world that yearns for peace and redemption.</p>
            </div>

            <div className="info-card-about">
              <h3>Our Motto</h3>
              <p>Raising Voices, Expanding His Kingdom: Exalting Jesus.</p>
            </div>
          </div>
        </section>

        <section className="main-content">
          <div className="content-grid">
            <div className="bio-content">
              <div className="bio-section">
                <p>
                  Welcome to the Voice of Kingdom Ministry(VOKIM)! We are a passionate gospel music band dedicated to sharing messages of hope, love, and faith through music that uplifts the soul. Our mission is to inspire and bring people closer to God with every note and every song.
                </p>
                <p>
                  VOKIM is borne with the prerogative of maintaining a high standard live musical performance, we aim to provide top-notch performance to churches and social events. VOKIM band provides a totally unique and exciting gospel musical experience.
                </p>
                <p>
                  Founded in May 2024, we started with a vision of using our talents to create a unique sound that blends traditional gospel roots with modern musical elements. We are united by our shared faith and love for gospel music.
                </p>

                <h2>Our Values</h2>
                <div className="values-container">
                  {values.map((value, index) => (
                    <div key={index} className="value-card">
                      <h3 className="value-title">{value.title}</h3>
                      <p className="value-description">{value.description}</p>
                    </div>
                  ))}
                </div>

                <h2>Connect with Us</h2>
                <p className="text-center">
                  Kindly contact us today to find out more and get the VOKIM Experience. Also follow us on Social Media to stay updated on our latest music, performances, and events.
                </p>

                {/* <div className="social-links">
                  {socialLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.label}
                      className="social-link"
                      style={{ color: link.color }}
                    >
                      <link.icon size={32} />
                    </a>
                  ))}
                </div> */}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;