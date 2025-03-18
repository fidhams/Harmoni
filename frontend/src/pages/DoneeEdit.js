import React, { useState, useEffect } from "react";
import { Box, Input, Button, Textarea, VStack, Text, Image } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const DoneeProfile = () => {
  const [profile, setProfile] = useState({
    name: "",
    phone: "",
    address: "",
    description: "",
    latitude: "",
    longitude: "",
    password: "",
    profileImage: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/donee/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Response Data:", res.data); // Debugging log

        if (res.status === 200 && res.data && res.data.profile) {
          setProfile({
            ...res.data.profile,
            password: "",
            latitude: res.data.profile?.location?.latitude || "",
            longitude: res.data.profile?.location?.longitude || "",
            profileImage: null,
          });

          if (res.data.profile.profileImage) {
            setImagePreview(`http://localhost:5000/uploads/${res.data.profile.profileImage}`);
          }
        } else {
          console.error("Unexpected response structure:", res);
        }
      } catch (error) {
        console.error("Error fetching profile:", error.response ? error.response.data : error.message);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files.length > 0) {
      setProfile({ ...profile, profileImage: e.target.files[0] });
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      Object.entries(profile).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      const res = await axios.put("http://localhost:5000/api/donee/profile", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Update Profile Response:", res); // Debugging log

      if (res.status === 200) {
        navigate("/doneedashboard");
      } else {
        console.error("Unexpected update response:", res);
        setError("Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error.response ? error.response.data : error.message);
      setError("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxW="400px" mx="auto" mt={10} p={5} shadow="md" borderWidth="1px" borderRadius="md">
      <Text fontSize="2xl" fontWeight="bold" mb={3} color="black">Edit Profile</Text>
      {error && <Text color="red.500" mb={3}>{error}</Text>}
      
      <VStack spacing={3} as="form" onSubmit={handleSubmit}>
        {imagePreview ? (
          <Image src={imagePreview} alt="Profile" boxSize="150px"  />
        ) : (
          <Text color="black">No image available</Text>
        )}

        <Input type="file" onChange={handleImageChange} />
        <Input type="text" placeholder="Name" name="name" value={profile.name} onChange={handleChange} color="black" />
        <Input type="text" placeholder="Phone" name="phone" value={profile.phone} onChange={handleChange} color="black" />
        <Input type="text" placeholder="Address" name="address" value={profile.address} onChange={handleChange} color="black" />
        <Textarea placeholder="Description" name="description" value={profile.description} onChange={handleChange} color="black" />
        <Input type="text" placeholder="Latitude" name="latitude" value={profile.latitude} onChange={handleChange} color="black" />
        <Input type="text" placeholder="Longitude" name="longitude" value={profile.longitude} onChange={handleChange} color="black" />
        <Input type="password" placeholder="New Password (optional)" name="password" value={profile.password} onChange={handleChange} color="black" />

        <Button colorScheme="green" type="submit" isLoading={loading}>Update Profile</Button>
        <Button colorScheme="gray" onClick={() => navigate("/doneedashboard")} isDisabled={loading}>Cancel</Button>
      </VStack>
    </Box>
  );
};

export default DoneeProfile;
