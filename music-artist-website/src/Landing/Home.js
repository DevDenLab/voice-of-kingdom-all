import React from "react";
// import Navbar from './Navbar';
import ArtistSection from "../../components/ArtistSection";
import VideoSection from "../../components/VideoSection";
import SpotifySection from "../../components/SpotifySection";
import PhotoGallery from "../../components/PhotoGallery";
import MapSection from "../../components/MapSection";

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
