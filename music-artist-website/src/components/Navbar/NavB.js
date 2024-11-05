import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";

const NavB = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  // Use effect to control body scroll when the drawer is open
  useEffect(() => {
    if (isOpen) {
      // Disable background scroll when the drawer is open
      document.body.style.overflow = "hidden";
    } else {
      // Re-enable scroll when the drawer is closed
      document.body.style.overflow = "auto";
    }

    // Clean up the effect on component unmount
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    <div className="nav">
      <div className="desktop-nav">
        <ul className="nav-text">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/biography">About</Link>{" "}
          </li>
          <li>Music</li>
          <li>Ministry</li>
          <li>Blog</li>
          <li>
            <Link to="/contactus">Contact</Link>
          </li>
          <li className="noHover">
            <img src="/static/favicon.jpg" alt="VOKIM" className="logo" />
          </li>
          <li>Home</li>
          <li>Home</li>
          <li>Home</li>
          <li>Home</li>
          <li>Home</li>
          <li>Home</li>
        </ul>
      </div>

      {/* DRAWER NAV BAR */}

      <div className="mobile-nav">
        <div className="mobile-left">
          <img src="/static/favicon.jpg" alt="VOKIM" className="logo2" />
        </div>
        <div className={`${!isOpen ? "isclosed" : "mobile-right"}`}>
          <button onClick={toggleDrawer}>
            {isOpen ? (
              <FontAwesomeIcon className="menu-btn drawer" icon={faXmark} />
            ) : (
              <FontAwesomeIcon className="drawer" icon={faBars} />
            )}
          </button>
          <ul className="navTxt">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/biography">About</Link>
            </li>
            <li>Music</li>
            <li>Ministry</li>
            <li>Blog</li>
            <li>
              <Link to="/contactus">Contact</Link>
            </li>
          </ul>

          {/* <div className="overlay" onClick={toggleDrawer}>
                <FontAwesomeIcon className="drawer" icon={faXmark} />
              </div> */}
        </div>
      </div>
    </div>
  );
};

export default NavB;
