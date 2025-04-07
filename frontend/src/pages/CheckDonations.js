import React, { useState, useEffect } from "react";
import { Box, Text, Button, VStack, HStack, Image, Badge, Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Chat from "../components/Chat";



const CheckDonations = () => {
  const [donations, setDonations] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const decoded = token ? jwtDecode(token) : null;
  const doneeId = decoded?.id || decoded?._id; // depends on how your token is structured


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
        console.log(data)
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
      <Flex gap="4" justify="center" wrap="wrap">
      {donations.length > 0 ? donations.map((donation) => (
        <Box key={donation._id} p={5} shadow="sm" borderWidth="1px" borderRadius="md" width="20rem">
          <HStack gap="7rem">
          {donation.image && (
            <Image
            src={`http://localhost:5000/uploads/${donation.image}`}
            alt={donation.item}
            boxSize="100px"
            borderRadius="md"
            objectFit="cover"
            />
          )}
          <Chat senderType="donee" senderId={doneeId} receiverType="donor" receiverId={donation.donor._id} />
          </HStack>
          <Text fontWeight="bold">{donation.item}</Text>
          <Text fontSize="sm" color="gray.500">Category: {donation.category}</Text>
          <Text fontSize="sm" color="gray.500">Quantity: {donation.quantity}</Text>
          <Text fontSize="sm" color="gray.500">Description: {donation.description}</Text>
          <Badge marginBottom="5px" backgroundColor={donation.status === "pending" ? "yellow" : donation.status === "accepted" ? "blue" : "green"}>
            {donation.status}
          </Badge>
          <HStack>
            {donation.status === "pending" && (
              <Button color="green" onClick={() => updateDonationStatus(donation._id, "accepted")}>
                Accept
              </Button>
            )}
            {donation.status === "accepted" && (
              <>
                <Button color="red" onClick={() => updateDonationStatus(donation._id, "pending")}>
                  Undo Accept
                </Button>
                <Button color="blue" onClick={() => updateDonationStatus(donation._id, "completed")}>
                  Mark Completed
                </Button>
              </>
            )}
            {donation.status === "completed" && (
              <Button color="orange" onClick={() => updateDonationStatus(donation._id, "accepted")}>
                Mark Not Completed
              </Button>
            )}
          </HStack>
        </Box>
      )) : <Text>No donations available.</Text>}
      </Flex>
    </VStack>
  );
};

export default CheckDonations;
