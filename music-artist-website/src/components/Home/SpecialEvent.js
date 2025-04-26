import React from 'react';

const styles = {
  heroContainer: {
    position: 'relative',
    width: '100vw',
    marginLeft: 'calc(-50vw + 50%)',
    marginRight: 'calc(-50vw + 50%)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  
  backgroundContainer: {
    width: '100%',
    maxHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  
  image: {
    width: '100%',
    height: 'auto',
    objectFit: 'contain',
    maxHeight: '100vh',
    display: 'block',
  },
  
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  
  contentContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end', // Changed to flex-end to align to bottom
    alignItems: 'center',
    padding: '20px',
  },
  
  buttonWrapper: {
    position: 'relative',
    marginTop: '10px', // Adds 10 pixels of space above the button
    // OR
    top: '17px', // Moves the button 10 pixels down from its original position
  },
  
  button: {
    display: 'inline-block',
    padding: '1px 24px',
    border: '1px solid orange',
    color: 'white',
    fontSize: '1.125rem',
    fontWeight: '500',
    letterSpacing: '0.05em',
    cursor: 'pointer',
    backgroundColor: 'transparent',
    transition: 'all 0.3s ease',
    textTransform: 'uppercase',
    borderColor: '#E4A11B',
    color: '#E4A11B'
  },
};

const HeroSection = ({ 
  buttonText = "VOKIM Launch RSVP",
  imageUrl = "static/new_poster.jpg"
}) => {
  return (
    <div style={styles.heroContainer}>
      <div style={styles.backgroundContainer}>
        <img 
          src={imageUrl} 
          alt="VOKIM Gospel Band"
          style={styles.image}
        />
        <div style={styles.overlay} />
        <div style={styles.contentContainer}>
          <div style={styles.buttonWrapper}>
            <a 
              href='https://www.eventbrite.com/e/vokim-band-launching-african-praise-tickets-1222527174689?aff=oddtdtcreator'
              target="_blank"
              rel="noopener noreferrer"
            >
              <button 
                style={styles.button}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = 'white';
                  e.target.style.color = '#4C1D95';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = 'white';
                }}
              >
                {buttonText}
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;