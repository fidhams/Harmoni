import React, { useState } from "react";
import { Box, Button, Input, Textarea, VStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const AddImpactStory = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/impact-stories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ title, description, image }),
      });

      if (!res.ok) throw new Error("Failed to upload impact story");

      navigate("/donee-dashboard");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <VStack spacing={5} p={5}>
      <Text fontSize="2xl" fontWeight="bold">Add Impact Story</Text>
      <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <Textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <Input placeholder="Image URL" value={image} onChange={(e) => setImage(e.target.value)} />
      <Button colorScheme="green" onClick={handleSubmit}>Submit</Button>
    </VStack>
  );
};

export default AddImpactStory;
