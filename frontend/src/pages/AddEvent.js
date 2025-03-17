import React, { useState } from "react";
import { Box, Input, Button, Textarea, VStack, Heading, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const AddEvent = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date: "",
    venue: "",
    volunteerRequest: false,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/donee/event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to add event");

      alert("Event added successfully!");
      navigate("/doneedashboard");
    } catch (error) {
      alert("Error adding event: " + error.message);
    }
  };

  return (
    <Box maxW="500px" mx="auto" p={5} shadow="md" borderWidth="1px" borderRadius="md">
      <Heading size="lg" mb={5} color="black">Add New Event</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <Input name="name" value={formData.name} onChange={handleChange} placeholder="Event Name" required color="black" />
          <Textarea name="description" value={formData.description} onChange={handleChange} placeholder="Event Description" required color="black" />
          <Input type="date" name="date" value={formData.date} onChange={handleChange} required color="black" />
          <Input name="venue" value={formData.venue} onChange={handleChange} placeholder="Venue" required color="black" />

          {/* Native Checkbox */}
          <label>
            <input type="checkbox" name="volunteerRequest" checked={formData.volunteerRequest} onChange={handleChange} />
            <Text as="span" color="black" ml={2}>Require Volunteers?</Text>
          </label>

          <Button colorScheme="blue" type="submit">Create Event</Button>
        </VStack>
      </form>
    </Box>
  );
};

export default AddEvent;
