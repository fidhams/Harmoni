import React, { useState, useEffect } from "react";
import { Box, Text, VStack, HStack, Spinner, Button, Card, CardBody } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const AdminDonee = () => {
  const [loading, setLoading] = useState(true);
  const [donees, setDonees] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDonees = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/admin/getAllDonees", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await res.json();
        setDonees(data);
      } catch (error) {
        console.error("Error fetching donees:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonees();
  }, []);

  return (
    <Box p={5}>
      <VStack spacing={5} align="stretch">
        <HStack justify="space-between">
          <Text fontSize="2xl" fontWeight="bold">Donees List</Text>
          <Button colorScheme="blue" onClick={() => navigate("/admin/dashboard")}>Back to Dashboard</Button>
        </HStack>

        {loading ? (
          <Spinner size="xl" />
        ) : donees.length > 0 ? (
          donees.map((donee) => (
            <Card key={donee._id} p={4} shadow="md" borderWidth="1px" borderRadius="md">
              <CardBody>
                <Text fontSize="lg" fontWeight="bold">{donee.name}</Text>
                <Text>Email: {donee.email}</Text>
                <Text>Phone: {donee.phone || "N/A"}</Text>
                <Text>Needs: {donee.needs || "N/A"}</Text>
              </CardBody>
            </Card>
          ))
        ) : (
          <Text>No donees found.</Text>
        )}
      </VStack>
    </Box>
  );
};

export default AdminDonee;
