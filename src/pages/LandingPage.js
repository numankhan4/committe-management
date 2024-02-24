import React from 'react';
import { Box, Button, Heading, Text, Link as ChakraLink } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <Box
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      textAlign="center"
      colorScheme="teal"
      p={8}
    >
      <Heading as="h1" fontSize="4xl" mb={4}>
        Collective Savings Alliance
      </Heading>
      <Text fontSize="lg" mb={8}>
        Empowering Tomorrow's Wealth, One Contribution at a Time
      </Text>
      <Box className="buttons">
        <Link to="/login">
          <Button colorScheme="blue" size="lg" mr={4}>
            Log In
          </Button>
        </Link>
        <Link to="/register">
          <Button colorScheme="teal" size="lg">
            Register
          </Button>
        </Link>
      </Box>
    </Box>
  );
};

export default LandingPage;
