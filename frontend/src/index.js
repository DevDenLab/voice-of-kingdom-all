import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './styles/Navbar.css';
import './styles/MainContent.css';
import './styles/Music.css';
import './styles/Quote&Title.css';
import './styles/VideoCarousel.css';
import './components/About/About.css'; // Make sure to add custom styles in a separate CSS file
import './components/Contact/Contact.css'; // Make sure to add custom styles in a separate CSS file
import './components/Publication/Publication.css'; // Make sure to add custom styles in a separate CSS file
import './components/VokMusic/vok-music.css'; // Make sure to add custom styles in a separate CSS file
import './components/JoinVokim/join.css'; // Make sure to add custom styles in a separate CSS file
import './components/Donate/Donate.css'; // Make sure to add custom styles in a separate CSS file
import './components/BandBooking/BandBooking.css'; // Make sure to add custom styles in a separate CSS file
import './components/Message/message.css';
import './output.css'
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
