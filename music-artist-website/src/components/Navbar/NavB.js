import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";

const NavB = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className="nav">
      <div className="desktop-nav">
        <ul className="nav-text">
          <div className="navLeft">
            <li>
              {" "}
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/biography">About</Link>{" "}
            </li>
            <li>Home</li>
          </div>
          <div className="navMid">
            <li className="logo">
              <img src="/static/favicon.jpg" alt="VOKIM" />
            </li>
          </div>
          <div className="navRight">
            <li>Home</li>
            <li>Home</li>
            <li>Home</li>
          </div>
        </ul>
      </div>

      {/* DRAWER NAV BAR */}

      <div className="mobile-nav">
        <div className="mobile-left">
          <img src="/static/favicon.jpg" alt="VOKIM" />
        </div>
        <div className="mobile-right">
          <button onClick={toggleDrawer} className="menu-btn">
            <FontAwesomeIcon className="drawer" icon={faBars} />
            {/* {isOpen ? "Close" : "Open"} */}
          </button>

          {isOpen && (
            <>
              <div className="side-drawer">
                <ul className="">
                  <li>
                    <Link to="/">Home</Link>
                  </li>
                  <li>
                    <Link to="/biography">About</Link>
                  </li>
                  <li>Home</li>
                  <li>Home</li>
                  <li>Home</li>
                  <li>Home</li>
                </ul>
              </div>
              <div className="overlay" onClick={toggleDrawer}>
                <FontAwesomeIcon className="drawer" icon={faXmark} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavB;
