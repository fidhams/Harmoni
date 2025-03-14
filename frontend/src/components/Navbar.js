import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <h1>Harmoni</h1>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/donations">Donations</Link></li>
        <li><Link to="/volunteer">Volunteering</Link></li>
        <li><Link to="/impact-stories">Impact Stories</Link></li>
        <li><Link to="/contact">Contact</Link></li>
        <li><Link to="/donorlogin">Login</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
