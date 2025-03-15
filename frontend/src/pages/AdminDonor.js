import React, { useState, useEffect } from "react";
import { Box, VStack, HStack, Text, Button, Spinner } from "@chakra-ui/react";

const AdminDonors = () => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/admin/getAllDonors", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await res.json();

        setDonors(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching donors:", error);
        setDonors([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDonors();
  }, []);

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/admin/deleteDonor/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setDonors(donors.filter((donor) => donor._id !== id));
    } catch (error) {
      console.error("Error deleting donor:", error);
    }
  };

  return (
    <Box p={5}>
      <Text fontSize="2xl" fontWeight="bold">Donors List</Text>
      {loading ? (
        <Spinner size="xl" mt={10} />
      ) : (
        <VStack spacing={4} mt={5} align="stretch">
          {donors.length > 0 ? (
            donors.map((donor) => (
              <Box key={donor._id} p={4} shadow="md" borderWidth="1px" borderRadius="md">
                <Text><strong>Name:</strong> {donor.name}</Text>
                <Text><strong>Email:</strong> {donor.email}</Text>
                <Text><strong>Phone:</strong> {donor.phone}</Text>
                <Text><strong>Address:</strong> {donor.address || "N/A"}</Text>
                <Text><strong>Badges:</strong> {donor.badges.length ? donor.badges.join(", ") : "None"}</Text>
                <Text><strong>Skills:</strong> {donor.skills.length ? donor.skills.join(", ") : "None"}</Text>
                <Text><strong>Joined:</strong> {new Date(donor.createdAt).toLocaleDateString()}</Text>
                <Button colorScheme="red" mt={3} onClick={() => handleDelete(donor._id)}>Delete</Button>
              </Box>
            ))
          ) : (
            <Text>No donors available</Text>
          )}
        </VStack>
      )}
    </Box>
  );
};

export default AdminDonors;
