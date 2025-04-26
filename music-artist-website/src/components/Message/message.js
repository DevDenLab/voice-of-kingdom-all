import React, { useState } from 'react';
import { Download, ExternalLink } from 'lucide-react';

const MessagesPage = () => {
  const [hoveredMessage, setHoveredMessage] = useState(null);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const videos = [
    { id: 1, title: "God's Love Message", embedId: "ccWdx6KWAxE" },
    { id: 2, title: "Strength in Faith", embedId: "ccWdx6KWAxE" },
    { id: 3, title: "Walking in Hope", embedId: "ccWdx6KWAxE" },
  ];

  const messages = [
    {
      id: 1,
      title: "God's Unfailing Love",
      verse: "Romans 5:8",
      verseText: "But God demonstrates his own love for us in this: While we were still sinners, Christ died for us.",
      message: "No matter where we are in life, God's love meets us where we are. Let this week be a reminder that His love is unending and is always there to lift us up, heal, and restore."
    },
    {
      id: 2,
      title: "Strength in the Lord",
      verse: "Psalm 28:7",
      verseText: "The Lord is my strength and my shield; my heart trusts in him, and he helps me.",
      message: "When life feels overwhelming, remember that God is your strength. Lean on Him, and He will renew your strength and guide you through every challenge."
    },
    {
      id: 3,
      title: "The Power of Faith",
      verse: "2 Corinthians 5:7",
      verseText: "For we live by faith, not by sight.",
      message: "Faith opens the door to hope and miracles. Even when the path ahead seems uncertain, walk in faith, trusting that God is guiding your steps."
    },
    {
      id: 4,
      title: "Hope in God's Promises",
      verse: "Jeremiah 29:11",
      verseText: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.",
      message: "God's promises are true and everlasting. No matter what you face, hold onto the hope that He has a beautiful future planned for you."
    }
  ];

  const handleSubscribe = async (e) => {
    e.preventDefault();
    // ... existing subscription logic remains the same
  };

  return (
    <div className="messages-page">
      <div className="hero-section-message">
        <div className="hero-overlay"></div>
        <h1>VOKIM Messages</h1>
        <p className="hero-subtitle">
          A place for inspiration, reflection, and encouragement. Here, we share powerful messages
          from the Word of God to uplift, guide, and strengthen you on your spiritual journey.
        </p>
      </div>

      <div className="messages-container">
        <div className="messages-grid">
          {messages.map((message) => (
            <div
              key={message.id}
              className="message-card"
              onMouseEnter={() => setHoveredMessage(message.id)}
              onMouseLeave={() => setHoveredMessage(null)}
            >
              <div className="card-content">
                <span className="verse-reference">{message.verse}</span>
                <h3 className="message-title">{message.title}</h3>
                <p className="verse-text">"{message.verseText}"</p>
                <p className="message-text">{message.message}</p>
              </div>
            </div>
          ))}
        </div>

        <section className="videos-section">
          <h2 className="section-title">Preachers Corner Videos</h2>
          <div className="videos-grid">
            {videos.map((video) => (
              <div key={video.id} className="video-card">
                <div className="video-container">
                  <iframe
                    className="video-iframe"
                    src={`https://www.youtube.com/embed/${video.embedId}`}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="video-title">{video.title}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="reflections-section">
          <h2 className="section-title">Reflections & Insights</h2>
          <div className="reflection-card">
            <p>
              The Gospel Hub is designed to bring meaningful reflections on God's Word. Take time to
              meditate on these messages, engage in prayer, and let the Word be a lamp unto your feet.
            </p>
          </div>
        </section>

        <section className="subscribe-section">
          <h2 className="section-title">Subscribe to Our Weekly Newsletter</h2>
          <form onSubmit={handleSubscribe} className="subscribe-form">
            <input
              type="email"
              className="subscribe-input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="subscribe-button" type="submit" disabled={isLoading}>
              {isLoading ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">You have successfully subscribed!</p>}
        </section>
      </div>
    </div>
  );
};

export default MessagesPage;