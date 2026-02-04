import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { VStack, Input, Textarea, Button, Box, Text } from "@chakra-ui/react";

const categories = ["Clothes", "Food", "Books", "Electronics", "Stationary", "Others"];

const NeedForm = ({ isEditing }) => {
  const { needId } = useParams();
  const navigate = useNavigate();
  const [needData, setNeedData] = useState({
    itemName: "",
    category: "Clothes",
    quantity: 1,
    description: "",
    fulfilled: false,
  });

  useEffect(() => {
    if (isEditing && needId) {
      const fetchNeed = async () => {
        try {
          const res = await fetch(`http://localhost:5000/api/donee/needs/${needId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          });
          if (!res.ok) throw new Error("Failed to fetch need details");
          const data = await res.json();
          setNeedData(data);
        } catch (error) {
          console.error("Error fetching need:", error);
        }
      };
      fetchNeed();
    }
  }, [isEditing, needId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNeedData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = isEditing ? "PUT" : "POST";
      const url = isEditing 
        ? `http://localhost:5000/api/donee/needs/${needId}` 
        : "http://localhost:5000/api/donee/needs";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(needData),
      });

      if (!res.ok) throw new Error("Failed to save need");
      alert(isEditing ? "Need updated successfully!" : "Need added successfully!");
      navigate("/doneedashboard");
    } catch (error) {
      console.error("Error saving need:", error);
      alert("Error saving need. Please try again.");
    }
  };

  return (
    <VStack spacing={5} p={5} align="start">
      <Box>
        <Text fontWeight="bold" color="black">Item Name</Text>
        <Input name="itemName" value={needData.itemName} onChange={handleChange} color="black" border="1px solid black" />
      </Box>

      <Box>
        <Text fontWeight="bold" color="black">Category</Text>
        <select name="category" value={needData.category} onChange={handleChange} style={{ width: "100%", padding: "8px", border: "1px solid black", borderRadius: "5px" }}>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </Box>

      <Box>
        <Text fontWeight="bold" color="black">Quantity</Text>
        <Input type="number" name="quantity" value={needData.quantity} onChange={handleChange} color="black" border="1px solid black" />
      </Box>

      <Box>
        <Text fontWeight="bold" color="black">Description</Text>
        <Textarea name="description" value={needData.description} onChange={handleChange} color="black" border="1px solid black" />
      </Box>

      {isEditing && (
        <Box>
          <Text fontWeight="bold" color="black">Mark as Fulfilled</Text>
          <input type="checkbox" name="fulfilled" checked={needData.fulfilled} onChange={handleChange} style={{ marginLeft: "10px" }} />
        </Box>
      )}

      <Button colorPalette="blue" onClick={handleSubmit}>{isEditing ? "Update Need" : "Add Need"}</Button>
      <Button colorPalette="gray" onClick={() => navigate("/doneedashboard")}>Cancel</Button>
    </VStack>
  );
};

export const AddNeed = () => <NeedForm isEditing={false} />;
export const EditNeed = () => <NeedForm isEditing={true} />;
