import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { VStack, Input, Textarea, Button, Box, Text, Image } from "@chakra-ui/react";

const ImpactStoryForm = ({ isEditing }) => {
  const { storyId } = useParams();
  const navigate = useNavigate();
  const [storyData, setStoryData] = useState({
    title: "",
    description: "",
    image: ""
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (isEditing && storyId) {
      const fetchStory = async () => {
        try {
          const res = await fetch(`http://localhost:5000/api/donee/storybyid/${storyId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          });
          if (!res.ok) throw new Error("Failed to fetch story");
          const data = await res.json();
          console.log("impactstory",data);
          setStoryData({
            title: data.title || "",
            description: data.description || "",
            image: data.image || "",
          });
  
          setImagePreview(`http://localhost:5000/uploads/${data.image}` || null);
        } catch (error) {
          console.error("Error fetching story:", error);
        }
      };
      fetchStory();
    }
  }, [isEditing, storyId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStoryData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", storyData.title);
      formData.append("description", storyData.description);
      if (imageFile) formData.append("image", imageFile);

      const method = isEditing ? "PUT" : "POST";
      const url = isEditing 
        ? `http://localhost:5000/api/donee/story/${storyId}` 
        : "http://localhost:5000/api/donee/story";

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to save impact story");
      alert(isEditing ? "Impact Story updated successfully!" : "Impact Story added successfully!");
      navigate("/doneedashboard");
    } catch (error) {
      console.error("Error saving story:", error);
      alert("Error saving story. Please try again.");
    }
  };

  return (
    <VStack spacing={5} p={5} align="start">
      <Box>
        <Text fontWeight="bold" color="black">Title</Text>
        <Input name="title" value={storyData.title} onChange={handleChange} color="black" border="1px solid black" />
      </Box>

      <Box>
        <Text fontWeight="bold" color="black">Description</Text>
        <Textarea name="description" value={storyData.description} onChange={handleChange} color="black" border="1px solid black" />
      </Box>

      <Box>
        <Text fontWeight="bold" color="black">Upload Image</Text>
        <Input type="file" onChange={handleImageChange} color="black" border="1px solid black" />
        {imagePreview && <Image src={imagePreview} alt="Uploaded" boxSize="200px" mt={2} borderRadius="md" />}
      </Box>

      <Button colorPalette="blue" onClick={handleSubmit}>{isEditing ? "Update Story" : "Add Story"}</Button>
      <Button colorPalette="gray" onClick={() => navigate("/doneedashboard")}>Cancel</Button>
    </VStack>
  );
};

export const AddImpactStory = () => <ImpactStoryForm isEditing={false} />;
export const EditImpactStory = () => <ImpactStoryForm isEditing={true} />;
