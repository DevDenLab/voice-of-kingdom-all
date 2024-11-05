import React from "react";
import "./Home.css";
// import Navbar from './Navbar';
import ArtistSection from "../../components/ArtistSection/ArtistSection";
import VideoSection from "../../components/VideoSection/VideoSection";
import SpotifySection from "../../components/SpotifySection";
import PhotoGallery from "../../components/PhotoGallery";
import MapSection from "../../components/MapSection";
import NavB from "../../components/Navbar/NavB";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
const Home = () => {
  return (
    <div className="">
      <header className="Landing-header">
        <NavB />
        <div className="landing-txt">
          <h1>Welcome to VOICE OF THE KINGDOM</h1>
          <p>
            lurpem esoume rtect tuefiv efwufy y fdcdhv 8f ifvno v vvoid v08 rd
            svhp fvb 9 nvh 0erh ov 0 reg voehv 0e nvehb evne0he bnebeibh08{" "}
          </p>
        </div>
      </header>
      <div className="cont">
        <ArtistSection />
        <VideoSection />
        {/* <SpotifySection /> */}
        {/* <PhotoGallery /> */}
        {/* <MapSection /> */}
      </div>
      <Footer />
    </div>
  );
};

export default Home;
