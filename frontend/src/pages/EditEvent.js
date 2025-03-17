import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { VStack, Input, Textarea, Button, Box, Text } from "@chakra-ui/react";

const EditEvent = () => {
  const { eventId } = useParams(); // Extract eventId from the URL
  const navigate = useNavigate();

  const [eventData, setEventData] = useState({
    name: "",
    date: "",
    venue: "",
    description: "",
    volunteerRequest: "No",
  });

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/donee/event/${eventId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (!res.ok) throw new Error("Failed to fetch event details");

        const data = await res.json();
        setEventData({
          name: data.name || "",
          date: data.date ? new Date(data.date).toISOString().split("T")[0] : "",
          venue: data.venue || "",
          description: data.description || "",
          volunteerRequest: data.volunteerRequest ? "Yes" : "No",
        });
      } catch (error) {
        console.error("Error fetching event:", error);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/api/donee/event/${eventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(eventData),
      });

      if (!res.ok) throw new Error("Failed to update event");

      alert("Event updated successfully!");
      navigate("/doneedashboard"); // Navigating to donee dashboard after update
    } catch (error) {
      console.error("Error updating event:", error);
      alert("Error updating event. Please try again.");
    }
  };

  return (
    <VStack spacing={5} p={5} align="start">
      <Box>
        <Text fontWeight="bold" color="black">Event Name</Text>
        <Input name="name" value={eventData.name} onChange={handleChange} color="black" border="1px solid black" />
      </Box>

      <Box>
        <Text fontWeight="bold" color="black">Date</Text>
        <Input type="date" name="date" value={eventData.date} onChange={handleChange} color="black" border="1px solid black" />
      </Box>

      <Box>
        <Text fontWeight="bold" color="black">Venue</Text>
        <Input name="venue" value={eventData.venue} onChange={handleChange} color="black" border="1px solid black" />
      </Box>

      <Box>
        <Text fontWeight="bold" color="black">Description</Text>
        <Textarea
          name="description"
          value={eventData.description}
          onChange={handleChange}
          color="black"
          border="1px solid black"
          style={{ whiteSpace: "pre-wrap" }} // Ensures line breaks remain
        />
      </Box>

      <Box>
        <Text fontWeight="bold" color="black">Volunteer Request</Text>
        <select
          name="volunteerRequest"
          value={eventData.volunteerRequest}
          onChange={handleChange}
          style={{
            // color: "black",
            border: "1px solid black",
            padding: "8px",
            width: "100%",
            borderRadius: "5px",
          }}
        >
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </Box>

      <Button colorScheme="blue" onClick={handleSubmit}>Update Event</Button>
      <Button colorScheme="gray" onClick={() => navigate("/doneedashboard")}>Cancel</Button>
    </VStack>
  );
};

export default EditEvent;
