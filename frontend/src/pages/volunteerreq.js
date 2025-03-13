import { useState } from "react";

const VolunteerRequestForm = () => {
  const [formData, setFormData] = useState({
    email: "", // This should be dynamically set based on logged-in user
    category: "",
    name: "",
    description: "",
    venue: "",
    date: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch("http://localhost:5000/api/volunteer-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Event request submitted successfully!");
        setFormData({ email: "", category: "", name: "", description: "", venue: "", date: "" });
      } else {
        setMessage(data.message || "Error submitting event request.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Failed to submit event request.");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Event Required</h2>
      {message && <p className="text-green-600">{message}</p>}
      <form onSubmit={handleSubmit}>
        <label className="block mb-2 font-semibold">Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded mb-4"
        >
          <option value="" disabled>Select Category</option>
          <option value="Companionship and support">Companionship and Support</option>
          <option value="Mentoring and Tutoring">Mentoring and Tutoring</option>
          <option value="Activities or event management">Activities or Event Management</option>
          <option value="Health and Wellness support">Health and Wellness Support</option>
          <option value="Advocacy and outreach">Advocacy and Outreach</option>
          <option value="Special Projects">Special Projects</option>
          <option value="Others">Others</option>
        </select>

        <label className="block mb-2 font-semibold">Event Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded mb-4"
          placeholder="Enter Event Name"
        />

        <label className="block mb-2 font-semibold">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-4"
          placeholder="Enter Description"
        ></textarea>

        <label className="block mb-2 font-semibold">Venue</label>
        <input
          type="text"
          name="venue"
          value={formData.venue}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-4"
          placeholder="Enter Venue"
        />

        <label className="block mb-2 font-semibold">Date</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded mb-4"
        />

        <button type="submit" className="bg-blue-600 text-white p-2 w-full rounded">
          Submit
        </button>
      </form>
    </div>
  );
};

export default VolunteerRequestForm;
