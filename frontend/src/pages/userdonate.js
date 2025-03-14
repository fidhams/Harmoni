import React, { useState } from "react";
// import "../styles/userdonate.css";

const UserDonateForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    count: "",
    image: null,
  });

  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("category", formData.category);
    formDataToSend.append("count", formData.count);
    formDataToSend.append("image", formData.image);

    try {
      const response = await fetch("http://localhost:5000/api/userdonate", {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error("Failed to submit donation");
      }

      alert("Donation submitted successfully!");
      setFormData({ name: "", category: "", count: "", image: null });
      setPreview(null);
    } catch (error) {
      console.error("Error submitting donation:", error);
      alert("Error submitting donation");
    }
  };

  return (
    <div className="main-container">
      <div className="form">
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="input">
            <span className="name">Name</span>
            <div className="field">
              <input
                className="field-input"
                type="text"
                name="name"
                placeholder="Enter Item Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <label className="name">Category</label>
            <select
              name="category"
              className="dropdown-select"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Category
              </option>
              <option value="Clothing">Clothing</option>
              <option value="Hygiene Products">Hygiene Products</option>
              <option value="School Supplies">School Supplies</option>
              <option value="Household items">Household items</option>
              <option value="Medical Supplies">Medical Supplies</option>
              <option value="Toys and Games">Toys and Games</option>
              <option value="Electronics">Electronics</option>
              <option value="Furnitures">Furnitures</option>
              <option value="Books and Magazines">Books and Magazines</option>
              <option value="Others">Others</option>
            </select>
            <div className="input-container">
              <label className="name">Count</label>
              <input
                type="number"
                name="count"
                className="input-field"
                placeholder="Enter Count"
                value={formData.count}
                onChange={handleChange}
                required
              />
            </div>
            <input
              type="file"
              accept="image/*"
              id="upload"
              name="image"
              style={{ display: "none" }}
              onChange={handleFileChange}
              required
            />
            <label htmlFor="upload" className="custom-file-upload">
              <span className="add-image">Add image</span>
            </label>
            <div id="preview">
              {preview && <img src={preview} alt="Preview" id="uploaded-image" />}
            </div>
            <button type="submit" className="button">
              <span className="add">Submit</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserDonateForm;
