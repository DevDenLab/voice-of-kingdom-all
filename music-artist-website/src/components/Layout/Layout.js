// Layout.js
import React from "react";
import Navbar from "../Navbar/Navbar";
import NavB from "../Navbar/NavB";
import Footer from "../Footer";

const Layout = ({ children, backgroundImage, overlayText, textColor }) => {
  return (
    <div>
      <NavB/>
      {/* <Navbar
        backgroundImage={backgroundImage}
        overlayText={overlayText}
        textColor={textColor}
      /> */}
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
