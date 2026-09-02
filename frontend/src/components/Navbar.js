import React, { useState, useEffect } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('');
  const [showFullScreenMenu, setShowFullScreenMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const menuItems = [
    { name: 'Home', link: '/', id: 'home' },
    { name: 'About Us', link: '/about', id: 'about' },
    { name: 'Our Music', link: '/music', id: 'music' },
    { name: 'JOIN Vokim', link: '/join', id: 'join' },
    { name: 'Bookings', link: '/band-book', id: 'band-book' },
    { name: 'Gallery', link: '/gallery', id: 'gallery' }, // New Gallery item
    { name: 'Contact Us', link: '/contact', id: 'contact' },
    { name: 'Donate', link: '/donate', id: 'donate' },
  ];

  const dropdownItems = [
    { name: 'Messages', link: '/message', id: 'message' },
    { name: 'Publication', link: '/publication', id: 'publication' },
  ];

  const socialLinks = [
    { name: 'Apple', link: '#', id: 'apple' },
    { name: 'Spotify', link: '#', id: 'spotify' },
    { name: 'Instagram', link: 'https://www.instagram.com/vokim_ministries/', id: 'instagram' },
    { name: 'Twitter', link: '#', id: 'twitter' },
  ];

  useEffect(() => {
    const currentPath = window.location.pathname;
    const currentId = currentPath === '/' ? 'home' : currentPath.substring(1);
    setActiveLink(currentId);

    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 992);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const handleNavClick = (link) => {
    setActiveLink(link);
    setShowFullScreenMenu(false);
    setIsOpen(false);
  };

  const toggleFullScreenMenu = () => {
    setShowFullScreenMenu(!showFullScreenMenu);
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark">
      <div className="container">
        <a className="navbar-brand" href="/">
          <img src="/static/logo_new.png" alt="logo" />
        </a>

        {/* Main Desktop Nav Links */}
        <ul className="navbar-nav d-none d-lg-flex ms-auto align-items-center">
          {menuItems.map((item, index) => (
            <li key={index} className="nav-item">
              <a
                className={`nav-link ${activeLink === item.id ? 'active' : ''}`}
                href={item.link}
                onClick={() => handleNavClick(item.id)}
              >
                {item.name}
              </a>
            </li>
          ))}
          {/* Dropdown for Publication and Messages */}
          <li className="nav-item dropdown">
            <a
              className={`nav-link dropdown-toggle ${dropdownItems.some((item) => activeLink === item.id) ? 'active' : ''}`}
              href="#"
              id="dropdownMenu"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              More
            </a>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenu">
              {dropdownItems.map((item, index) => (
                <li key={index}>
                  <a
                    className={`dropdown-item ${activeLink === item.id ? 'active' : ''}`}
                    href={item.link}
                    onClick={() => handleNavClick(item.id)}
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </li>
        </ul>

        {/* Hamburger Menu Button */}
        <button
          className={`navbar-toggler ${showFullScreenMenu ? 'is-active' : ''}`}
          type="button"
          onClick={toggleFullScreenMenu}
          aria-controls="navbarNav"
          aria-expanded={showFullScreenMenu}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
      </div>

      {/* Full-screen menu overlay */}
      {showFullScreenMenu && (
        <div className="full-screen-menu">
          <ul className="menu-list">
            {menuItems.map((item, index) => (
              <li key={`menu-${index}`} className="menu-item">
                <a
                  className={`nav-link ${activeLink === item.id ? 'active' : ''}`}
                  href={item.link}
                  onClick={() => handleNavClick(item.id)}
                >
                  {item.name}
                </a>
              </li>
            ))}
            <li className="menu-item">
              <hr className="white-line" />
            </li>
            {dropdownItems.map((item, index) => (
              <li key={`dropdown-${index}`} className="menu-item">
                <a
                  className={`nav-link ${activeLink === item.id ? 'active' : ''}`}
                  href={item.link}
                  onClick={() => handleNavClick(item.id)}
                >
                  {item.name}
                </a>
              </li>
            ))}
            <li className="menu-item">
              <hr className="white-line" />
            </li>
            {socialLinks.map((item, index) => (
              <li key={`social-${index}`} className="menu-item">
                <a
                  className={`nav-link ${activeLink === item.name.toLowerCase() ? 'active' : ''}`}
                  href={item.link}
                  onClick={() => handleNavClick(item.name.toLowerCase())}
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;