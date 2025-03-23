import React, { useEffect, useState, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import "../styles/contactus.css"; // Ensure correct path for CSS

const mapContainerStyle = {
  width: "100%",
  height: "200px",
};

const ApprovedDonees = () => {
  const [donees, setDonees] = useState([]);
  const mapRefs = useRef({}); // Store map instances for multiple donees

  useEffect(() => {
    fetch("http://localhost:5000/api/approved-donees") // Replace with your Express API URL
      .then((response) => response.json())
      .then((data) => setDonees(data))
      .catch((error) => console.error("Error fetching approved donees:", error));
  }, []);

  useEffect(() => {
    const loader = new Loader({
      apiKey: "AIzaSyC3P0yKTLQS0_eQOj74g7N0co-daEwBKVY",
      version: "weekly",
    });

    loader.load().then(() => {
      donees.forEach((donee, index) => {
        if (donee.location?.coordinates) {
          const [lng, lat] = donee.location.coordinates;
          if (mapRefs.current[index]) {
            // Import `google` from the loader
            const { Map, Marker } = window.google.maps;

            const map = new Map(mapRefs.current[index], {
              center: { lat, lng },
              zoom: 12,
            });

            new Marker({
              position: { lat, lng },
              map: map,
            });
          }
        }
      });
    });
  }, [donees]);

  return (
    <div className="main-container">
      <header className="header">
        <h1>Approved Donees</h1>
      </header>
      <div className="card-list">
        {donees.map((donee, index) => (
          <div key={index} className="card">
            <div className="card-header">
              <h2>{donee.name}</h2>
              <p>{donee.email}</p>
            </div>
            <div className="card-body">
              <p>Phone: {donee.phone}</p>
              <p>Address: {donee.address}</p>
              <p>Details: {donee.description}</p>

              {/* Google Map (if location is available) */}
              {donee.location?.coordinates ? (
                <div
                  ref={(el) => (mapRefs.current[index] = el)}
                  style={mapContainerStyle}
                />
              ) : (
                <p style={{ color: "gray" }}>Location not available</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApprovedDonees;
