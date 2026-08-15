import React, { useEffect } from 'react';
import Navbar from './components/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import AppRoutes from './Routes';
import Footer from './components/Footer';
import './App.css';  // Make sure to create this CSS file
import { preloadGalleryImages } from './components/Gallery/Gallery';

const App = () => {
  useEffect(() => {
    // Start preloading gallery images as soon as the app loads
    preloadGalleryImages();
  }, []);

  return (
    <div className="app-wrapper">
      <Navbar />
      <div className="content-wrapper">
        <AppRoutes />
      </div>
      <Footer />
    </div>
  );
};

export default App;