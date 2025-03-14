import React, { useState } from "react";
//import "../styles/login.css";
import { Link, useNavigate } from "react-router-dom";
import { Button, Card, Field, Input, Stack } from "@chakra-ui/react"

const DonorLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();



  const handleSubmit = async (e) => {

    e.preventDefault(); // Prevents page reload

    try {
      const response = await fetch("http://localhost:5000/api/auth/donor/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        navigate("/donordashboard");
        console.log("logged",data);
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="main-container"  >
      <Card.Root maxW="sm">
        

      {error && <p className="error">{error}</p>}

      <Card.Header>
      <Card.Title>Login</Card.Title>
      <Card.Description>
        Login for donor and volunteers
      </Card.Description>
      </Card.Header>
        
      <form onSubmit={handleSubmit} style={{backgroundColor: 'black'}}>
      <Card.Body>
      <Stack gap="4" w="full">

        <Field.Root>

          <Field.Label>Email</Field.Label>
            <Input type="email" name="email" placeholder="Enter your email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </Field.Root>
        <Field.Root>
          <Field.Label>Password</Field.Label>
            <Input type="password" name="password" placeholder="Enter your password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </Field.Root>
          
      </Stack>
      </Card.Body>
        <Button variant="solid" type="submit"  >
          <span >Login</span>
        </Button>
      </form>
      </Card.Root>
      <div className="signup-section">
        <p>Don't have an account?</p>
        <Link to="/donorsignup" className="signup-button">Sign Up</Link>
      </div>
      <div>
        <p>Are you an organization? </p>
        <Link to="/doneelogin" className="signup-button">Login as Organisation</Link>
      </div>
    </div>
  );
};

export default DonorLogin;
