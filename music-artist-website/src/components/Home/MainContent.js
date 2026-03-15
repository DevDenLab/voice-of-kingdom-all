import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

const MainContent = ({ imageUrl }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Set the target date to March 15th of the current year
    const calculateTimeLeft = () => {
      const targetDate = new Date('2026-06-27T00:00:00');
      const now = new Date();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft({
          days,
          hours,
          minutes,
          seconds
        });
      } else {
        // If the date has passed
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        });
      }
    };

    // Calculate time left immediately
    calculateTimeLeft();
    
    // Update the countdown every second
    const timer = setInterval(() => {
      calculateTimeLeft();
    }, 1000);

    // Clear the interval when the component unmounts
    return () => clearInterval(timer);
  }, []);

  const scrollToNextSection = () => {
    const nextSection = document.getElementById('next-section');
    if (nextSection) {
      const offset = 100;
      const position = nextSection.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({
        top: position,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="home-page">
      <div className="hero-section-home" style={{ '--bg-image': `url(${imageUrl})` }}>
        <div className="hero-overlay-home"></div>
        <div className="hero-content">
          <div className="countdown-container">
            <div className="countdown-title">EVENT STARTS IN</div>
            <div className="countdown-timer">
              <div className="countdown-item">
                <div className="countdown-value">{timeLeft.days}</div>
                <div className="countdown-label">Days</div>
              </div>
              <div className="countdown-item">
                <div className="countdown-value">{timeLeft.hours}</div>
                <div className="countdown-label">Hours</div>
              </div>
              <div className="countdown-item">
                <div className="countdown-value">{timeLeft.minutes}</div>
                <div className="countdown-label">Min</div>
              </div>
              <div className="countdown-item">
                <div className="countdown-value">{timeLeft.seconds}</div>
                <div className="countdown-label">Sec</div>
              </div>
            </div>
          </div>
          <div className="content-wrapper-home">
            <h1 className="main-title">RAISING VOICES</h1>
            <h1 className="main-title">EXPANDING HIS KINGDOM: EXALTING JESUS</h1>
            <p className="hero-text">
              VOKIM is a gospel band dedicated to spreading the gospel through heartfelt worship 
              and praise, responding to God's movement across the earth in these transformative times.
            </p>
          </div>
        </div>
        <FontAwesomeIcon
          icon={faChevronDown}
          className="scroll-indicator"
          onClick={scrollToNextSection}
        />
      </div>
    </div>
  );
};

export default MainContent;