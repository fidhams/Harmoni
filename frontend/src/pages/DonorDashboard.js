import React, { useState, useEffect } from "react";
import { 
  Box, Text, Button, VStack, Spinner, Image, Wrap, WrapItem, Flex, Badge, Grid, GridItem, Stat, Tag, TagLabel, Heading, Avatar, Card,
  Separator
} from "@chakra-ui/react";
import { FaUserAlt, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const DonorDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [donations, setDonations] = useState([]);
  const [error, setError] = useState("");
  const [profileData, setProfileData] = useState(null);
  const navigate = useNavigate();
  const BASE_URL = "http://localhost:5000/uploads/";
  const [user, setUser] = useState(null);

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
        setProfileData(data);
        setUser(data._id);

        if (Array.isArray(data.donations)) {
          setDonations(data.donations);
        } else {
          setDonations([]);
        }
      } catch (error) {
        console.error("Error fetching donor dashboard data:", error);
        setError("Session Expired. Please login again.");
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

  const calculateProfileCompletion = () => {
    if (!profileData) return 0;
    
    const fields = ['name', 'email', 'phone', 'address',  'skills'];
    let completed = 0;
    
    fields.forEach(field => {
      if (field === 'skills') {
        if (profileData.skills && profileData.skills.length > 0) completed++;
      } else if (profileData[field]) completed++;
    });
    
    return Math.round((completed / fields.length) * 100);
  };

  return (
    <VStack height="100vh" spacing={6} p={5} align="stretch" maxW="1200px" mx="auto">
      <Text fontSize="2xl" fontWeight="bold" textAlign="center">Donor Dashboard</Text>

      {error && <Text color="red.500" textAlign="center">{error}</Text>}

      {loading ? (
        <Spinner size="xl" alignSelf="center" />
      ) : (
        <>
          <Flex gap={3} wrap="wrap" justifyContent="center">
            <Button colorPalette="blue" onClick={() => navigate("/donor/edit-profile")}>
              Edit Profile
            </Button>
            <Button colorPalette="green" onClick={() => navigate("/post-donation")}>
              Post a New Donation
            </Button>
            <Button colorPalette="purple" onClick={() => navigate(`/donor/chats/${user}`)}>
              View Chats
            </Button>
          </Flex>

          <Card.Root variant="outline" mb={6} colorPalette="cyan">
            <Card.Header bg="blue.50">
              <Heading size="md">Your Profile</Heading>
            </Card.Header>
            <Card.Body backgroundColor="#182b49">
              <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
                {/* Left Column - Basic Info */}
                <GridItem>
                  <VStack align="stretch" spacing={3}>
                    <Flex align="center">
                      <Box mr={2}>
                        <FaUserAlt />
                      </Box>
                      <Text fontWeight="bold" color="#61dafb">Name:</Text>
                      <Text ml={2} color="white">{profileData?.name}</Text>
                    </Flex>
                    <Flex align="center">
                      <Box mr={2}>
                        <FaEnvelope />
                      </Box>
                      <Text fontWeight="bold" color="#61dafb">Email:</Text>
                      <Text ml={2} color="white">{profileData?.email}</Text>
                    </Flex>
                    <Flex align="center">
                      <Box mr={2}>
                        <FaPhone />
                      </Box>
                      <Text fontWeight="bold" color="#61dafb">Phone:</Text>
                      <Text ml={2} color="white">{profileData?.phone}</Text>
                    </Flex>
                    <Flex align="center">
                      <Box mr={2}>
                        <FaMapMarkerAlt />
                      </Box>
                      <Text fontWeight="bold" color="#61dafb">Address:</Text>
                      <Text ml={2} color="white">{profileData?.address || "Not provided"}</Text>
                    </Flex>
                    {profileData?.description && (
                      <Box>
                        <Text fontWeight="bold" color="#61dafb">Description:</Text>
                        <Text color="white">{profileData.description}</Text>
                      </Box>
                    )}
                  </VStack>
                </GridItem>

                {/* Right Column - Stats & Skills */}
                <GridItem>
                  {/* <StatGroup mb={4}> */}
                    <Stat.Root>
                      <Stat.Label>Donations</Stat.Label>
                      <Stat.ValueText color="#61dafb">{donations.length || 0}</Stat.ValueText>
                    </Stat.Root>
                    {/* <Stat.Root>
                      <Stat.Label>Volunteer Hours</Stat.Label>
                      <Stat.ValueText color="#61dafb">{profileData?.volunteerHours || 0}</Stat.ValueText>
                    </Stat.Root> */}
                    <Stat.Root>
                      <Stat.Label>Profile</Stat.Label>
                      <Stat.ValueText color="#61dafb">{profileData?.profileCompletionPercentage || calculateProfileCompletion()}%</Stat.ValueText>
                    </Stat.Root>
                  {/* </StatGroup> */}
                  
                  <Separator my={3} />
                  
                  <Text fontWeight="bold" mb={2}>Skills:</Text>
                  <Wrap>
                    {profileData?.skills && profileData.skills.length > 0 ? (
                      profileData.skills.map((skill, index) => (
                        <WrapItem key={index}>
                          <Tag.Root size="md" colorScheme="blue" borderRadius="full">
                            <Tag.Label>{skill}</Tag.Label>
                          </Tag.Root>
                        </WrapItem>
                      ))
                    ) : (
                      <Text color="gray.500">No skills added yet</Text>
                    )}
                  </Wrap>
                </GridItem>
              </Grid>
            </Card.Body>
          </Card.Root>

          <Text fontSize="2xl" fontWeight="bold" mt={5} textAlign="center">Your Donations</Text>

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
                    height="60vh"
                  >
                    {/* Status Badge in Top-Right Corner */}
                    <Badge 
                      colorPalette={getStatusBadgeColor(donation.status)} 
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
                        colorPalette="red"
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

      {/* <Button colorPalette="red" onClick={handleLogout}>Logout</Button> */}
      {/* Example usage in donor dashboard */}
      {/* <Chat senderType="donor" senderId={donor._id} receiverType="donee" receiverId={selectedDoneeId} /> */}

    </VStack>
  );
};

export default DonorDashboard;