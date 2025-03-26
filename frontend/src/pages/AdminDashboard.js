import React, { useState, useEffect } from "react";
import { Box, Flex, Text, Button, VStack, HStack, Spinner, Table } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [donors, setDonors] = useState([]);
  const [donees, setDonees] = useState([]);
  const [activeSection, setActiveSection] = useState("dashboard");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const donorRes = await fetch("http://localhost:5000/api/admin/getAllDonors", { headers });
        const doneeRes = await fetch("http://localhost:5000/api/admin/getAllDonees", { headers });

        const donorData = await donorRes.json();
        const doneeData = await doneeRes.json();

        setDonors(donorData);
        setDonees(doneeData);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeleteDonor = async (id) => {
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

  const handleDeleteDonee = async (id) => {
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/adminlogin");
  };

  return (
    <Flex height="100vh">
      {/* Sidebar */}
      <VStack w="250px" bg="blue.600" color="white" p={5} spacing={5} align="stretch">
        <Text fontSize="xl" fontWeight="bold">Admin Panel</Text>

        <Button variant="ghost" onClick={() => setActiveSection("dashboard")}>Dashboard</Button>
        <Button variant="ghost" onClick={() => setActiveSection("donors")}>Donors</Button>
        <Button variant="ghost" onClick={() => setActiveSection("donees")}>Donees</Button>

        <Button colorScheme="red" onClick={handleLogout}>Logout</Button>
      </VStack>

      {/* Main Content */}
      <Box flex="1" p={5}>
        <Text fontSize="2xl" fontWeight="bold">Admin Dashboard</Text>

        {loading ? (
          <Spinner size="xl" mt={10} />
        ) : (
          <>
            {activeSection === "dashboard" && (
              <HStack spacing={10} mt={5}>
                <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
                  <Text fontSize="lg">Total Donors: {donors.length}</Text>
                </Box>
                <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
                  <Text fontSize="lg">Total Donees: {donees.length}</Text>
                </Box>
              </HStack>
            )}

            {activeSection === "donors" && (
              <Box mt={5}>
                <Text fontSize="xl" mb={3}>Donors List</Text>
                <Table.Root variant="striped" colorScheme="blue" color="black">
                  <Table.Header>
                    <Table.Row>
                      <Table.ColumnHeader color="blue">Name</Table.ColumnHeader>
                      <Table.ColumnHeader color="blue">Email</Table.ColumnHeader>
                      <Table.ColumnHeader color="blue">Phone</Table.ColumnHeader>
                      <Table.ColumnHeader color="blue">Address</Table.ColumnHeader>
                      <Table.ColumnHeader color="blue">Badges</Table.ColumnHeader>
                      <Table.ColumnHeader color="blue">Skills</Table.ColumnHeader>
                      <Table.ColumnHeader color="blue">Skill Description</Table.ColumnHeader>
                      <Table.ColumnHeader color="blue">Joined On</Table.ColumnHeader>
                      <Table.ColumnHeader color="blue">Delete</Table.ColumnHeader>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {donors.map((donor) => (
                      <Table.Row key={donor._id}>
                        <Table.Cell>{donor.name}</Table.Cell>
                        <Table.Cell>{donor.email}</Table.Cell>
                        <Table.Cell>{donor.phone}</Table.Cell>
                        <Table.Cell>{donor.address}</Table.Cell>
                        <Table.Cell>{donor.badges.length ? donor.badges.join(", ") : "None"}</Table.Cell>
                        <Table.Cell>{donor.skills.length ? donor.skills.join(", ") : "None"}</Table.Cell>
                        <Table.Cell>{donor.description || "N/A"}</Table.Cell>
                        <Table.Cell>{new Date(donor.createdAt).toLocaleDateString()}</Table.Cell>
                        <Table.Cell><Button colorScheme="red" mt={3} onClick={() => handleDeleteDonor(donor._id)}>Delete</Button></Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>
              </Box>
            )}

            {activeSection === "donees" && (
              <Box mt={5}>
                <Text fontSize="xl" mb={3}>Donees List</Text>
                <Table.Root variant="striped" color="black">
                  <Table.Header>
                    <Table.Row>
                      <Table.ColumnHeader color="blue">Name</Table.ColumnHeader>
                      <Table.ColumnHeader color="blue">Email</Table.ColumnHeader>
                      <Table.ColumnHeader color="blue">Phone</Table.ColumnHeader>
                      <Table.ColumnHeader color="blue">Address</Table.ColumnHeader>
                      <Table.ColumnHeader color="blue">Image</Table.ColumnHeader>
                      <Table.ColumnHeader color="blue">Description</Table.ColumnHeader>
                      <Table.ColumnHeader color="blue">Registration Certificate</Table.ColumnHeader>
                      <Table.ColumnHeader color="blue">Event</Table.ColumnHeader>
                      <Table.ColumnHeader color="blue">Needs</Table.ColumnHeader>
                      <Table.ColumnHeader color="blue">Impact Stories</Table.ColumnHeader>
                      <Table.ColumnHeader color="blue">Verify</Table.ColumnHeader>
                      <Table.ColumnHeader color="blue">Delete</Table.ColumnHeader>

                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {donees.map((donee) => (
                      <Table.Row key={donee._id}>
                        <Table.Cell>{donee.name}</Table.Cell>
                        <Table.Cell>{donee.email}</Table.Cell>
                        <Table.Cell>{donee.phone}</Table.Cell>
                        <Table.Cell>{donee.address}</Table.Cell>
                        <Table.Cell>{donee.profileImage ? (
                          <img
                            src={`http://localhost:5000/uploads/${donee.profileImage}`}
                            alt="Profile"
                            style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                          />
                        ) : (
                          "N/A"
                        )}</Table.Cell>
                        <Table.Cell>{donee.description || "N/A"}</Table.Cell>
                        <Table.Cell>{donee.registrationCertificate ? (
                          <a href={`http://localhost:5000${donee.registrationCertificate}`} target="_blank" rel="noopener noreferrer">
                            View Document
                          </a>
                        ) : (
                          "N/A"
                        )}</Table.Cell>
                        <Table.Cell>{donee.Event?.length || 0}</Table.Cell>
                        <Table.Cell>{donee.Needs?.length || 0}</Table.Cell>
                        <Table.Cell>{donee.ImpactStories?.length || 0}</Table.Cell>
                        <Table.Cell><Button colorScheme="blue" onClick={() => handleVerify(donee._id, donee.verified)}>
                            {donee.verified ? "Unverify" : "Verify"}</Button></Table.Cell>
                        <Table.Cell><Button colorScheme="red" onClick={() => handleDeleteDonee(donee._id)}>Delete</Button></Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>
              </Box>
            )}
          </>
        )}
      </Box>
    </Flex>
  );
};

export default AdminDashboard;
