import React from "react";
import "../css/componentcss/Navbar.css";
import Navbar from 'react-bootstrap/Navbar';


const TopNavbar = () => {
  

  return (
    <Navbar className="navbar">
      <div className="navbar-left">
        <Navbar.Brand href="/" className="logo">
          AITS
        </Navbar.Brand>
      </div>
     
    </Navbar>
  );
};

export default TopNavbar;
