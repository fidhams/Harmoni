import React from "react";
import {Box, Text } from "@chakra-ui/react";

const NotFound = () => {


  return (
    <Box textAlign="center" p={4}>
      <Text fontSize="2xl" fontWeight="bold">
        Page Not Found
      </Text>
      <Text fontSize="lg" mt={2}>
        The page you are looking for does not exist.
      </Text>  
    </ Box>
  )
};

export default NotFound;