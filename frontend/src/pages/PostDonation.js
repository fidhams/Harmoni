import React, { useState } from "react";
import { Box, Input, Button, Textarea, VStack, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const PostDonation = () => {
  const [newDonation, setNewDonation] = useState({
    item: "",
    category: "",
    quantity: "",
    description: "",
    image: null
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const categories = ["Clothes", "Food", "Books", "Electronics", "Stationary", "Others"];

  const handleNewDonationChange = (e) => {
    const { name, value } = e.target;
    setNewDonation({ ...newDonation, [name]: value });
  };

  const handleImageChange = (e) => {
    if (e.target.files.length > 0) {
      setNewDonation({ ...newDonation, image: e.target.files[0] });
    }
  };

  const handlePostDonation = async () => {
    if (!newDonation.item || !newDonation.category || !newDonation.quantity || !newDonation.description) {
      setError("All fields are required.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      Object.entries(newDonation).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      console.log("Sending Data:", [...formData.entries()]);


      const res = await fetch("http://localhost:5000/api/donor/post-donation", {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: formData
      });

      if (res.ok) {
        setNewDonation({ item: "", category: "", quantity: "", description: "", image: null });
        navigate("/donordashboard");
        
      } else {
        const errorData = await res.json();
        setError(errorData.message || "Failed to post donation.");
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxW="400px" mx="auto" mt={10} p={5} shadow="md" borderWidth="1px" borderRadius="md">
      <Text fontSize="2xl" fontWeight="bold" mb={3}>Post a New Donation</Text>

      {error && <Text color="red.500" mb={3}>{error}</Text>}

      <VStack spacing={3}>
        <Input type="text" placeholder="Item Name" name="item" value={newDonation.item} onChange={handleNewDonationChange} style={{color:"black"}} />
        
        {/* Fixed Select Component - Using simple HTML select instead */}
        <select 
          name="category"
          value={newDonation.category}
          onChange={handleNewDonationChange}
          style={{
            width: "100%",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            fontSize: "16px",
            backgroundColor: "white",
            color: "Black"
          }}
        >
          <option value="" disabled>Select Category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <Input 
            type="number" 
            placeholder="Quantity" 
            name="quantity" 
            value={newDonation.quantity} 
            onChange={handleNewDonationChange} 
            min="1"
            style={{ color: "black" }} 
        />
        <Textarea placeholder="Description" name="description" value={newDonation.description} onChange={handleNewDonationChange} style={{color:"black"}} />
        <Input type="file" name="image" onChange={handleImageChange} style={{color:"black"}} />
        {/* Image Preview (Only if an image is selected) */}
        {newDonation.image && (
        <img 
            src={URL.createObjectURL(newDonation.image)} 
            alt="Preview" 
            style={{ width: "100%", height: "auto", borderRadius: "5px", marginTop: "10px" }} 
        />
        )}

        <Button colorScheme="green" onClick={handlePostDonation} isLoading={loading}>Post Donation</Button>
        <Button colorScheme="gray" onClick={() => navigate("/donordashboard")} isDisabled={loading}>Cancel</Button>
      </VStack>
    </Box>
  );
};

export default PostDonation;
