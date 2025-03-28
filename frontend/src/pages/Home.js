import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/home.css"; // Ensure the correct path for styles
import ChatBot from "./ChatBot"; // Import the chatbot component
import { Loader } from "@googlemaps/js-api-loader";
import { Box } from "@chakra-ui/react";


const Home = () => {
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    getMapAPI();
    fetchEvents();
    checkUserLogin();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/events"); // Ensure correct API
      const data = await response.json();
      console.log("Fetched events:", data);
      
      if (Array.isArray(data.events)) {
        // Sort events by date (earliest first)
        const sortedEvents = data.events.sort((a, b) => new Date(a.date) - new Date(b.date));
        setEvents(sortedEvents);
      } else {
        setEvents([]);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const checkUserLogin = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1])); // Decode token
        setUser(decoded);
        console.log("Logged-in user:", decoded);
      } catch (error) {
        console.error("Error decoding token:", error);
        localStorage.removeItem("token"); // Remove invalid token
      }
    }
  };

  const getMapAPI = () => {
    fetch("http://localhost:5000/api/maps-key")
      .then((response) => response.json())
      .then((data) => setApiKey(data.apiKey))
      .catch((error) => console.error("Error fetching API key:", error));
  }

  // Handle Donate Now button click
  const handleDonateClick = () => {
    if (user?.userRole === "donor") {
      navigate("/donordashboard");
    } else {
      navigate("/donorlogin");
    }
  };

  return (
    <div className="main-container">
      {/* Header Section */}
      <header className="header-with-image">
        <img src="/headd.jpeg" alt="Header" style={{ width: "100%" }} />
        <div className="copy">
          <div className="overlay">
            <span className="subheading-description">Join us in Making a Difference</span>
            <button className="button-3" onClick={handleDonateClick}>
              Donate Now
            </button>
          </div>
        </div>
      </header>

      {/* About Section */}
      <section className="about-section">
      <div className="about-content">
        <h1 className="about-us">About Us</h1>
        <p className="about-p">
          Our platform connects donors with orphanages, old age homes, and similar organizations.
          We're committed to transparency and efficiency, ensuring every donation, big or small,
          makes a meaningful impact. Join us in fostering a culture of compassion and support,
          where no one is left behind. Together, let's transform lives, one donation at a time.
        </p>
      </div>
    </section>


      {/* Events Section */}
      <span className="whats-happening" color="black" >See what's happening around you</span>
      <div className="card-grid">
        {events.length > 0 ? (
          events.map((event) => {
            const eventDate = new Date(event.date);
            const isCompleted = eventDate < new Date();
  const loadMap = (mapContainer, coordinates) => {
      const loader = new Loader({
        apiKey: apiKey,
        version: "weekly",
        libraries: ["places"],
      });
  
      loader.load().then(async () => {
        // Import `google` from the loader
        const { Map, Marker } = window.google.maps;
        // const { Map } = await google.maps.importLibrary("maps");
        // const { Marker } = await google.maps.importLibrary("marker");
  
        const map = new Map(mapContainer, {
          center: { lat: coordinates[1], lng: coordinates[0] },
          zoom: 12,
        });
  
        new Marker({
          position: { lat: coordinates[1], lng: coordinates[0] },
          map,
        });
      });
    };

            return (
              <div key={event._id} className="card">
                <div className="image" style={{ backgroundImage: `url('/kidimg.jpeg')` }}></div>
                <div className="card-content">
                  <strong className="event-name">{event.name}</strong>
                  <p className="description">{event.description}</p>
                  <p className="event-date">📅 {eventDate.toLocaleDateString()}</p>
                  <p className="event-venue">📍 {event.venue}</p>
                  
                  {/* Event Status Badge */}
                  <span className={`event-status ${isCompleted ? "completed" : "upcoming"}`}>
                    {isCompleted ? "Completed" : "Upcoming"}
                  </span>
                  {event.location?.coordinates && (
                    <Box w="100%" h="300px" ref={(el) => el && loadMap(el, event.location.coordinates)}></Box>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <p className="loading">Loading events...</p>
        )}
      </div>

      <ChatBot />
    </div>
  );
};

export default Home;


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