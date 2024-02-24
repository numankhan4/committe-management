import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';
import { firestore } from '../../firebase';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';

const DurationComponent = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [durationData, setDurationData] = useState([]);
  const toast = useToast();

  const fetchData = async () => {
    try {
      const startYear = startDate.getFullYear();
      const endYear = endDate.getFullYear();

      const durationCollectionRef = collection(firestore, 'duration');
      const q = query(durationCollectionRef, where('year', '>=', startYear), where('year', '<=', endYear));
      const querySnapshot = await getDocs(q);
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      setDurationData(data);
    } catch (error) {
      console.error('Error fetching duration data:', error.message);
    }
  };

  const handleFetchData = () => {
    fetchData();
  };

  const handleSaveDuration = async () => {
    try {
      const startYear = startDate.getFullYear();
      const endYear = endDate.getFullYear();

      // Generate the year range string
      const yearRange = `${startYear}-${endYear}`;

      // Add the duration data to Firestore
      const docRef = await addDoc(collection(firestore, 'duration'), {
        year: yearRange,
      });
      console.log('Duration added with ID: ', docRef.id);

      // Fetch updated duration data
      fetchData();

      // Display success toast
      toast({
        title: 'Duration Saved',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error saving duration:', error.message);

      // Display error toast
      toast({
        title: 'Error',
        description: 'An error occurred while saving duration. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p="4" borderWidth="1px" borderRadius="lg">
      <Stack spacing="4">
        <FormControl>
          <FormLabel>Start Year:</FormLabel>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="yyyy"
            showYearPicker
            placeholderText="Select start year"
            wrapperClassName="date-picker-wrapper" // Custom class name for styling
          />
        </FormControl>
        <FormControl>
          <FormLabel>End Year:</FormLabel>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            dateFormat="yyyy"
            showYearPicker
            placeholderText="Select end year"
            wrapperClassName="date-picker-wrapper" // Custom class name for styling
          />
        </FormControl>
        <Button colorScheme="blue" onClick={handleFetchData} disabled={!startDate || !endDate}>
          Fetch Data
        </Button>
        <Button colorScheme="green" onClick={handleSaveDuration} disabled={!startDate || !endDate}>
          Save Duration
        </Button>
        <Stack spacing="2">
          {durationData.map((duration) => (
            <Box key={duration.id} p="3" borderWidth="1px" borderRadius="md" boxShadow="md">
              <Text>{duration.year}</Text>
              {/* Display other duration data properties here */}
            </Box>
          ))}
        </Stack>
      </Stack>
    </Box>
  );
};

export default DurationComponent;