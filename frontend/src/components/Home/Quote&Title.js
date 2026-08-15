import React from 'react';
import { Button } from 'react-bootstrap';
const QuoteCard = ({ quote, author }) => {
  return (
    <div className="card quote-card">
      <blockquote>
        <p>{quote}</p>
        <footer>- {author}</footer>
      </blockquote>
    </div>
  );
};

const InfoCard = ({ title, description,link  }) => {
  return (
    <div className="card info-card">
      <h3>{title}</h3>
      <p>{description}</p>
      <a href={link} rel="noopener noreferrer">
        <Button variant="outline-primary" className="card-button" style={{ color: '#E4A11B',borderColor: '#E4A11B' }}>More About VOKIM</Button>
      </a>
    </div>
  );
};

const Cards = () => {
  const quote = "\"All the ends of the world shall remember and turn to the LORD, and all the families of the nations shall worship before You. For the kingdom is the LORD’s, And He rules over the nations.\"";
  const author = "Psalm 22:27-28";
  const title = "Worshipping Jesus";
  const description = "VOKIM is devoted to infusing the world with the presence of God through melodies inspired by the Holy Spirit. With a deep passion for worshipping  and praising Jesus, the band strives to lead others into a closer relationship with Him through the transformative power of music.";
  const link = "/about"; // Replace with your desired URL
  return (
    <div className="cards-container" id="next-section">
      <QuoteCard quote={quote} author={author} />
      <InfoCard title={title} description={description} link={link} />
    </div>
  );
};

export default Cards;
