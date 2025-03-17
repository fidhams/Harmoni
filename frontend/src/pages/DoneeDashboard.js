import React, { useState, useEffect } from "react";
import { Box, Text, Button, VStack, HStack, Image } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const DoneeDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [events, setEvents] = useState([]);
  const [needs, setNeeds] = useState([]);
  const [impactStories, setImpactStories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/donee/dashboard", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (!res.ok) throw new Error("Failed to fetch data");
        
        const data = await res.json();
        setProfile(data.profile);
        setEvents(data.Event || []);
        setNeeds(data.Needs || []);
        setImpactStories(data.ImpactStory || []);
        console.log("Data:",data);
      } catch (error) {
        console.error(error);
      }
    };
    
    fetchDashboardData();
  }, []);

  const handleDeleteImpactStory = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/donee/impact-stories/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!res.ok) throw new Error("Failed to delete impact story");
      setImpactStories(impactStories.filter(story => story._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteEvent = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/donee/event/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!res.ok) throw new Error("Failed to delete event");
      setEvents(events.filter(event => event._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteNeed = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/donee/needs/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!res.ok) throw new Error("Failed to delete need");
      setNeeds(needs.filter(need => need._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <VStack spacing={5} p={5} align="center">
      <Text fontSize="2xl" fontWeight="bold">Donee Dashboard</Text>
      {profile && (
  <HStack spacing={5} p={5} shadow="md" borderWidth="1px" borderRadius="md">
    {profile.profileImage && (
      <Image
        src={`http://localhost:5000/uploads/${profile.profileImage}`}
        alt="Profile"
        boxSize="150px"
        borderRadius="full"
        objectFit="cover"
      />
    )}
      <VStack align="start">
        <Text fontWeight="bold" fontSize="xl">{profile.name}</Text>
        <Text>Address: {profile.address}</Text>
        <Text>Phone: {profile.phone}</Text>
        <Text>Description: {profile.description || "No description provided"}</Text>
        <Text>Location: {profile.location?.latitude}, {profile.location?.longitude}</Text>
        <Button colorScheme="blue" onClick={() => navigate("/donee/edit-profile")}>
          Edit Profile
        </Button>
      </VStack>
    </HStack>
  )}





    <Text fontSize="xl" fontWeight="bold">Posted Events</Text>
    <Button colorScheme="green" onClick={() => navigate("/add-event")}>Add Event</Button>
    {events.length > 0 ? events.map((event) => (
      <Box key={event._id} p={3} shadow="sm" borderWidth="1px" borderRadius="md" width="100%">
        <VStack align="start" spacing={1}>
          <Text fontWeight="bold">{event.name}</Text>
          <Text fontSize="sm" color="gray.500">Date: {new Date(event.date).toLocaleDateString()}</Text>
          <Text fontSize="sm" color="gray.500">Venue: {event.venue}</Text>
          <Text fontSize="sm" color="gray.500">Volunteers Required: {event.volunteerRequest ? "Yes" : "No"}</Text>
          <Text fontSize="sm" color="gray.500" style={{ whiteSpace: "pre-line" }} >Description: {event.description}</Text>
          <HStack>
            <Button colorScheme="blue" onClick={() => navigate(`/edit-event/${event._id}`)}>Edit</Button>
            <Button colorScheme="red" onClick={() => handleDeleteEvent(event._id)}>Delete</Button>
          </HStack>
        </VStack>
      </Box>
    )) : <Text>No events posted yet.</Text>}








      <Text fontSize="xl" fontWeight="bold">Posted Needs</Text>
      <Button colorScheme="green" onClick={() => navigate("/add-need")}>Add Need</Button>
      {needs.length > 0 ? needs.map((need) => (
        <Box key={need._id} p={3} shadow="sm" borderWidth="1px" borderRadius="md">
          <Text>{need.itemName}</Text>
          <HStack>
            <Button colorScheme="blue" onClick={() => navigate(`/edit-need/${need._id}`)}>Edit</Button>
            <Button colorScheme="red" onClick={() => handleDeleteNeed(need._id)}>Delete</Button>
          </HStack>
        </Box>
      )) : <Text>No needs posted yet.</Text>}

      <Text fontSize="xl" fontWeight="bold">Impact Stories</Text>
      <Button colorScheme="green" onClick={() => navigate("/add-impact-story")}>Add Impact Story</Button>
      
      {impactStories.length > 0 ? impactStories.map((story) => (
  <HStack key={story._id} p={3} shadow="sm" borderWidth="1px" borderRadius="md" align="start">
    {story.image && (
      <Image
        src={`http://localhost:5000/uploads/${story.image}`}
        alt={story.title}
        boxSize="100px"
        borderRadius="md"
        objectFit="cover"
      />
    )}
      <VStack align="start">
        <Text fontWeight="bold">{story.title}</Text>
        <Text>{story.description}</Text>
        <HStack>
          <Button colorScheme="blue" onClick={() => navigate(`/edit-impact-story/${story._id}`)}>Edit</Button>
          <Button colorScheme="red" onClick={() => handleDeleteImpactStory(story._id)}>Delete</Button>
        </HStack>
      </VStack>
    </HStack>
  )) : <Text>No impact stories posted yet.</Text>}

      
      
      {/* {impactStories.length > 0 ? impactStories.map((story) => (
        <Box key={story._id} p={3} shadow="sm" borderWidth="1px" borderRadius="md">
          <Image src={story.image} alt={story.title} boxSize="100px" />
          <Text fontWeight="bold">{story.title}</Text>
          <Text>{story.description}</Text>
          <HStack>
            <Button colorScheme="blue" onClick={() => navigate(`/edit-impact-story/${story._id}`)}>Edit</Button>
            <Button colorScheme="red" onClick={() => handleDeleteImpactStory(story._id)}>Delete</Button>
          </HStack>
        </Box>
      )) : <Text>No impact stories posted yet.</Text>} */}
    </VStack>
  );
};

export default DoneeDashboard;
