import React, { useEffect, useState } from "react";
import axios from "axios";

const DonationsPage = () => {
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    axios.get("/api/donations")
      .then(response => setDonations(response.data))
      .catch(error => console.error("Error fetching donations:", error));
  }, []);

  return (
    <div className="container">
      <h1>Donations</h1>
      <div className="card-container">
        {donations.map((donation) => (
          <div className="card" key={donation.id}>
            <div className="image">
              <img src={donation.image} alt={donation.name} />
            </div>
            <div className="details">
              <span className="donation-name">{donation.name}</span>
              <span className="donor-info">
                {donation.donor.name} | {donation.donor.phone_number}
              </span>
              <span className="category">Category: {donation.category}</span>
              <span className="count">Count: {donation.count}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonationsPage;
