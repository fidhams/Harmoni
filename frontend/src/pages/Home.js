import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/home.css"; // Ensure the correct path for styles

const Home = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000") // Correct API endpoint
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched data:", data); // Debugging
        setEvents(data.events || []); // Ensure it's always an array
      })
      .catch((error) => console.error("Error fetching events:", error));
  }, []);

  return (
    <div className="main-container">
      {/* Header Section */}
      <header className="header-with-image">
        <img src="/headd.jpeg" alt="Header" style={{ width: "100%" }} />
        <div className="copy">
          <div className="overlay">
            <span className="subheading-description">Join us in Making a Difference</span>
            <button className="button-3">
              <Link to="/signup" className="donate-now">Donate Now</Link>
            </button>
          </div>
        </div>
      </header>

      {/* Events Section */}
      <span className="whats-happening">See what's happening around you</span>
      <div className="card-grid">
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event._id} className="card">
              <div className="image" style={{ backgroundImage: `url('/kidimg.jpeg')` }}></div>
              <div className="card-content">
                <strong className="event-name">{event.name}</strong>
                <p className="description">{event.description}</p>
                <p className="event-date">📅 {event.date}</p>
                <p className="event-venue">📍 {event.venue}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="loading">Loading events...</p>
        )}
      </div>

      {/* About Section */}
      {/* <section className="about-section">
        <div className="about-content">
          <h2 className="holding-hands">Holding Hands</h2>
          <p>
            Our platform connects donors with orphanages, old age homes, and similar organizations.
            We're committed to transparency and efficiency, ensuring every donation, big or small,
            makes a meaningful impact. Join us in fostering a culture of compassion and support,
            where no one is left behind. Together, let's transform lives, one donation at a time.
          </p>
        </div>
        <img src="/foott.jpeg" alt="Holding Hands" />
      </section> */}

      
    </div>
  );
};

export default Home;
