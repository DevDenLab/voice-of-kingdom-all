import React from 'react';
import { Container } from 'react-bootstrap';

const JoinMainContent = ({ imageUrl }) => {
  return (
    <Container fluid className="join-container">
      <figure>
        <img className="bg-img-join img-fluid" src={imageUrl} alt="Bg image1" />
      </figure>
    </Container>
  );
};

export default JoinMainContent;
