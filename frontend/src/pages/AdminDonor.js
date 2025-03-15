import React, { useState, useEffect } from "react";
import { Box, Text, VStack, HStack, Spinner, Button, Card, CardBody } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const AdminDonor = () => {
  const [loading, setLoading] = useState(true);
  const [donors, setDonors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/admin/getAllDonors", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await res.json();
        setDonors(data);
      } catch (error) {
        console.error("Error fetching donors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonors();
  }, []);

  return (
    <Box p={5}>
      <VStack spacing={5} align="stretch">
        <HStack justify="space-between">
          <Text fontSize="2xl" fontWeight="bold">Donors List</Text>
          <Button colorScheme="blue" onClick={() => navigate("/admin/dashboard")}>Back to Dashboard</Button>
        </HStack>

        {loading ? (
          <Spinner size="xl" />
        ) : donors.length > 0 ? (
          donors.map((donor) => (
            <Card key={donor._id} p={4} shadow="md" borderWidth="1px" borderRadius="md">
              <CardBody>
                <Text fontSize="lg" fontWeight="bold">{donor.name}</Text>
                <Text>Email: {donor.email}</Text>
                <Text>Phone: {donor.phone || "N/A"}</Text>
              </CardBody>
            </Card>
          ))
        ) : (
          <Text>No donors found.</Text>
        )}
      </VStack>
    </Box>
  );
};

export default AdminDonor;
