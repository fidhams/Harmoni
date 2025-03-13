import React, { useState } from "react";
import "../styles/orgsignup.css";

const OrgSignup = () => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    details: "",
    email: "",
    password: "",
    phone_number: "",
  });
  const [showPopup, setShowPopup] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/orgsignup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setShowPopup(true);
        setFormData({
          name: "",
          address: "",
          details: "",
          email: "",
          password: "",
          phone_number: "",
        });
      } else {
        console.error("Signup failed");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="main-container">
      <div className="navigation">
        <span className="holding-hands">Holding Hands</span>
        <a href="/" className="home">Home</a>
      </div>
      <div className="frame">
        <span className="create-account">Create an account</span>
      </div>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Enter your Name" value={formData.name} onChange={handleChange} required />
        <input type="text" name="address" placeholder="Enter your Address" value={formData.address} onChange={handleChange} required />
        <textarea name="details" placeholder="Enter additional details" value={formData.details} onChange={handleChange} required></textarea>
        <input type="email" name="email" placeholder="Enter your Email" value={formData.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Enter your Password" value={formData.password} onChange={handleChange} required />
        <input type="tel" name="phone_number" placeholder="Enter your Phone Number" value={formData.phone_number} onChange={handleChange} required />
        <button type="submit" className="button">Submit</button>
      </form>
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <p>Your request has been submitted successfully. You'll soon receive a mail for approval.</p>
            <button className="popup-button" onClick={() => setShowPopup(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrgSignup;
