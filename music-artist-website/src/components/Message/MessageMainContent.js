import React from 'react';
import { Container } from 'react-bootstrap';

const MessageMainContent = ({ imageUrl }) => {
  return (
    <Container fluid className="message-container">
      <figure>
        <img className="bg-img-message img-fluid" src={imageUrl} alt="Bg image1" />
        <figcaption className="figcaption-message">
        Welcome to Vokim Messages
          <p className="subtext-album">A place for inspiration, reflection, and encouragement. Here, we share powerful messages
          from the Word of God to uplift, guide, and strengthen you on your spiritual journey.</p>
        </figcaption>
      </figure>
    </Container>
  );
};

export default MessageMainContent;
