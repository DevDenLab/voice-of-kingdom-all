import React from 'react';
import { Container } from 'react-bootstrap';

const BandBookingMainContent = ({ imageUrl }) => {
  return (
    <Container>
      <figure>
        <img className="bg-img img-fluid" src={imageUrl} alt="Bg image1" />
      </figure>
    </Container>
  );
};

export default BandBookingMainContent;
