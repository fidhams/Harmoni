import React, { useEffect, useState } from "react";
import "../styles/user.css";
import { useNavigate } from "react-router-dom";

const DonorDashboard = () => {
  const [user, setUser] = useState(null);
  const [donations, setDonations] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/user");
        const data = await response.json();
        setUser(data.user);
        setDonations(data.donations);
        setVolunteers(data.volunteers);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  return (
    <div className="landing-page-01">
      <div className="navigation">
        <span className="holding-hands">Holding Hands</span>
        <div className="items">
          <a href="/" className="home">Home</a>
          <button className="button-1" onClick={() => navigate("/")}>Logout</button>
        </div>
      </div>
      <div className="container">
        <img className="iconn" src={user?.profileImage || "/default-pfp.jpg"} alt="Profile" />
        <div className="frame-1321316142">
          <div className="user-name">{user?.name}</div>
          <span className="email">{user?.email}</span>
        </div>
      </div>
      <div className="heading">
        <span className="my-items">My items</span>
      </div>
      <div className="cards">
        <div className="customer-quote">
          <button className="button-2" onClick={() => navigate("/userdonate")}>+</button>
        </div>
        {donations.map((donation) => (
          <div className="customer-quote-5" key={donation.id}>
            <div className="avatar-4">
              <img className="avatar" src={donation.image} alt="Donation" />
              <div className="frame-2610301">
                <div className="name-2">{donation.name}</div>
                <span className="description-4">{donation.category} - {donation.count}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="heading-1">
        <span className="volunteer">Volunteer</span>
      </div>
      <div className="cards-1">
        <div className="customer-quote-2">
          <button className="button" onClick={() => navigate("/uservolunteer")}>+</button>
        </div>
        {volunteers.map((volunteer) => (
          <div className="customer-quote-3" key={volunteer.id}>
            <div className="frame-26103012">
              <div className="category">{volunteer.volunteer_category}</div>
              <span className="description-2">{volunteer.volunteer_details}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonorDashboard;
