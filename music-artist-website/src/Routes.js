import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Contact from './components/Contact';
import Layout from './components/Layout';
import BookingForm from './components/BookingForm';
import Biography from './components/Biography';
import Music from './components/Music';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <Layout
            backgroundImage="/static/sample_artist.jpg"
            overlayText="Welcome to VOK"
            textColor="white"
          >
            <Home />
          </Layout>
        } />
        <Route path="/contactus" element={
          <Layout
            backgroundImage="/static/contactus.jpg"
            overlayText=""
            textColor="#FFD700"
          >
            <Contact />
          </Layout>
        }/>
        <Route path="/music/bookings" element={
          <Layout
            backgroundImage="/static/music_book.jpg"
            overlayText=""
            textColor="#FFD700"
          >
            <BookingForm />
          </Layout>
        }/>
        <Route path="/biography" element={
          <Layout
            backgroundImage="/static/biography.jpg"
            overlayText=""
            textColor="#FFD700"
          >
            <Biography />
          </Layout>
        }/>
        <Route path="/music" element={
          <Layout
            backgroundImage="/static/biography.jpg"
            overlayText=""
            textColor="#FFD700"
          >
            <Music />
          </Layout>
        }/>
      </Routes>
    </Router>
  );
};

export default AppRoutes;