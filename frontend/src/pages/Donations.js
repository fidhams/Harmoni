import React, { useEffect, useState } from "react";
import { Box, Text, VStack } from "@chakra-ui/react";

const DonationsPage = () => {
  const [needs, setNeeds] = useState([]); // ✅ Ensure initial state is an empty array
  const [completedDonations, setCompletedDonations] = useState([]);

  useEffect(() => {
    fetchNeeds();
    fetchCompletedDonations();
  }, []);

  const fetchNeeds = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/d/needs");
      const data = await res.json();
      
      if (Array.isArray(data)) { // ✅ Ensure data is an array before setting state
        setNeeds(data);
      } else {
        console.error("Needs data is not an array:", data);
        setNeeds([]);
      }
    } catch (error) {
      console.error("Error fetching needs:", error);
      setNeeds([]); // ✅ Fallback to an empty array to prevent crashes
    }
  };

  const fetchCompletedDonations = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/d/don");
      const data = await res.json();

      if (Array.isArray(data)) { // ✅ Ensure data is an array before setting state
        setCompletedDonations(data);
      } else {
        console.error("Completed donations data is not an array:", data);
        setCompletedDonations([]);
      }
    } catch (error) {
      console.error("Error fetching completed donations:", error);
      setCompletedDonations([]);
    }
  };

  return (
    <VStack spacing={5} p={5} align="start" w="100%">
      {/* Needs Section */}
      <Box w="100%">
        <Text fontSize="xl" fontWeight="bold" color="black" mb={3}>Needs</Text>
        {needs.length === 0 ? (
          <Text>No current needs available.</Text>
        ) : (
          needs.map((need) => (
            <Box key={need._id} p={4} border="1px solid black" borderRadius="md" mb={4}>
              <Text fontWeight="bold">{need.itemName}</Text>
              <Text>Category: {need.category}</Text>
              <Text>Quantity: {need.quantity}</Text>
              <Text>Description: {need.description}</Text>
              <Text>Organization: {need.donee?.name || "Unknown"}</Text>
            </Box>
          ))
        )}
      </Box>

      {/* Custom Divider */}
      <Box w="100%" h="2px" bg="gray.300" my={5} />

      {/* Donations Section */}
      <Box w="100%">
        <Text fontSize="xl" fontWeight="bold" color="black" mb={3}>Completed Donations</Text>
        {completedDonations.length === 0 ? (
          <Text>No completed donations yet.</Text>
        ) : (
          completedDonations.map((donation) => (
            <Box key={donation._id} p={4} border="1px solid black" borderRadius="md" mb={4}>
              <Text fontWeight="bold">{donation.item}</Text>
              <Text>Category: {donation.category}</Text>
              <Text>Quantity: {donation.quantity}</Text>
              <Text>Donor: {donation.donor?.name || "Anonymous"}</Text>
              <Text>Organization: {donation.organization?.name || "N/A"}</Text>
            </Box>
          ))
        )}
      </Box>
    </VStack>
  );
};

export default DonationsPage;
