import React, { useState, useEffect ,useCallback} from 'react';
import {
  Box,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  FormControl,
  Input,
  Textarea,
  useToast,
  Checkbox,
} from '@chakra-ui/react';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { firestore } from '../../firebase';

const MemberManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [userData, setUserData] = useState({});
  const toast = useToast();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const usersCollection = collection(firestore, 'users');
      const querySnapshot = await getDocs(usersCollection);
      const userList = [];
      querySnapshot.forEach((doc) => {
        userList.push({ id: doc.id, ...doc.data() });
      });
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
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleEdit = (userId) => {
    setEditingUserId(userId);
    const userToEdit = users.find((user) => user.id === userId);
    setUserData(userToEdit);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const userDocRef = doc(firestore, 'users', userData.id);
      await updateDoc(userDocRef, userData);
      toast({
        title: 'User data updated',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      fetchData();
      setEditingUserId(null);
    } catch (error) {
      console.error('Error updating user data:', error.message);
      toast({
        title: 'Error',
        description: 'An error occurred while updating user data. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    try {
      setLoading(true);
      const userDocRef = doc(firestore, 'users', userId);
      await deleteDoc(userDocRef);
      toast({
        title: 'User deleted',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      fetchData();
    } catch (error) {
      console.error('Error deleting user:', error.message);
      toast({
        title: 'Error',
        description: 'An error occurred while deleting user. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e, field) => {
    const value = e.target.value;
    setUserData((prevData) => ({ ...prevData, [field]: value }));
  };

  const handleCheckboxChange = (e) => {
    const value = e.target.checked;
    setUserData((prevData) => ({ ...prevData, approved: value }));
  };

  return (
    <Box p="4">
      <Text fontSize="xl" fontWeight="bold" mb="4">Member Management</Text>
      <Table variant="simple" mb="4">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Position</Th> 
            <Th>Email</Th>
            <Th>Phone</Th>
            <Th>Account Info</Th>
            <Th>Contribution</Th>
            <Th>Approved</Th>
            <Th>Action</Th>
          </Tr>
        </Thead>
        <Tbody>
          {users.map((user) => (
            <Tr key={user.id}>
              <Td>
                {editingUserId === user.id ? (
                  <FormControl>
                    <Input
                      type="text"
                      value={userData.name}
                      onChange={(e) => handleChange(e, 'name')}
                    />
                  </FormControl>
                ) : (
                  user.name
                )}
              </Td>
              <Td>
                {editingUserId === user.id ? (
                  <FormControl>
                    <Input
                      type="month"
                      value={userData.position}
                      onChange={(e) => handleChange(e, 'position')} // Handle position type change
                    />
                  </FormControl>
                ) : (
                  user.position
                )}
              </Td>
              <Td>{user.email}</Td>
              <Td>
                {editingUserId === user.id ? (
                  <FormControl>
                    <Input
                      type="text"
                      value={userData.phone}
                      onChange={(e) => handleChange(e, 'phone')}
                    />
                  </FormControl>
                ) : (
                  user.phone
                )}
              </Td>
              <Td>
                {editingUserId === user.id ? (
                  <FormControl>
                    <Textarea
                      value={userData.accountInfo}
                      onChange={(e) => handleChange(e, 'accountInfo')}
                    />
                  </FormControl>
                ) : (
                  user.accountInfo
                )}
              </Td>
              <Td>
                {editingUserId === user.id ? (
                  <FormControl>
                    <Input
                      type="text"
                      value={userData.contribution}
                      onChange={(e) => handleChange(e, 'contribution')} // Handle position type change
                    />
                  </FormControl>
                ) : (
                  user.contribution
                )}
              </Td>
              <Td>
                {editingUserId === user.id ? (
                  <Checkbox
                    isChecked={userData.approved}
                    onChange={handleCheckboxChange}
                  />
                ) : (
                  user.approved ? 'Approved' : 'Not Approved'
                )}
              </Td>
              <Td>
                {editingUserId === user.id ? (
                  <>
                    <Button
                      colorScheme="blue"
                      onClick={() => handleSave(user.id)}
                      isLoading={loading}
                      mr="2"
                    >
                      Save
                    </Button>
                    <Button colorScheme="red" onClick={() => setEditingUserId(null)}>Cancel</Button>
                  </>
                ) : (
                  <Button colorScheme="teal" onClick={() => handleEdit(user.id)}>Edit</Button>
                )}
                <Button
                  colorScheme="red"
                  onClick={() => handleDelete(user.id)}
                  isLoading={loading}
                  ml="2"
                >
                  Delete
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default MemberManagement;
