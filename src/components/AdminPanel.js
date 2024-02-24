import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';
import { Box, Button, List, ListItem, Text } from '@chakra-ui/react';
import { firestore } from '../firebase';

const AdminPanel = () => {
  const [unapprovedUsers, setUnapprovedUsers] = useState([]);

  useEffect(() => {
    const fetchUnapprovedUsers = async () => {
      const usersCollection = collection(firestore, 'users');
      const unapprovedUsersQuery = query(usersCollection, where('approved', '==', false));

      try {
        const querySnapshot = await getDocs(unapprovedUsersQuery);
        const unapprovedUsers = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUnapprovedUsers(unapprovedUsers);
      } catch (error) {
        console.error('Error fetching unapproved users:', error);
      }
    };

    fetchUnapprovedUsers();
  }, []); // Fetch on component mount

  const handleApprove = async userId => {
    const userDocRef = doc(firestore, 'users', userId);

    try {
      await updateDoc(userDocRef, { approved: true });
      setUnapprovedUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Error approving user:', error);
    }
  };

  return (
    <Box maxW="600px" mx="auto" p="4">
      <Box textAlign="center" mb="4">
        <Text fontSize="xl" fontWeight="bold">
          Admin Panel
        </Text>
      </Box>
      <Box mb="4">
        <Text fontSize="lg" fontWeight="bold" mb="2">
          Unapproved Users
        </Text>
        <List spacing={3}>
          {unapprovedUsers.map(user => (
            <ListItem key={user.id} p="4" borderRadius="md" boxShadow="md" bg="gray.100">
              <Text>Email: {user.email}</Text>
              <Button colorScheme="green" onClick={() => handleApprove(user.id)}>
                Approve
              </Button>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default AdminPanel;
