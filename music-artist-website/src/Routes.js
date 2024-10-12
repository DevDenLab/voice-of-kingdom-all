import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import"./App.css";
import Home from "./Pages/Landing/Home";
import Contact from "./components/Contact";
import Layout from "./components/Layout/Layout";
import BookingForm from "./components/BookingForm";
import Biography from "./components/Biography";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Home />
            // <Layout
            //   backgroundImage="/static/contactus.jpg"
            //   overlayText=""
            //   textColor="#FFD700"
            // >
              
            // </Layout>
           
          }
        />
        <Route
          path="/contactus"
          element={
            <Layout
              backgroundImage="/static/contactus.jpg"
              overlayText=""
              textColor="#FFD700"
            >
              <Contact />
            </Layout>
          }
        />
        <Route
          path="/music/bookings"
          element={
            <Layout
              backgroundImage="/static/music_book.jpg"
              overlayText=""
              textColor="#FFD700"
            >
              <BookingForm />
            </Layout>
          }
        />
        <Route
          path="/biography"
          element={
            <Layout
              backgroundImage="/static/biography.jpg"
              overlayText=""
              textColor="#FFD700"
            >
              <Biography />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
