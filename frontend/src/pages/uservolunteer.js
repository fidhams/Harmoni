import React, { useState } from "react";
import "../styles/uservolunteer.css";
import { useNavigate } from "react-router-dom";

const UserVolunteerForm = () => {
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/api/uservolunteer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ category, description }),
    });
    if (response.ok) {
      navigate("/dashboard");
    } else {
      console.error("Failed to submit volunteer data");
    }
  };

  return (
    <div className="main-container">
      <div className="form">
        <form onSubmit={handleSubmit}>
          <div className="input">
            <label htmlFor="Category" className="name">Category</label>
            <select
              id="Category"
              name="category"
              className="dropdown-select"
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="" disabled selected>Category</option>
              <option value="Companionship and Support">Companionship and Support</option>
              <option value="Mentoring and Tutoring">Mentoring and Tutoring</option>
              <option value="Activities or Event Management">Activities or Event Management</option>
              <option value="Health and Wellness Support">Health and Wellness Support</option>
              <option value="Advocacy and Outreach">Advocacy and Outreach</option>
              <option value="Special Projects">Special Projects</option>
              <option value="Others">Others</option>
            </select>
          </div>
          <div className="input-1">
            <span className="description">Description</span>
            <textarea
              className="label-2"
              id="description"
              name="description"
              placeholder="Enter your question or message"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          <button type="submit" className="button">
            <span className="add">Add</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserVolunteerForm;
