import React, { useEffect, useState } from "react";
import "../styles/orghome.css";

const DoneeDashboard = () => {
  const [donee, setDonee] = useState({});
  const [events, setEvents] = useState([]);
  const [needs, setNeeds] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/orghome");
        const data = await response.json();
        setDonee(data.donee);
        setEvents(data.events);
        setNeeds(data.needs);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="main-container">
      <div className="navigation">
        <span className="holding-hands">Holding Hands</span>
        <div className="items">
          <a href="/viewd/" className="button">View</a>
          <a href="/" className="button">Logout</a>
        </div>
      </div>
      <div className="content">
        <div className="flex-row">
          <div className="image-container">
            <img className="image" src="/static/kidimg.jpeg" alt="Profile" />
          </div>
          <div className="regroup">
            <a href="/itemsreq/" className="button-1">Donation Required</a>
            <a href="/volunteerreq/" className="button-2">Volunteer Required</a>
          </div>
          <div className="details">
            <span className="product-name">{donee.name}</span>
            <span className="subheading">{donee.email}<br/>{donee.phone_number}<br/>{donee.address}</span>
          </div>
        </div>
        <div className="events-needs-container">
          <div className="events-section">
            <span className="section-title">Upcoming Events</span>
            <div className="card-list">
              {events.map((event, index) => (
                <div className="card" key={index}>
                  <span className="event-name">{event.name}</span>
                  <span className="description">{event.description}</span>
                  <span className="event-date">{event.date}</span>
                  <span className="event-venue">{event.venue}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="needs-section">
            <span className="section-title">Needs Posted</span>
            <div className="card-list">
              {needs.map((need, index) => (
                <div className="card" key={index}>
                  <span className="need-name">{need.name}</span>
                  <span className="description">{need.description}</span>
                  <span className="need-count">{need.count}</span>
                  <span className="need-status">{need.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="footer">
        <div className="divider"></div>
        <span className="holding-hands-f">Holding Hands</span>
        <div className="project-info">
          <span className="location-info">Kasaragod, Kerala, India</span>
          <span className="email-info">projectholdinghands@gmail.com</span>
        </div>
        <div className="social-icons">
          <div className="icon"></div>
          <div className="icon"></div>
          <div className="icon"></div>
          <div className="icon"></div>
        </div>
      </div>
    </div>
  );
};

export default DoneeDashboard;
