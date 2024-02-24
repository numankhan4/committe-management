import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../../firebase';
import RemainingAmountChart from './charts/RemainingAmountChart';
import PaymentStatusChart from './charts/PaymentStatusChart';
import PaidUnpaidUserList from './PaidUnpaidUserList';
import { Box, Flex, useBreakpointValue } from '@chakra-ui/react';
import CurrentBeneficiary from './CurrentBeneficiary';

const DashboardComponent = () => {
  const [userData, setUserData] = useState([]);
  const totalAmount = 1000000;

  useEffect(() => {
    const fetchUserData = async () => {
      const usersCollection = collection(firestore, 'users');

      try {
        const querySnapshot = await getDocs(usersCollection);
        const usersData = querySnapshot.docs.map(doc => doc.data());
        setUserData(usersData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const paidAmount = userData.reduce((total, user) => {
    // Check if the user's payment status is 'verified' and user's contribution is defined.
    if (user.payment?.status === 'verified' && typeof user.contribution === 'number') {
      return total + user.contribution;
    } else {
      return total;
    }
  }, 0);

  const remainingAmount = totalAmount - paidAmount;

  const financialData = {
    totalAmount,
    paidAmount,
    remainingAmount,
  };

  const flexDirection = useBreakpointValue({ base: 'column', md: 'row' });

  return (
    <>
      <Flex w="100%" flexWrap="wrap" flexDirection={flexDirection} gap={6} >
        <Box width={{ base: '100%', md: '49%' }} mb={{ base: 0, md: 0 }} >
          <CurrentBeneficiary/>
        </Box>
        <Box width={{ base: '100%', md: '49%' }}>
          <PaidUnpaidUserList userData={userData} />
        </Box>
        <Box width={{ base: '100%', md: '49%' }} mb={{ base: 0, md: 0 }}>
          <RemainingAmountChart {...financialData} />
        </Box>
        <Box width={{ base: '100%', md: '49%' }} mb={{ base: 6, md: 0 }}>
          <PaymentStatusChart userData={userData} />
        </Box>
       
      </Flex>
    </>
  );
};

export default DashboardComponent;
