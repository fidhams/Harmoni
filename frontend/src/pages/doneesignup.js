import React, { useState } from "react";
import { Box, Text, VStack, Input, Button } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";

const DoneeSignup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    registrationCertificate: null, // Store file here
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    if (e.target.name === "registrationCertificate") {
      setFormData({ ...formData, registrationCertificate: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    try {
      const res = await fetch("http://localhost:5000/api/auth/donee/signup", {
        method: "POST",
        body: formDataToSend, // Send FormData
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Application Successful. Wait for Verification! Redirecting...");
        setTimeout(() => navigate("/doneelogin"), 2000);
      } else {
        setMessage(data.error || "Signup failed");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxW="400px" mx="auto" mt={10} p={5} shadow="md" borderWidth="1px" borderRadius="md">
      <Text fontSize="2xl" fontWeight="bold" mb={3}>Organisation Signup</Text>

      {message && (
        <Text color={message.includes("Successful") ? "green.500" : "red.500"} mb={3}>
          {message}
        </Text>
      )}

      <VStack as="form" spacing={3} onSubmit={handleSubmit}>
        <Input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required color="black" />
        <Input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required color="black" />
        <Input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required color="black" />
        <Input type="tel" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required color="black" />
        <Input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} required color="black" />
        
        {/* File Upload for Registration Certificate */}
        <Input type="file" name="registrationCertificate" onChange={handleChange} accept=".pdf,.jpg,.png" required color="black" />

        <Button variant="ghost" type="submit" colorScheme="blue" isLoading={loading} width="full">
          Sign Up
        </Button>
      </VStack>

      <div className="login-section">
        <p>Already have an Account?</p>
        <Link to="/doneelogin" className="login-button" style={{ color: "green" }}>Login for Organisation</Link>
      </div>

      <div className="donor-login-link">
        <p>Are you a donor? </p>
        <Link to="/donorlogin" className="donor-button" style={{ color: "green" }}>Login as Donor</Link>
      </div>
    </Box>
  );
};

export default DoneeSignup;
