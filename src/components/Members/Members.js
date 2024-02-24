import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Box, Heading, ListItem, Text } from '@chakra-ui/react';
import { firestore } from '../../firebase';
import MembersInfo from '../Dashboard/MembersInfo';

const MembersComponent = () => {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchMembers = async () => {
      const membersCollection = collection(firestore, 'users');

      try {
        const querySnapshot = await getDocs(membersCollection);
        const membersData = querySnapshot.docs.map(doc => doc.data());
        setMembers(membersData);
      } catch (error) {
        console.error('Error fetching members:', error);
      }
    };

    fetchMembers();
  }, []); // Fetch on component mount

  return (
    <Box p="4" bg="white" boxShadow="md" borderRadius="md">
            <Heading as="h2" mb="4">Committee Members</Heading>
            <MembersInfo />
          </Box>
  );
};

export default MembersComponent;
