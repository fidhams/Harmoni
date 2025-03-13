import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Link } from "react-router-dom";
import "../styles/signup.css";

const DonorSignup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/auth/donor/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        navigate("/donorlogin");
        setMessage("Signup successful! You can now login.");
        setMessageType("success");
      } else {
        setMessage(data.message || "Signup failed.");
        setMessageType("error");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
      setMessageType("error");
    }
  };

  return (
    <div className="main-container">
      <div className="frame">
        <div className="copy"><span className="signup-1">Donor Signup</span></div>
      </div>
      {message && <div className={`popup-message ${messageType}`}>{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="frame-2">
          <span className="user-name">Full Name</span>
          <input type="text" name="name" placeholder="Enter your full name" required value={formData.name} onChange={handleChange} />
        </div>
        <div className="frame-3">
          <span className="email">Email</span>
          <input type="email" name="email" placeholder="Enter your email" required value={formData.email} onChange={handleChange} />
        </div>
        <div className="frame-3">
          <span className="password">Password</span>
          <input type="password" name="password" placeholder="Enter your password" required value={formData.password} onChange={handleChange} />
        </div>
        <div className="frame-3">
          <span className="phone">Phone Number</span>
          <input type="text" name="phone" placeholder="Enter your phone number" required value={formData.phone} onChange={handleChange} />
        </div>
        <button type="submit" className="button"><span className="signup">Sign Up</span></button>
      </form>

      <div className="login-section">
        <p>Already have an account?</p>
        <Link to="/donorlogin" className="login-button">Login as Donor</Link>
      </div>

      {/* ✅ Link to Donee Signup */}
      <div className="donee-signup-link">
        <p>Are you a donee?</p>
        <Link to="/doneesignup" className="donee-button">Sign Up as Donee</Link>
      </div>
    </div>
  );
};

export default DonorSignup;
