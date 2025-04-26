import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/HomeLayout';
import AboutUs from './components/About/About';
import ContactLayout from './components/ContactLayout';
import PublicationsLayout from './components/PublicationLayout';
import MusicLayout from './components/MusicLayout';
import JoinLayout from './components/JoinLayout';
import DonateLayout from './components/DonateLayout';
import BandBookingLayout from './components/BandBookingLayout';
import MessageLayout from './components/MessageLayout';
import GalleryLayout from './components/GalleryLayout';

const AppRoutes = () => {
  return (
    <Router basename="/">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactLayout />} />
        <Route path="/publication" element={<PublicationsLayout />} />
        <Route path="/music" element={<MusicLayout />} />
        <Route path="/join" element={<JoinLayout />} />
        <Route path="/gallery" element={<GalleryLayout />} />
        <Route path="/donate" element={<DonateLayout />} />
        <Route path="/band-book" element={<BandBookingLayout />} />
        <Route path="/message" element={<MessageLayout />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
};

export default AppRoutes;