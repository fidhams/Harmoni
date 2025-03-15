import React, { useState, useEffect } from "react";
import { Box, VStack, HStack, Text, Button, Spinner } from "@chakra-ui/react";

const AdminDonees = () => {
  const [donees, setDonees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonees = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/admin/getAllDonees", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await res.json();

        setDonees(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching donees:", error);
        setDonees([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDonees();
  }, []);

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/admin/deleteDonee/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setDonees(donees.filter((donee) => donee._id !== id));
    } catch (error) {
      console.error("Error deleting donee:", error);
    }
  };

  const handleVerify = async (id, verified) => {
    try {
      await fetch(`http://localhost:5000/api/admin/verifyDonee/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ verified: !verified }),
      });

      setDonees(donees.map((donee) => 
        donee._id === id ? { ...donee, verified: !verified } : donee
      ));
    } catch (error) {
      console.error("Error verifying donee:", error);
    }
  };

  return (
    <Box p={5}>
      <Text fontSize="2xl" fontWeight="bold">Donees List</Text>
      {loading ? (
        <Spinner size="xl" mt={10} />
      ) : (
        <VStack spacing={4} mt={5} align="stretch">
          {donees.length > 0 ? (
            donees.map((donee) => (
              <Box key={donee._id} p={4} shadow="md" borderWidth="1px" borderRadius="md">
                <Text><strong>Name:</strong> {donee.name}</Text>
                <Text><strong>Email:</strong> {donee.email}</Text>
                <Text><strong>Phone:</strong> {donee.phone}</Text>
                <Text><strong>Address:</strong> {donee.address || "N/A"}</Text>
                <Text><strong>Latitude:</strong> {donee.location?.latitude || "N/A"}</Text>
                <Text><strong>Longitude:</strong> {donee.location?.longitude || "N/A"}</Text>
                <HStack mt={3}>
                  <Button colorScheme="blue" onClick={() => handleVerify(donee._id, donee.verified)}>
                    {donee.verified ? "Unverify" : "Verify"}
                  </Button>
                  <Button colorScheme="red" onClick={() => handleDelete(donee._id)}>Delete</Button>
                </HStack>
              </Box>
            ))
          ) : (
            <Text>No donees available</Text>
          )}
        </VStack>
      )}
    </Box>
  );
};

export default AdminDonees;
