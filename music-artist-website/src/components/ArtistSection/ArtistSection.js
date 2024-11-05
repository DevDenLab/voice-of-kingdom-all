import React from "react";
import { useNavigate } from "react-router-dom";
import "./artistSection.css";

const ArtistSection = () => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate("/biography"); // Change this to the desired route
  };

  return (
    <div className="artistSec grid grid-cols-2">
      <div className="image">
        <img className="" src="/static/sample_artist.jpg" alt="" />
      </div>

      <div className="text">
        <h1>Who is Sarah Akintunde?</h1>
        <p>
          Discover the enchanting world of Sarah Akintunde, an extraordinary
          Nigerian gospel artist whose voice transcends borders and captivates
          hearts. With a divine gift for weaving soulful melodies and heartfelt
          lyrics, Sarah's music is a powerful vessel that connects listeners to
          the divine. Her passion for worship and relentless pursuit of
          excellence have earned her global recognition and multiple accolades.
          Dive deeper into her remarkable journey, from humble beginnings to
          becoming a beacon of inspiration in the gospel music industry.
          <span>
            <button className="watch-more-button" onClick={handleButtonClick}>
              Read more &rarr;
            </button>
          </span>
        </p>
      </div>
    </div>
  );
};

export default ArtistSection;
