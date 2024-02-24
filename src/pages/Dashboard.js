import React, {useContext} from 'react';
import {
  Box,
  Flex,
  Spacer,
  VStack,
  HStack,
  Text,
  Button,
} from '@chakra-ui/react';
import { AuthContext } from '../context/UserContext';

const Dashboard = () => {
  const { currentUser, logOut } = useContext(AuthContext); // Replace with your authentication context functions

  const handleLogout = async () => {
    try {
      await logOut();
      // Redirect to the login page or handle the logout success as needed
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

  return (
    <Flex>
      {/* Side Navigation */}
      <VStack
        align="left"
        justify="start"
        p={4}
        bg="gray.200"
        w="200px"
        minH="100vh"
      >
        {/* Add your side navigation links or components here */}
        <Text>Dashboard</Text>
        <Text>Analytics</Text>
        <Text>Settings</Text>
      </VStack>

      {/* Main Content */}
      <Box flex="1" p={4}>
        {/* Header */}
        <Flex align="center" justify="space-between">
          <Text fontSize="xl" fontWeight="bold">
            Welcome, {currentUser ? currentUser.displayName : 'Guest'}
          </Text>
          <HStack spacing={4}>
            {/* Add any additional header components here */}
            <Button colorScheme="blue">Notifications</Button>
            <Button onClick={handleLogout} colorScheme="red">
              Logout
            </Button>
          </HStack>
        </Flex>

        {/* Main Content */}
        <Box mt={4}>
          {/* Add your main dashboard content here */}
          <Text>Main Dashboard Content Goes Here</Text>
        </Box>
      </Box>
    </Flex>
  );
};

export default Dashboard;
