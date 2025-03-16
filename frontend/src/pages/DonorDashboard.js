import React, { useState, useEffect } from "react";
import { 
  Box, Text, Button, VStack, Spinner, Image, Wrap, WrapItem, Flex, Badge 
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const DonorDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [donations, setDonations] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const BASE_URL = "http://localhost:5000/uploads/";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/donor/dashboard", {
          method: "GET",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch donations. Please try again.");
        }

        const data = await res.json();
        console.log("Dashboard Data:", data);

        if (Array.isArray(data.donations)) {
          setDonations(data.donations);
        } else {
          setDonations([]);
        }
      } catch (error) {
        console.error("Error fetching donor dashboard data:", error);
        setError("Error loading data. Please refresh and try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    navigate("/donorlogin");
  };

  const handleDeleteDonation = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/donor/delete-donation/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!res.ok) {
        throw new Error("Failed to delete donation.");
      }

      setDonations((prev) => prev.filter((donation) => donation._id !== id));
    } catch (error) {
      console.error("Error deleting donation:", error);
    }
  };

  // Define badge colors based on status
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "pending":
        return "yellow";
      case "accepted":
        return "blue";
      case "completed":
        return "green";
      default:
        return "gray";
    }
  };

  return (
    <VStack height="100vh" spacing={5} p={5} align="center">
      <Text fontSize="2xl" fontWeight="bold">Donor Dashboard</Text>

      {error && <Text color="red.500">{error}</Text>}

      {loading ? (
        <Spinner size="xl" />
      ) : (
        <>
          <Flex gap={3} wrap="wrap">
            <Button colorScheme="blue" onClick={() => navigate("/donor/edit-profile")}>
              Edit Profile
            </Button>
            <Button colorScheme="green" onClick={() => navigate("/post-donation")}>
              Post a New Donation
            </Button>
          </Flex>

          <Text fontSize="xl" fontWeight="bold" mt={5}>Your Donations</Text>

          <Wrap spacing={4} justify="center">
            {donations.length > 0 ? (
              donations.map((donation) => (
                <WrapItem key={donation._id}>
                  <Box
                    position="relative"
                    p={5}
                    shadow="md"
                    borderWidth="1px"
                    borderRadius="md"
                    width="300px"
                    textAlign="center"
                  >
                    {/* Status Badge in Top-Right Corner */}
                    <Badge 
                      colorScheme={getStatusBadgeColor(donation.status)} 
                      position="absolute" 
                      top={2} 
                      right={2}
                    >
                      {donation.status.toUpperCase()}
                    </Badge>

                    <Text fontSize="lg" fontWeight="bold">{donation.item}</Text>
                    <Text>Category: {donation.category}</Text>
                    <Text>Quantity: {donation.quantity}</Text>
                    <Text>{donation.description}</Text>

                    {donation.image ? (
                      <Image
                        src={`${BASE_URL}${donation.image}`}
                        alt={donation.item}
                        mt={3}
                        borderRadius="md"
                        objectFit="cover"
                        width="100%"
                        maxH="200px"
                        fallbackSrc="https://via.placeholder.com/300"
                      />
                    ) : (
                      <Text color="gray.500" mt={2}>No Image Available</Text>
                    )}

                    {donation.status === "pending" && (
                      <Button
                        colorScheme="red"
                        mt={2}
                        onClick={() => handleDeleteDonation(donation._id)}
                      >
                        Delete Donation
                      </Button>
                    )}
                  </Box>
                </WrapItem>
              ))
            ) : (
              <Text>No donations posted yet.</Text>
            )}
          </Wrap>
        </>
      )}

      <Button colorScheme="red" onClick={handleLogout}>Logout</Button>
    </VStack>
  );
};

export default DonorDashboard;
