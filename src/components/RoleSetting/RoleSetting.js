import React, { useState, useEffect } from 'react';
import {
  Box,
  Text,
  Button,
  FormControl,
  Input,
  useToast,
  IconButton,
  Stack,
} from '@chakra-ui/react';
import { collection, doc, getDocs, getDoc, setDoc, updateDoc, deleteField } from 'firebase/firestore';
import { firestore } from '../../firebase';

const RoleSetting = () => {
  const [roleInputs, setRoleInputs] = useState({});
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const toast = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(firestore, 'users');
        const querySnapshot = await getDocs(usersCollection);
        const userList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setUsers(userList);
      } catch (error) {
        console.error('Error fetching users:', error.message);
        toast({
          title: 'Error',
          description: 'An error occurred while fetching users. Please try again.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };

    fetchUsers();
  }, [toast]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const rolesCollection = collection(firestore, 'roles');
        const querySnapshot = await getDocs(rolesCollection);
        const fetchedRoles = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    
        // Filter out roles where users array is undefined
        const validRoles = fetchedRoles.filter(role => role && role.users);
    
        setRoles(validRoles);
    
        const roleInputsData = {};
        // Loop through users to fetch their roles from the roles collection
        for (const user of users) {
          const userRoles = validRoles.filter(role => role.users.some(u => u.id === user.id));
          const roleNames = userRoles.map(role => role.name).join(', ');
          // Store the user's roles under their ID key
          roleInputsData[user.id] = roleNames;
        }
        
        setRoleInputs(roleInputsData);
      } catch (error) {
        console.error('Error fetching roles:', error.message);
        toast({
          title: 'Error',
          description: 'An error occurred while fetching roles. Please try again.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };
    
  
    fetchRoles();
  }, [toast, users]);
  
  

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const rolesCollection = collection(firestore, 'roles');
        const querySnapshot = await getDocs(rolesCollection);
        const fetchedRoles = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setRoles(fetchedRoles);
        
        const roleInputsData = {};
        users.forEach((user) => {
          const userRoles = fetchedRoles.filter(role => role.users.some(u => u.id === user.id));
          const roleNames = userRoles.map(role => role.name).join(', ');
          roleInputsData[user.id] = roleNames;
        });
        setRoleInputs(roleInputsData);
      } catch (error) {
        console.error('Error fetching roles:', error.message);
        toast({
          title: 'Error',
          description: 'An error occurred while fetching roles. Please try again.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };

    fetchRoles();
  }, [toast, users]);

  const handleInputChange = (userId, value) => {
    setRoleInputs((prevInputs) => ({
      ...prevInputs,
      [userId]: value,
    }));
  };

  const handleUpdateRole = async (userId, userEmail) => {
    try {
      const userRoles = roleInputs[userId].split(',').map((role) => role.trim());
      const userRoleDocs = await Promise.all(
        userRoles.map(async (roleName) => {
          const roleDocRef = doc(firestore, 'roles', roleName);
          const roleSnapshot = await getDoc(roleDocRef);
          return { id: roleName, data: roleSnapshot.exists() ? roleSnapshot.data() : null };
        })
      );
  
      // Update roles with the removed user
      await Promise.all(
        userRoleDocs.map(async (role) => {
          if (role.data === null) {
            // Role doesn't exist, create it
            const roleDocRef = doc(firestore, 'roles', role.id);
            await setDoc(roleDocRef, { users: [{ id: userId, email: userEmail }] });
          } else if (role.data.users) {
            // Role exists and users array is defined, check if user with the same email already exists
            const userIndex = role.data.users.findIndex((user) => user.email === userEmail);
            if (userIndex === -1) {
              // User with the same email doesn't exist, add it to the role
              const updatedUsers = [...role.data.users, { id: userId, email: userEmail }];
              const roleDocRef = doc(firestore, 'roles', role.id);
              await updateDoc(roleDocRef, { users: updatedUsers });
            }
          }
        })
      );
  
      // Construct a single string of roles
      const updatedRolesString = userRoles.join(', ');
  
      // Update user document with new roles string
      const userDocRef = doc(firestore, 'users', userId);

      await updateDoc(userDocRef, {
        role: updatedRolesString,
      });
  
      toast({
        title: 'Role updated',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error updating role:', error.message);
      toast({
        title: 'Error',
        description: 'An error occurred while updating role. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
  
  
  

  const handleDeleteRole = async (userId) => {

    try {
      // Remove role from roleInputs
      setRoleInputs((prevInputs) => {
        const updatedInputs = { ...prevInputs };
        delete updatedInputs[userId];
        return updatedInputs;
      });
  
      // Update roles collection in Firestore to remove user
      const userRoles = roles.filter(role => role.users.some(u => u.id === userId));
      await Promise.all(userRoles.map(async (role) => {
        const updatedUsers = role.users.filter(u => u.id !== userId);
        const roleDocRef = doc(firestore, 'roles', role.id);
        await updateDoc(roleDocRef, { users: updatedUsers });
      }));
  
      // Update user document to remove the deleted role
      const userDocRef = doc(firestore, 'users', userId);
      await updateDoc(userDocRef, {
        role: '', // Assuming 'role' is a single value field, set it to an empty string
      });
  
      toast({
        title: 'Role deleted',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error deleting role:', error.message);
      toast({
        title: 'Error',
        description: 'An error occurred while deleting role. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
  

  return (
    <Box p="4">
      <Text fontSize="xl" fontWeight="bold" mb="4">
        Role Setting
      </Text>
      {users.map((user) => (
        <Box key={user.id} mb="4">
          <Text fontWeight="bold">{user.name}</Text>
          <Stack direction="row" mt="2">
            <Input
              type="text"
              placeholder="Enter role"
              value={user.role || null}
              onChange={(e) => handleInputChange(user.id, e.target.value)}
            />
            <Button
              colorScheme="blue"
              onClick={() => handleUpdateRole(user.id, user.email)}
              disabled={!roleInputs[user.id]}
            >
              Update Role
            </Button>
            <IconButton
              colorScheme="red"
              aria-label="Delete Role"
              icon={<i className="fas fa-trash"></i>}
              onClick={() => handleDeleteRole(user.id)}
            />
          </Stack>
        </Box>
      ))}
    </Box>
  );
};

export default RoleSetting;
