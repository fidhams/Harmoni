import React, { useState } from "react";
import { Box, Input, Button, Text, VStack, Heading } from "@chakra-ui/react";
import {Link, useNavigate } from "react-router-dom";

const DonorLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError(""); // Reset error before a new request

    try {
      const res = await fetch("http://localhost:5000/api/auth/donor/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Store token and navigate to donor dashboard
      localStorage.setItem("token", data.token);
      localStorage.setItem("userRole", "donor"); // ✅ Store userRole
      console.log("user:",data.userRole);

      navigate("/donordashboard");

    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Box maxW="400px" mx="auto" mt="100px" p="6" boxShadow="lg" borderRadius="md">
      <Heading textAlign="center" mb="4">Donor Login</Heading>
      
      <VStack spacing="4">
        <Input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          color="black"
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          color="black"
        />
        <Button colorScheme="blue" onClick={handleLogin}>Login</Button>
        {error && <Text color="red.500">{error}</Text>}
      </VStack>
      <div className="Signup-section">
        <p>Don't have an Account?</p>
        <Link to="/donorsignup" className="signup-button" style={{color:'green' }} >Signup as Donor</Link>
      </div>

      {/* ✅ Link to Donor Login */}
      <div className="donor-login-link">
        <p>Are you an Organisation? </p>
        <Link to="/doneelogin" className="donee-button" style={{color:'green'}} >Login as Organisation</Link>
      </div>
    </Box>
  );
};

export default DonorLogin;
