import React, { useState } from "react";
import { Box, Input, Button, Text, VStack, Heading } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";

const DoneeLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");  // Reset error before new request

    try {
      const res = await fetch("http://localhost:5000/api/auth/donee/login", {
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

      if (!data.donee.verified) {
        throw new Error("Your account is not verified. Please contact an admin.");
      }

      // Store token and navigate to donee dashboard
      localStorage.setItem("token", data.token);
      navigate("/doneedashboard");

    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Box maxW="400px" mx="auto" mt="100px" p="6" boxShadow="lg" borderRadius="md">
      <Heading textAlign="center" mb="4">Organization Login</Heading>
      
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
      <div className="login-section">
        <p>Don't have an Account?</p>
        <Link to="/doneesignup" className="signup-button" style={{color:'green' }} >Signup for Organisation</Link>
      </div>

      {/* ✅ Link to Donor Login */}
      <div className="donor-login-link">
        <p>Are you a donor? </p>
        <Link to="/donorlogin" className="donor-button" style={{color:'green'}} >Login as Donor</Link>
      </div>
    </Box>
  );
};

export default DoneeLogin;
