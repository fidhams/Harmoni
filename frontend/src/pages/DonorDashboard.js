import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/user.css";

const DonorDashboard = () => {
  const [user, setUser] = useState({});
  const [donations, setDonations] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/user");
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await response.json();
        setUser(data.user || {}); // Ensure user is an object
        setDonations(data.donations || []);
        setVolunteers(data.volunteers || []);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  return (
    <div className="landing-page">
      {/* Navigation Bar */}
      <div className="navigation">
        <span className="harmoni">Harmoni</span>
      </div>

      {/* User Profile Section */}
      <div className="container">
        <img
          className="icon"
          src={user?.profileImage || `${process.env.PUBLIC_URL}/defaultimg.jpeg`}
          alt="Profile"
        />
        <div className="frame">
          <div className="user-name">{user?.name || "Donor"}</div>
          <span className="email">{user?.email || "example@email.com"}</span>
        </div>
      </div>

      {/* Donations Section */}
      <div className="heading">
        <span className="my-items">My Items</span>
      </div>
      <div className="cards">
        <div className="customer-quote">
          <button className="button" onClick={() => navigate("/userdonate")}>+</button>
        </div>
        {donations.length > 0 ? (
          donations.map((donation) => (
            <div className="customer-quote" key={donation.id}>
              <div className="avatar">
                <img
                  className="avatar"
                  src={donation?.image || `${process.env.PUBLIC_URL}/placeholder.png`}
                  alt={donation?.name}
                />
                <div className="frame-2610301">
                  <div className="name">{donation?.name}</div>
                  <span className="description-4">
                    {donation?.category} - {donation?.count}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="empty-message">No donations yet.</p>
        )}
      </div>

      {/* Volunteer Section */}
      <div className="heading-1">
        <span className="volunteer">Volunteer</span>
      </div>
      <div className="cards-1">
        <div className="customer-quote-2">
          <button className="button" onClick={() => navigate("/uservolunteer")}>+</button>
        </div>
        {volunteers.length > 0 ? (
          volunteers.map((volunteer) => (
            <div className="customer-quote-3" key={volunteer.id}>
              <div className="frame-26103012">
                <div className="category">{volunteer?.volunteer_category}</div>
                <span className="description-2">{volunteer?.volunteer_details}</span>
              </div>
            </div>
          ))
        ) : (
          <p className="empty-message">No volunteers yet.</p>
        )}
      </div>
    </div>
  );
};

export default DonorDashboard;
