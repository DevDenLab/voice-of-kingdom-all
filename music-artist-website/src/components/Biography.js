import React from 'react';
import './Biography.css';
import DropCap from './DropCap';
const Biography = () => {
  return (
    <div className="biography-container">
      <header className="biography-header">
        <h1>John Doe</h1>
        <h2>Author & Speaker</h2>
      </header>
      <div className="biography-content">
        {/* <img src="biography.jpg" alt="John Doe" className="profile-image" /> */}
        <div className="bio-text">
          <DropCap>
            John Doe is a renowned author and speaker, known for his engaging storytelling and deep insights into the human experience. With over a decade of experience in the industry, John has captivated audiences around the world with his unique approach to personal development and growth.
          </DropCap>
          <p>
            He has published several bestselling books, including "The Journey Within" and "Unlocking Potential." His work has been featured in numerous publications, and he is a sought-after speaker at conferences and events.
          </p>
          <p>
            In addition to his writing and speaking engagements, John is passionate about mentoring young writers and helping them find their voice. He believes in the power of storytelling to inspire and connect people.
          </p>
        </div>
      </div>
      <footer className="biography-footer">
        <p>Connect with John: <a href="mailto:john.doe@example.com">john.doe@example.com</a></p>
      </footer>
    </div>
  );
};

export default Biography;
