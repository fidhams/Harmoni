import React, { useState, useEffect } from "react";
import { Box, Flex, Text, Button, VStack, HStack, Spinner } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [donors, setDonors] = useState([]);
  const [donees, setDonees] = useState([]);
  // const [volunteers, setVolunteers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const donorRes = await fetch("http://localhost:5000/api/admin/getAllDonors", { headers });
        const doneeRes = await fetch("http://localhost:5000/api/admin/getAllDonees", { headers });
        // const volunteerRes = await fetch("http://localhost:5000/api/admin/getAllVolunteers", { headers });

        const donorData = await donorRes.json();
        const doneeData = await doneeRes.json();
        // const volunteerData = await volunteerRes.json();

        setDonors(donorData);
        setDonees(doneeData);
        // setVolunteers(volunteerData);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/adminlogin");
  };

  return (
    <Flex height="100vh">
      {/* Sidebar */}
      <VStack w="250px" bg="blue.600" color="white" p={5} spacing={5} align="stretch">
        <Text fontSize="xl" fontWeight="bold">Admin Panel</Text>
        
        <Button variant="ghost" onClick={() => navigate("/admin/donors")}>Donors</Button>
        <Button variant="ghost" onClick={() => navigate("/admin/donees")}>Donees</Button>
        {/* <Button variant="ghost" onClick={() => navigate("/admin/volunteers")}>Volunteers</Button> */}
        
        <Button colorScheme="red" onClick={handleLogout}>Logout</Button>
      </VStack>

      {/* Main Content */}
      <Box flex="1" p={5}>
        <Text fontSize="2xl" fontWeight="bold">Admin Dashboard</Text>
        {loading ? (
          <Spinner size="xl" mt={10} />
        ) : (
          <HStack spacing={10} mt={5}>
            <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
              <Text fontSize="lg">Total Donors: {donors?.length || 0}</Text>
            </Box>
            <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
              <Text fontSize="lg">Total Donees: {donees?.length || 0}</Text>
            </Box>
            {/* <Box p={5} shadow="md" borderWidth="1px" borderRadius="md"> */}
              {/* <Text fontSize="lg">Total Volunteers: {volunteers?.length || 0}</Text> */}
            {/* </Box> */}
          </HStack>
        )}
      </Box>
    </Flex>
  );
};

export default AdminDashboard;
