import React, { useState, useEffect, useRef } from "react";
// import { useNavigate } from 'react-router-dom';
import "../ReadMoreLink.css"; // Import the CSS file here
import "./VideoSection.css";

const VideoSection = () => {
  const scrollContainerRef = useRef(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);
  // const navigate = useNavigate();

  // Extract YouTube video ID from URL
  const getYouTubeId = (url) => {
    const urlParams = new URL(url);
    if (urlParams.hostname === "youtu.be") {
      return urlParams.pathname.slice(1);
    }
    return urlParams.searchParams.get("v");
  };

  // Create YouTube embed URL
  const getEmbedUrl = (url) => {
    try {
      const videoId = getYouTubeId(url);
      return `https://www.youtube.com/embed/${videoId}`;
    } catch (error) {
      console.error("Invalid YouTube URL:", url);
      return "";
    }
  };

  const videos = [
    {
      id: 1,
      url: "https://www.youtube.com/watch?v=cleQjLtKNGM",
      description: "Main video 1 we goo",
    },
    {
      id: 2,
      url: "https://www.youtube.com/watch?v=cleQjLtKNGM",
      description: "Main video 1 we goo",
    },
    {
      id: 3,
      url: "https://www.youtube.com/watch?v=cleQjLtKNGM",
      description: "Main video 2 we goo",
    },
    {
      id: 4,
      url: "https://www.youtube.com/watch?v=cleQjLtKNGM",
      description: "Main video 3 we goo",
    },
    {
      id: 5,
      url: "https://www.youtube.com/watch?v=cleQjLtKNGM",
      description: "Main video 4 we goo",
    },
  ];

  // Check scroll position to show/hide buttons
  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setShowLeftButton(scrollLeft > 0);
      setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10); // 10px threshold
    }
  };

  useEffect(() => {
    checkScrollButtons();
    // Add resize listener
    window.addEventListener("resize", checkScrollButtons);
    return () => window.removeEventListener("resize", checkScrollButtons);
  }, []);

  // Scroll handlers
  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300; // Adjust scroll amount as needed
      const newScrollPosition =
        scrollContainerRef.current.scrollLeft +
        (direction === "left" ? -scrollAmount : scrollAmount);

      scrollContainerRef.current.scrollTo({
        left: newScrollPosition,
        behavior: "smooth",
      });

      // Update button visibility after scroll
      setTimeout(checkScrollButtons, 100);
    }
  };
  const handleButtonClick = () => {
    // navigate('/more-content'); // Change this to the desired route
    window.location.href = "https://www.spotify.com/";
  };

  if (!videos || videos.length === 0) {
    return <div className="video-scroll-container">No videos available</div>;
  }

  return (
    <div className="cover">
      <h1>Watch Performances</h1>
      <div className="video-scroll-outer">
        {showLeftButton && (
          <button
            className="scroll-button scroll-left"
            onClick={() => scroll("left")}
            aria-label="Scroll left"
          >
            ←
          </button>
        )}

        <div
          className="video-scroll-container"
          ref={scrollContainerRef}
          onScroll={checkScrollButtons}
        >
          {videos.map((video, index) => (
            <div key={index} className="video-card">
              <div className="video-wrapper">
                <iframe
                  className="video-player"
                  src={getEmbedUrl(video.url)}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          ))}
        </div>

        {showRightButton && (
          <button
            className="scroll-button scroll-right"
            onClick={() => scroll("right")}
            aria-label="Scroll right"
          >
            →
          </button>
        )}
      </div>
      {/* Add the button below */}
      <button className="watch-more-button" onClick={handleButtonClick}>
        Watch More Performances &rarr;
      </button>
    </div>
  );
};

export default VideoSection;
