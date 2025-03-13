import React, { useEffect, useState } from "react";
import "../styles/contactus.css"; // Ensure correct path for CSS

const ApprovedDonees = () => {
  const [donees, setDonees] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/approved-donees") // Replace with your Express API URL
      .then((response) => response.json())
      .then((data) => setDonees(data))
      .catch((error) => console.error("Error fetching approved donees:", error));
  }, []);

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
              <p>Phone: {donee.phone_number}</p>
              <p>Address: {donee.address}</p>
              <p>Details: {donee.details}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApprovedDonees;
