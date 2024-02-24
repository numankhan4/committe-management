import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Text,
  Input,
  Button,
  Textarea,
  FormControl,
  FormLabel,
  useToast,
} from '@chakra-ui/react';
import { AuthContext } from '../../context/UserContext';
import { collection, doc, getDoc, setDoc, updateDoc  } from 'firebase/firestore';
import { storage, firestore } from '../../firebase'; // Import Firebase Storage from your configuration file
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [accountInfo, setAccountInfo] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();


  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user) { // Check if user is not null or undefined
          const userDocRef = doc(firestore, 'users', user.uid);
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            const userData = docSnap.data();
            setName(userData.name || '');
            setEmail(userData.email || '');
            setPhone(userData.phone || '');
            setAccountInfo(userData.accountInfo || '');
            setProfilePictureUrl(userData.profilePictureUrl || '');
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      }
    };
    fetchData();
  }, [user]);
  

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePictureUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveProfile = async () => {
    try {
      setLoading(true);
  
      // Fetch the existing user document
      const userDocRef = doc(firestore, 'users', user.uid);
      const docSnap = await getDoc(userDocRef);
      const existingData = docSnap.data();
  
      // Upload profile picture if it's selected
      let profilePictureUrl = '';
      if (profilePicture) {
        // Upload profile picture to storage
        const storageRef = ref(storage, `profilePictures/${user.uid}`);
        const uploadTask = uploadBytesResumable(storageRef, profilePicture);
  
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            console.log(snapshot);
          },
          (error) => {
            alert(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
              profilePictureUrl = downloadURL; // Update profile picture URL
  
              // Update profile picture URL in Firestore
              await updateDoc(userDocRef, { profilePictureUrl });
  
              // Merge existing data with updated profile data
              const updatedData = {
                ...existingData,
                name,
                email,
                phone,
                accountInfo,
                profilePictureUrl,
              };
  
              // Save updated profile data to Firestore
              await setDoc(userDocRef, updatedData);
  
              toast({
                title: 'Profile updated',
                description: 'Your profile information has been updated successfully.',
                status: 'success',
                duration: 3000,
                isClosable: true,
              });
            });
          }
        );
      } else {
        // Merge existing data with updated profile data
        const updatedData = {
          ...existingData,
          name,
          email,
          phone,
          accountInfo,
        };
  
        // Save updated profile data to Firestore
        await setDoc(userDocRef, updatedData);
  
        toast({
          title: 'Profile updated',
          description: 'Your profile information has been updated successfully.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error saving profile:', error.message);
      toast({
        title: 'Error',
        description: 'An error occurred while saving your profile. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <Box maxW="500px" mx="auto" p="4">
      <Text fontSize="xl" fontWeight="bold" mb="4">Edit Profile</Text>
      <FormControl mb="4">
        <FormLabel>Name</FormLabel>
        <Input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </FormControl>
      <FormControl mb="4">
        <FormLabel>Email</FormLabel>
        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </FormControl>
      <FormControl mb="4">
        <FormLabel>Phone</FormLabel>
        <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
      </FormControl>
      <FormControl mb="4">
        <FormLabel>Account Info</FormLabel>
        <Textarea value={accountInfo} onChange={(e) => setAccountInfo(e.target.value)} />
      </FormControl>
      <FormControl mb="4">
        <FormLabel>Profile Picture</FormLabel>
        <Input type="file" accept="image/*" onChange={handleProfilePictureChange} />
        {profilePictureUrl && (
          <Box mt="2">
            <img src={profilePictureUrl} alt="Profile" style={{ maxWidth: '200px', maxHeight: '200px' }} />
          </Box>
        )}
      </FormControl>
      <Button colorScheme="blue" onClick={saveProfile} isLoading={loading}>Save</Button>
    </Box>
  );
};

export default Profile;
