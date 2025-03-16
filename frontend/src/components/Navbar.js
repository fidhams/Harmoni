import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";


function Navbar() {
  const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole");
  const isLoggedIn = localStorage.getItem("token") !== null;
  console.log("userRole",userRole);
  console.log("token:",localStorage.getItem("token"));
  const isAdmin = localStorage.getItem("adminToken") != null;

  // Function to get the correct dashboard route
  const getDashboardRoute = () => {
    if (userRole === "donor") return "/donordashboard";
    if (userRole === "donee") return "/doneedashboard";
    if (userRole === "admin") return "/admin";
    return "/";
  };

  // Function to handle logout
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    window.location.reload(); // Ensure UI updates
  };

  return (
    <nav className="navbar">
      <h1>Harmoni</h1>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/donations">Donations</Link></li>
        <li><Link to="/volunteer">Volunteer</Link></li>
        <li><Link to="/impact-stories">Impact Stories</Link></li>
        <li><Link to="/contact">Contact</Link></li>

        {(isLoggedIn || isAdmin ) ? (
          <>
            <li><Link to={getDashboardRoute()}>Dashboard</Link></li>
            <li><Link to="/" onClick={handleLogout}>Logout</Link></li>
          </>
        ) : (
          <li><Link to="/donorlogin">Login</Link></li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
