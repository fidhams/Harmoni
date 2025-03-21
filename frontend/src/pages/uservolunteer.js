import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { Box, Text, Button, VStack } from "@chakra-ui/react";

const VolunteerEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState(null); // Store logged-in user
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
    checkUserLogin();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/v/volunteer-events");
      const data = await res.json();
      if (Array.isArray(data)) {
        setEvents(data);
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
      } catch (error) {
        console.error("Error decoding token:", error);
        localStorage.removeItem("token"); // Remove invalid token
      }
    }
  };
  

  const applyForEvent = async (eventId) => {
    if (!user) {
      navigate("/donorlogin"); // Redirect to login if user is not logged in
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/v/apply/${eventId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ donorId: user._id }),
      });

      const data = await res.json();
      if (data.success) {
        setEvents(events.map(event => 
          event._id === eventId ? { ...event, volunteers: [...event.volunteers, user._id] } : event
        ));
      }
    } catch (error) {
      console.error("Error applying for event:", error);
    }
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
              <Text><strong>Contact:</strong> {event.donee?.phone || "N/A"}</Text>
              {user && event.volunteers.includes(user._id) ? (
                <Button colorScheme="green" isDisabled>Applied</Button>
              ) : (
                <Button colorScheme="blue" onClick={() => applyForEvent(event._id)}>Apply</Button>
              )}
            </Box>

            {/* Custom Divider Replacement */}
            {index < events.length - 1 && <Box w="100%" h="2px" bg="gray.300" my={5} />}
          </Box>
        ))
      )}
    </VStack>
  );
};

export default VolunteerEventsPage;
