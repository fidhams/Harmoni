import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { Box, Text, Button, VStack } from "@chakra-ui/react";
import { Loader } from "@googlemaps/js-api-loader";


const VolunteerEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState(null); // Store logged-in user
  const [apiKey, setApiKey] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getMapAPI();
    fetchEvents();
    checkUserLogin();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/v/volunteer-events");
      const data = await res.json();
      if (Array.isArray(data)) {
        setEvents(data);
        console.log("Fetched events:", data);
      } else {
        console.error("Invalid data format:", data);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const checkUserLogin = () => {
    const token = localStorage.getItem("token"); // Check for token
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1])); // Decode token payload
        setUser(decoded); // Set user state
        console.log("User logged in:", decoded);
      } catch (error) {
        console.error("Error decoding token:", error);
        // localStorage.removeItem("token"); // Remove invalid token
      }
    }
  };

  const getMapAPI = () => {
    fetch("http://localhost:5000/api/maps-key")
      .then((response) => response.json())
      .then((data) => setApiKey(data.apiKey))
      .catch((error) => console.error("Error fetching API key:", error));
  }

  const applyForEvent = async (eventId) => {
    if (!user) {
      navigate("/donorlogin"); // Redirect to login if user is not logged in
      return;
    }
    // Add this logging
  console.log("Full user object:", user);
  console.log("User ID being sent:", user.id);

    try {
      const res = await fetch(`http://localhost:5000/api/v/apply/${eventId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ donorId: user.id }),
      });

      const data = await res.json();
      console.log("Application response:", data);
      console.log("user ID:", user.id);
      if (data.success) {
        setEvents(events.map(event => 
          event._id === eventId ? { ...event, volunteers: [...event.volunteers, user.id] } : event
        ));
      }
    } catch (error) {
      console.error("Error applying for event:", error);
    }
  };

  const loadMap = (mapContainer, coordinates) => {
    const loader = new Loader({
      apiKey: apiKey,
      version: "weekly",
      libraries: ["places"],
    });

    loader.load().then(async () => {
      // Import `google` from the loader
      const { Map, Marker } = window.google.maps;
      // const { Map } = await google.maps.importLibrary("maps");
      // const { Marker } = await google.maps.importLibrary("marker");

      const map = new Map(mapContainer, {
        center: { lat: coordinates[1], lng: coordinates[0] },
        zoom: 12,
      });

      new Marker({
        position: { lat: coordinates[1], lng: coordinates[0] },
        map,
      });
    });
  };

  return (
    <VStack spacing={5} p={5} align="start" w="100%">
      <Text fontSize="2xl" fontWeight="bold" color="black">Volunteer Events</Text>
      {events.length === 0 ? (
        <Text>No upcoming events requiring volunteers.</Text>
      ) : (
        events.map((event, index) => (
          <Box key={event._id} w="100%">
            <Box p={4} border="1px solid black" borderRadius="md">
              <Text fontSize="lg" fontWeight="bold">{event.name}</Text>
              <Text whiteSpace="pre-wrap">{event.description}</Text>
              <Text><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</Text>
              <Text><strong>Venue:</strong> {event.venue}</Text>
              <Text><strong>Conducted by:</strong> {event.donee?.name || "Unknown"}</Text>
              <Text><strong>Contact:</strong> {event.donee?.phone || "N/A"}</Text>
              {event.location?.coordinates && (
                <Box w="100%" h="300px" ref={(el) => el && loadMap(el, event.location.coordinates)}></Box>
              )}
              {user?.userRole === "donee" ? (
                <Text color="red.500">Not Applicable</Text>
              ) : user && event.volunteers.map(id => id.toString()).includes(user.id) ? (
                <Button colorPalette="green" isDisabled>Applied</Button>
              ) : (
                <Button colorPalette="blue" onClick={() => applyForEvent(event._id)}>Apply</Button>
              )}
            </Box>
            {index < events.length - 1 && <Box w="100%" h="2px" bg="gray.300" my={5} />}
          </Box>
        ))
      )}
    </VStack>
  );
};

export default VolunteerEventsPage;
