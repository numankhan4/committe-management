import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Text,
  Avatar,
  Flex,
  useToast,
  Button,
} from '@chakra-ui/react';
import { collection, doc, getDocs, updateDoc } from 'firebase/firestore';
import { firestore } from '../../firebase';
import { AuthContext } from '../../context/UserContext';

const CurrentBeneficiary = () => {
  const { userRole } = useContext(AuthContext);
  const [currentBeneficiary, setCurrentBeneficiary] = useState(null);
  const toast = useToast();

  useEffect(() => {
    const fetchCurrentBeneficiary = async () => {
      try {
        // Fetch users collection
        const usersCollection = collection(firestore, 'users');
        const querySnapshot = await getDocs(usersCollection);
        const usersList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        // Find the user with position equal to current month
        const currentDate = new Date();
        const currentMonthYear = currentDate.toISOString().slice(0, 7); // Format: YYYY-MM
        const currentUser = usersList.find(user => user.position === currentMonthYear);

        const userDocRef = doc(firestore, 'users', currentUser.id);
        if (currentUser) {
          await updateDoc(userDocRef, { currentPosition: true });
        }

        setCurrentBeneficiary(currentUser);
      } catch (error) {
        console.error('Error fetching current beneficiary:', error.message);
        toast({
          title: 'Error',
          description: 'An error occurred while fetching current beneficiary. Please try again.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };

    fetchCurrentBeneficiary();
  }, [toast]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied to clipboard',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <>
      {currentBeneficiary ? (
        <Box
          bg="gray.100" // Background color
          boxShadow="md"
          borderRadius="lg"
          p={6}
          mb={6}
        >
          <Flex align="center">
            <Avatar name={currentBeneficiary.name} src={currentBeneficiary.profilePictureUrl} size="xl" mr={4} />
            <Box>
              <Text fontWeight="bold" fontSize="2xl" mb={2}>Current Beneficiary</Text>
              <Text fontSize="xl" fontWeight="bold" color="teal.500">{currentBeneficiary.name}</Text> {/* Text color */}
              <Text>{currentBeneficiary.email}</Text>
              <Text>{currentBeneficiary.phone ? currentBeneficiary.phone : <Text color="gray.500">Please set phone number.</Text>}</Text>
              <Text>{currentBeneficiary.accountInfo ? currentBeneficiary.accountInfo : <Text color="gray.500">Please set account detail.</Text>}</Text>
              {currentBeneficiary.accountInfo && (
                <Button colorScheme="teal" size="sm" mt={2} onClick={() => copyToClipboard(currentBeneficiary.accountInfo)}>Copy Account Details</Button>
              )}
            </Box>
          </Flex>
        </Box>
      ) : (
        <Text>No beneficiary set for this month.</Text>
      )}
    </>
  );
};

export default CurrentBeneficiary;
