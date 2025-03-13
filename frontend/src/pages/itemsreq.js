import React, { useState } from "react";
import "../styles/itemsreq.css"; // Ensure correct path for CSS

const ItemsRequest = () => {
  const [formData, setFormData] = useState({
    email: "", // Set dynamically if needed
    category: "Clothing",
    name: "",
    count: "",
    status: "Urgent"
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/itemsreq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        alert("Item request submitted successfully!");
        setFormData({ email: "", category: "Clothing", name: "", count: "", status: "Urgent" });
      } else {
        alert("Failed to submit item request.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="main-container">
      <div className="navigation">
        <span className="holding-hands">Holding Hands</span>
        <div className="mobile-app-header">
          <a href="/orghome/" className="home">Home</a>
        </div>
      </div>
      <div className="dropdown-container">
        <div className="copy"><span className="add-items">Add Need</span></div>
        <form onSubmit={handleSubmit}>
          <input type="hidden" name="email" value={formData.email} />
          <div className="dropdown">
            <label htmlFor="Category" className="dropdown-label">Category</label>
            <select id="Category" name="category" className="dropdown-select" value={formData.category} onChange={handleChange}>
              {["Clothing", "Hygiene Products", "School Supplies", "Household items", "Medical Supplies", "Toys and Games", "Electronics", "Furnitures", "Books and Magazines", "Others"].map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="input-container">
            <label htmlFor="ItemName" className="label">Item Name</label>
            <input type="text" id="ItemName" name="name" className="input-field" required value={formData.name} onChange={handleChange} />
          </div>
          <div className="input-container">
            <label htmlFor="Amount" className="label">Amount</label>
            <input type="number" id="Amount" name="count" className="input-field" required value={formData.count} onChange={handleChange} />
          </div>
          <div className="dropdown-container">
            <div className="dropdown">
              <label htmlFor="Status" className="dropdown-label">Status</label>
              <select id="Status" name="status" className="dropdown-select" value={formData.status} onChange={handleChange}>
                <option value="Urgent">Urgent</option>
                <option value="Not">Not Urgent</option>
              </select>
            </div>
          </div>
          <button type="submit" className="primary-button"><span className="add">Add</span></button>
        </form>
      </div>
    </div>
  );
};

export default ItemsRequest;
