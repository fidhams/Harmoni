import React, { useState, useEffect } from "react";
import { Box, Text, Input, Button, VStack, HStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const skillCategories = [
  "Companionship and Support",
  "Mentoring and Tutoring",
  "Activities or Event Management",
  "Health and Wellness Support",
  "Advocacy and Outreach",
  "Special Projects",
  "Others",
];

const EditProfile = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    phone: "",
    skills: [],
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/donor/profile", {
          method: "GET",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await res.json();
        setFormData({
          name: data.name,
          email: data.email,
          password: "",
          address: data.address || "",
          phone: data.phone,
          skills: data.skills || [],
        });
      } catch (error) {
        setError("Error loading profile. Please try again.");
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSkillAdd = (e) => {
    const skill = e.target.value;
    if (skill && !formData.skills.includes(skill)) {
      setFormData({ ...formData, skills: [...formData.skills, skill] });
    }
  };

  const handleSkillRemove = (skill) => {
    setFormData({ ...formData, skills: formData.skills.filter((s) => s !== skill) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/donor/edit-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Failed to update profile");
      }

      navigate("/donordashboard");
    } catch (error) {
      setError("Error updating profile. Please try again.");
    }
  };

  return (
    <VStack spacing={5} p={5} align="center">
      <Text fontSize="2xl" fontWeight="bold">Edit Profile</Text>
      {error && <Text color="red.500">{error}</Text>}

      <Input placeholder="Name" name="name" value={formData.name} onChange={handleChange} style={{ color: "black" }} />
      <Input placeholder="Email" name="email" value={formData.email} disabled style={{ color: "black" }} />
      <Input placeholder="New Password" type="password" name="password" value={formData.password} onChange={handleChange} style={{ color: "black" }} />
      <Input placeholder="Address" name="address" value={formData.address} onChange={handleChange} style={{ color: "black" }} />
      <Input placeholder="Phone" name="phone" value={formData.phone} onChange={handleChange} style={{ color: "black" }} />

      <Text>Skills:</Text>
      <select onChange={handleSkillAdd}>
        <option value="">Select a skill</option>
        {skillCategories.map((skill) => (
          <option key={skill} value={skill}>{skill}</option>
        ))}
      </select>

      <HStack wrap="wrap">
        {formData.skills.map((skill) => (
          <Box key={skill} bg="blue.500" color="white" px={3} py={1} borderRadius="md" display="flex" alignItems="center">
            <Text mr={2}>{skill}</Text>
            <Button size="xs" bg="red.500" color="white" onClick={() => handleSkillRemove(skill)}>X</Button>
          </Box>
        ))}
      </HStack>

      <HStack>
        <Button colorScheme="green" onClick={handleSubmit}>Save Changes</Button>
        <Button colorScheme="red" onClick={() => navigate("/donordashboard")}>Cancel</Button>
      </HStack>
    </VStack>
  );
};

export default EditProfile;
