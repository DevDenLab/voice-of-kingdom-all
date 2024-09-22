import React from 'react';
// import Navbar from './Navbar';
import ArtistSection from './ArtistSection';
import VideoSection from './VideoSection';
import SpotifySection from './SpotifySection';
import PhotoGallery from './PhotoGallery';
import MapSection from './MapSection';

const Home = () => {
  return (
    <>
      {/* <Navbar /> */}
      <ArtistSection />
      <VideoSection />
      <SpotifySection />
      <PhotoGallery />
      <MapSection />
    </>
  );
};

export default Home;
