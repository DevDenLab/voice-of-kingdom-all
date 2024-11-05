import React, { useState } from "react";
import { Typography, Button, Box, TextField, IconButton } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import axios from "axios"; // or use fetch if you prefer
import "./Footer.css";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Email validation function
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      // Example API request to subscribe
      const response = await axios.post("/api/subscribe/", { email }); // Change to the correct API endpoint

      if (response.status === 201) {
        setSuccessMessage("Subscribed!");
        setEmail(""); // Clear the email field after success
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch (err) {
      setError("Failed to subscribe. Please try again later.");
    }
  };

  return (
    <div className="footer-cont">
      {/* Contact Info Section */}
      <h1 className="footer-header">Stay Connected</h1>
      <div className="f-info">
        {/* Subscription Form */}
        <div className="form" onSubmit={handleSubscribe}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
          />
          <Button type="submit">Subscribe</Button>
        </div>

        {/* Contact Information */}
        <div className="contact">
          <div>Contact Info:</div>
          <div>
            Email:{" "}
            <a href="mailto:john.doe@example.com">john.doe@example.com</a>
          </div>

          <div>
            Phone: <a href="tel:+1234567890">+1 (234) 567-890</a>
          </div>

          <div>
            Address:{" "}
            <a href="https://www.google.com/maps/place/Edmonton,+AB">
              123 abc street, NW, Edmonton, Canada
            </a>
          </div>
        </div>
      </div>

      {/* Social Media Icons */}
      <div className="icon-cont">
        <IconButton href="https://facebook.com" target="_blank" color="inherit">
          <FacebookIcon />
        </IconButton>
        <IconButton href="https://twitter.com" target="_blank" color="inherit">
          <TwitterIcon />
        </IconButton>
        <IconButton
          href="https://instagram.com"
          target="_blank"
          color="inherit"
        >
          <InstagramIcon />
        </IconButton>
      </div>
      {/* Footer Text */}
      <div>© 2024 Voice Of Kingdom. All rights reserved.</div>
    </div>
  );
};

export default Footer;

// {/* Error or Success Messages */}
// {error && <Typography sx={{ color: "red" }}>{error}</Typography>}
// {successMessage && (
//   <Typography sx={{ color: "green" }}>{successMessage}</Typography>
// )}
