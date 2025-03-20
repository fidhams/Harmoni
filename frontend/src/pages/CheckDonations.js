import React, { useState, useEffect } from "react";
import { Box, Text, Button, VStack, HStack, Image, Badge } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const CheckDonations = () => {
  const [donations, setDonations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/donee/donations", {
          method: "GET",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (!res.ok) throw new Error("Failed to fetch donations");
        
        const data = await res.json();
        setDonations(data);
      } catch (error) {
        console.error(error);
      }
    };
    
    fetchDonations();
  }, []);

  const updateDonationStatus = async (id, status) => {
    try {
      const res = await fetch(`http://localhost:5000/api/donee/donation/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      
      setDonations(donations.map(donation => 
        donation._id === id ? { ...donation, status } : donation
      ));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <VStack spacing={5} p={5} align="center">
      <Text fontSize="2xl" fontWeight="bold">Check Donations</Text>
      {donations.length > 0 ? donations.map((donation) => (
        <Box key={donation._id} p={5} shadow="sm" borderWidth="1px" borderRadius="md" width="100%">
          {donation.image && (
            <Image
              src={`http://localhost:5000/uploads/${donation.image}`}
              alt={donation.item}
              boxSize="100px"
              borderRadius="md"
              objectFit="cover"
            />
          )}
          <Text fontWeight="bold">{donation.item}</Text>
          <Text fontSize="sm" color="gray.500">Category: {donation.category}</Text>
          <Text fontSize="sm" color="gray.500">Quantity: {donation.quantity}</Text>
          <Text fontSize="sm" color="gray.500">Description: {donation.description}</Text>
          <Badge colorScheme={donation.status === "pending" ? "yellow" : donation.status === "accepted" ? "blue" : "green"}>
            {donation.status}
          </Badge>
          <HStack>
            {donation.status === "pending" && (
              <Button colorScheme="green" onClick={() => updateDonationStatus(donation._id, "accepted")}>
                Accept
              </Button>
            )}
            {donation.status === "accepted" && (
              <>
                <Button colorScheme="red" onClick={() => updateDonationStatus(donation._id, "pending")}>
                  Undo Accept
                </Button>
                <Button colorScheme="blue" onClick={() => updateDonationStatus(donation._id, "completed")}>
                  Mark Completed
                </Button>
              </>
            )}
            {donation.status === "completed" && (
              <Button colorScheme="orange" onClick={() => updateDonationStatus(donation._id, "accepted")}>
                Mark Not Completed
              </Button>
            )}
          </HStack>
        </Box>
      )) : <Text>No donations available.</Text>}
    </VStack>
  );
};

export default CheckDonations;
