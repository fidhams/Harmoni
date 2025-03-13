import React from "react";
import "../styles/HomePage.css"; // Import the CSS file
import Carousel from "react-bootstrap/Carousel";
import "bootstrap/dist/css/bootstrap.min.css";
import ppt4 from "./ppt4.jpg";
import ppt6 from "./ppt6.jpg";
import ppt5 from "./ppt5.jpg";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  return (
    <div className="homepage">
      {/* Navbar */}
      <header className="navbar">
        <div className="container d-flex justify-content-between align-items-center">
          <h1 className="logo">Holding Hands</h1>
          <nav className="nav-links">
            <a href="#home" className="nav-link">Home</a>
            <a href="#about" className="nav-link">About Us</a>
            <a href="#contact" className="nav-link">Contact Us</a>
            <button className="btn btn-primary login-btn" onClick={() => navigate("/register")}>
              Login/Sign up
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-image">
          <div className="hero-overlay">
            <h2>Holding Hands</h2>
            <p>Join us in Making a Difference</p>
            <button className="btn btn-danger mt-3">Donate now</button>
          </div>
        </div>
      </section>

      {/* Impact Stories Section */}
      <section className="impact-stories">
        <h2 className="text-center section-title">Impact Stories</h2>
        <Carousel>
          <Carousel.Item>
            <img className="d-block w-100" src={ppt6} alt="First slide" />
            <Carousel.Caption>
              <h3>Story 1</h3>
              <p>A short description of the first impact story.</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img className="d-block w-100" src={ppt5} alt="Second slide" />
            <Carousel.Caption>
              <h3>Story 2</h3>
              <p>A short description of the second impact story.</p>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
      </section>

      {/* About Us Section */}
      <section className="about-us">
        <div className="about-image">
          <div className="about-overlay">
            <h2>Holding Hands</h2>
            <p>
              Our platform connects donors with orphanages, old age homes, and similar organizations.
              We're committed to transparency and efficiency, ensuring every donation, big or small, 
              makes a meaningful impact. Join us in fostering a culture of compassion and support, 
              where no one is left behind.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>Holding Hands</p>
        <p>Kasaragod, Kerala, India</p>
        <p>projectholdinghands@gmail.com</p>
      </footer>
    </div>
  );
};

export default HomePage;