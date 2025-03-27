import React, { useState, useRef, useEffect } from "react";
import { Box, Input, Button, Textarea, VStack, Heading, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Loader } from "@googlemaps/js-api-loader";
require("dotenv").config();

const API_KEY = process.env.GOOGLEMAPS_API_KEY;

const mapContainerStyle = {
  width: "100%",
  height: "300px",
};

const center = { lat: 20.5937, lng: 78.9629 }; // Default (India)

const AddEvent = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date: "",
    venue: "",
    latitude: "",
    longitude: "",
    volunteerRequest: false,
  });

  const navigate = useNavigate();
  const mapRef = useRef(null);

  useEffect(() => {
    loadGoogleMaps();
  }, []);

  const loadGoogleMaps = async () => {
    const loader = new Loader({
      apiKey: API_KEY,
      version: "weekly",
      libraries: ["places"],
    });

    try {
      const google = await loader.load();
      if (mapRef.current) {
        const map = new google.maps.Map(mapRef.current, {
          center: formData.latitude && formData.longitude
            ? { lat: parseFloat(formData.latitude), lng: parseFloat(formData.longitude) }
            : center,
          zoom: 12,
        });

        if (formData.latitude && formData.longitude) {
          new google.maps.Marker({
            position: { lat: parseFloat(formData.latitude), lng: parseFloat(formData.longitude) },
            map,
          });
        }

        google.maps.event.addListener(map, "click", (event) => {
          setFormData({
            ...formData,
            latitude: event.latLng.lat(),
            longitude: event.latLng.lng(),
          });
        });
      }
    } catch (error) {
      console.error("Error loading Google Maps:", error);
    }
  };

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
          
          {/* Google Maps Integration */}
          <div ref={mapRef} style={mapContainerStyle} />

          <Input type="text" placeholder="Latitude" name="latitude" value={formData.latitude} onChange={handleChange} color="black" readOnly />
          <Input type="text" placeholder="Longitude" name="longitude" value={formData.longitude} onChange={handleChange} color="black" readOnly />

          {/* Checkbox for volunteer request */}
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
