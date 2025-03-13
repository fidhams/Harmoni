import React, { useState } from "react";
import "../styles/login.css";
import { Link, useNavigate } from "react-router-dom";

const DonorLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/donor/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        navigate("/donordashboard");
        console.log(data);
        setMessage("Login successful!");
        setMessageType("success");
      } else {
        setMessage(data.message || "Login failed.");
        setMessageType("error");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
      setMessageType("error");
    }
  };

  return (
    <div className="main-container">

      {message && <div className={`popup-message ${messageType}`}>{message}</div>}

      <form onSubmit={handleSubmit}>
        <div className="frame">
          <span className="user-name">Email</span>
          <div className="field">
            <input className="field-input" type="email" name="email" placeholder="Enter your email" required value={formData.email} onChange={handleChange} />
          </div>
        </div>
        <div className="frame">
          <span className="password-input">Password</span>
          <div className="field">
            <input className="field-input" type="password" name="password" placeholder="Enter your password" required value={formData.password} onChange={handleChange} />
          </div>
        </div>
        <button type="submit" className="button" >
          <span className="login-6">Login</span>
        </button>
      </form>
      <div className="signup-section">
        <p>Don't have an account?</p>
        <Link to="/donorsignup" className="signup-button">Sign Up</Link>
      </div>
      <div className="donee-login-link">
        <p>Are you an organization? </p>
        <Link to="/doneelogin" className="doneebutton">Login as Organisation</Link>
      </div>
    </div>
  );
};

export default DonorLogin;
