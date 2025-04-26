import React from 'react';

const DonationPage = () => {
  return (
    <div className="donation-container">
      <div className="donation-wrapper">
        {/* Header */}
        <header className="donation-header">
          <h1 className="donation-title">Support VOKIM – Donate</h1>
        </header>

        <div className="donation-card-container">
          {/* Mission Statement */}
          <div className="donation-card">
            <p className="donation-paragraph">
              In this section of the website, you are able to give generously towards transforming lives. 
              You will be making an eternal difference in souls through your giving. 
              Your gift will support the ministry in fulfilling God's mandate.
            </p>
          </div>

          {/* Bible Verse */}
          <div className="donation-card quote-card-donate">
            <p className="donation-paragraph quote-paragraph">
              "Each of you should give what you have decided in your heart to give, 
              not reluctantly or under compulsion, for God loves a cheerful giver."
            </p>
            <p className="citation">— 2 Corinthians 9:7</p>
          </div>

          {/* Partnership Benefits */}
          <div className="donation-card">
            <h2 className="card-subtitle">Partnership Benefits</h2>
            <p className="donation-paragraph">
              When you partner with VOKIM, you are scheduling a series of joy and blessings 
              your way because you are bringing joy and hope into several lives.
              We cherish your continued partnership!
            </p>
          </div>

          {/* Contact Information */}
          <div className="donation-card blue-card">
            <h2 className="card-subtitle">Mail Your Gift</h2>
            <p className="donation-paragraph">Please e-transfer your gift to:</p>
            <div className="mail-section">
            <p style={{
  fontSize: '24px', 
  color: 'white', 
  fontWeight: 'bold', 
  // textShadow: '0 0 10px rgba(255, 255, 255, 0.7)',
  letterSpacing: '1px'
}}>info@vokim.ca</p>
            </div>
          </div>

          {/* Biblical Promise */}
          <div className="donation-card gradient-card">
            <p className="donation-paragraph">
              You are a favored partner. God who called you to support this ministry 
              has ordained that all things will work for good for you according to His purpose.
              <span style={{fontWeight: 'bold'}}> — Romans 8:28</span>
            </p>
          </div>

          {/* Thank You Message */}
          <div className="donation-card">
            <p className="donation-paragraph thank-you-paragraph">
              Please accept our personal, heartfelt thanks for your gift donation 
              that will impact many lives all around the world as the Gospel music 
              is spread throughout all nations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationPage;