import React, { useState, useEffect } from "react";
import { Box, Text, Button, VStack, HStack, Spinner, Input, Textarea, Select, Image } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const DonorDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [donations, setDonations] = useState([]);
  // const [events, setEvents] = useState([]);
  const [newDonation, setNewDonation] = useState({ item: "", category: "", quantity: "", description: "", image: null });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/donor/dashboard", {
          method: "GET",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        
        const data = await res.json();
        console.log("Dashboard Data:", data);
        console.log("Donations:",data.donations);
        setDonations(Array.isArray(data.donations) ? data.donations : []);
        // setEvents(Array.isArray(data.events) ? data.events : []);
      } catch (error) {
        console.error("Error fetching donor dashboard data:", error);
        setDonations([]);
        // setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/donorlogin");
  };

  const handleNewDonationChange = (e) => {
    const { name, value } = e.target;
    setNewDonation((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setNewDonation((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handlePostDonation = async () => {
    try {
      const formData = new FormData();
      formData.append("item", newDonation.item);
      formData.append("category", newDonation.category);
      formData.append("quantity", newDonation.quantity);
      formData.append("description", newDonation.description);
      if (newDonation.image) {
        formData.append("image", newDonation.image);
      }

      const res = await fetch("http://localhost:5000/api/donor/post-donation", {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setDonations((prev) => [...prev, data.donation]);
        setNewDonation({ item: "", category: "", quantity: "", description: "", image: null });
      }
    } catch (error) {
      console.error("Error posting donation:", error);
    }
  };

  const handleDeleteDonation = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/donor/delete-donation/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.ok) {
        setDonations((prev) => prev.filter((donation) => donation._id !== id));
      }
    } catch (error) {
      console.error("Error deleting donation:", error);
    }
  };

  return (
    <VStack height="100vh" spacing={5} p={5}>
      <Text fontSize="2xl" fontWeight="bold">Donor Dashboard</Text>
      {loading ? (
        <Spinner size="xl" />
      ) : (
        <>
          <Button colorScheme="blue" onClick={() => navigate("/donor/edit-profile")}>
            Edit Profile
          </Button>

          <Text fontSize="xl" fontWeight="bold" mt={5}>Post a New Donation</Text>
          <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
            <Input placeholder="Item Name" name="item" value={newDonation.item} onChange={handleNewDonationChange} />
            <Select placeholder="Select Category" name="category" value={newDonation.category} onChange={handleNewDonationChange} mt={2}>
              <option value="Clothes">Clothes</option>
              <option value="Food">Food</option>
              <option value="Books">Books</option>
              <option value="Electronics">Electronics</option>
            </Select>
            <Input placeholder="Quantity" name="quantity" value={newDonation.quantity} onChange={handleNewDonationChange} mt={2} />
            <Textarea placeholder="Description" name="description" value={newDonation.description} onChange={handleNewDonationChange} mt={2} />
            <Input type="file" name="image" onChange={handleImageChange} mt={2} />
            <Button colorScheme="green" mt={2} onClick={handlePostDonation}>Post Donation</Button>
          </Box>

          <Text fontSize="xl" fontWeight="bold" mt={5}>Your Donations</Text>
          {Array.isArray(donations) && donations.length > 0 ? (
            donations.map((donation) => (
              <Box key={donation._id} p={5} shadow="md" borderWidth="1px" borderRadius="md">
                <Text fontSize="lg">{donation.item}</Text>
                <Text>Category: {donation.category}</Text>
                <Text>Quantity: {donation.quantity}</Text>
                <Text>{donation.description}</Text>
                {donation.image && <Image src={`http://localhost:5000/uploads/${donation.image}`} alt={donation.item} mt={2} />}
                {donation.status === "pending" && (
                  <Button colorScheme="red" mt={2} onClick={() => handleDeleteDonation(donation._id)}>Delete Donation</Button>
                )}
              </Box>
            ))
          ) : (
            <Text>No donations posted yet.</Text>
          )}
        </>
      )}
      <Button colorScheme="red" onClick={handleLogout}>Logout</Button>
    </VStack>
  );
};

export default DonorDashboard;
