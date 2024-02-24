import React, { useEffect, useState, useContext } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  Spinner,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Text,
  Image,
  useToast,
  Button,
  useDisclosure,
  Flex,
  Avatar,
  Badge
} from '@chakra-ui/react';
import { collection, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';
import {  ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { firestore, storage } from '../../firebase';
import { AttachmentIcon, CheckCircleIcon } from '@chakra-ui/icons';
import { AuthContext } from '../../context/UserContext';

const MembersInfo = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, 'users'));
        const memberData = querySnapshot.docs.map(doc => doc.data());
        setMembers(memberData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching members:', error.message);
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  const payeeUser = members.find(member => member.currentPosition === true);
  const payeeUserId = payeeUser ? payeeUser.id : null;

  const handleOpenPaymentPopup = (member) => {
    setSelectedMember(member);
    onOpen();
  };

  const handleFileChange = (e) => {
    setPaymentScreenshot(e.target.files[0]);
  };

  const handleSubmit = async () => {
    try {
      if (!selectedMember || !paymentScreenshot) {
        toast({
          title: 'Error',
          description: !selectedMember ? 'No member selected.' : 'No payment screenshot selected.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1;

      const storageRef = ref(
        storage,
        `payment-screenshots/${currentYear}/${currentMonth}/${selectedMember.id}/${paymentScreenshot.name}`
      );
      const uploadTask = uploadBytesResumable(storageRef, paymentScreenshot);

      uploadTask.on(
        'state_changed',
        null,
        (error) => {
          console.error('Error uploading file:', error.message);
          toast({
            title: 'Error',
            description: 'An error occurred while uploading the file. Please try again.',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          const payeeUserDocRef = doc(firestore, 'users', payeeUserId);
          const payeeUserDocSnapshot = await getDoc(payeeUserDocRef);
          const payeeUserPayment = payeeUserDocSnapshot.data().payment || {};

          const updatedPayment = {
            ...payeeUserPayment,
            [selectedMember.id]: {
              screenshot: downloadURL,
              status: 'In Review'
            }
          };

          await updateDoc(payeeUserDocRef, {
            payment: updatedPayment,
          });

          const selectedMemberDocRef = doc(firestore, 'users', selectedMember.id);
          const selectedMemberDocSnapshot = await getDoc(selectedMemberDocRef);
          const selectedMemberPayment = selectedMemberDocSnapshot.data().payment || {};

          const updatedSelectedMemberPayment = {
            ...selectedMemberPayment,
            screenshot: downloadURL,
            status: 'In Review'
          };

          await updateDoc(selectedMemberDocRef, {
            payment: updatedSelectedMemberPayment,
          });

          toast({
            title: 'Payment submitted',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });

          onClose();
        }
      );
    } catch (error) {
      console.error('Error submitting payment:', error.message);
      toast({
        title: 'Error',
        description: 'An error occurred while submitting payment. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const verifyPaymentStatus = async (payeeUser, member) => {
    try {
      const payeeUserDocRef = doc(firestore, 'users', payeeUser?.id);
      const payeeUserDocSnapshot = await getDoc(payeeUserDocRef);
      const payeeUserPayment = payeeUserDocSnapshot.data().payment || {};
  
      const memberDocRef = doc(firestore, 'users', member.id);
      const memberDocSnapshot = await getDoc(memberDocRef);
      const memberPayment = memberDocSnapshot.data().payment || {};
      const memberPaymentStatus = memberPayment.status || 'N/A';
  
      const confirmation = window.confirm(`Do you want to verify payment status as '${memberPaymentStatus}' for ${member.name}?`);
      if (confirmation) {
        const updatedPaymentStatus = window.prompt(`Enter the new payment status for ${member.name} (yes/no):`);
        const statusValue = (updatedPaymentStatus.trim() === 'yes') ? 'verified' : 'not verified'; // Added parentheses here
  
        if (updatedPaymentStatus && ['yes', 'no'].includes(updatedPaymentStatus.trim())) {
          const updatedpayeeUserPayment = {
            ...payeeUserPayment,
            [member.id]: {
              ...payeeUserPayment[member.id],
              status: statusValue,
            },
          };
  
          await updateDoc(payeeUserDocRef, {
            payment: updatedpayeeUserPayment,
          });
  
          const updatedMemberPayment = {
            ...memberPayment,
            status: statusValue,
          };
  
          await updateDoc(memberDocRef, {
            payment: updatedMemberPayment,
          });
  
          toast({
            title: 'Payment Status Updated',
            description: `Payment status updated for ${member.name}: ${updatedPaymentStatus}`,
            status: 'info',
            duration: 5000,
            isClosable: true,
          });
        } else {
          toast({
            title: 'Invalid Payment Status',
            description: 'Please enter a valid payment status (Verified/Not Verified).',
            status: 'warning',
            duration: 3000,
            isClosable: true,
          });
        }
      }
    } catch (error) {
      console.error('Error verifying payment status:', error.message);
      toast({
        title: 'Error',
        description: 'An error occurred while verifying payment status. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  

  return (
    <Box p={4} overflowX="auto"> {/* Add overflowX="auto" to enable horizontal scrolling */}
      <Table variant="simple">
        <TableCaption>Members Information</TableCaption>
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Position</Th>
           
            <Th>Account</Th>
            <Th>Contribution</Th>
            <Th>Payment Status</Th>
            <Th>Upload Payment</Th>
            {payeeUser?.id === user.uid && <Th>Verify Payment Status</Th>}
            <Th>Payment Screenshot</Th>
          </Tr>
        </Thead>
        <Tbody>
  {loading ? (
    <Tr>
      <Td colSpan={10} textAlign="center">
        <Spinner />
      </Td>
    </Tr>
  ) : (
    members.map((member, index) => (
      <Tr key={index}>
        <Td>
          <Flex align="center">
            <Avatar name={member.name} src={member.profilePictureUrl} mr={4} />
            <Box>
              <Text>{member.name}</Text>
              <Text>{member.phone}</Text>
              <Text>{member.email}</Text>
            </Box>
          </Flex>
        </Td>
        <Td>{member.position}</Td>
        <Td>{member.accountInfo}</Td>
        <Td>Rs.{member.contribution ? member.contribution : "-"}</Td>
        <Td>
          {member.payment && (
            <Badge colorScheme={member.payment.status === 'verified' ? 'green' : 'red'}>
              {member.payment.status}
            </Badge>
          )}
        </Td>
        <Td>
          {!payeeUser || member.id !== payeeUser.id && (
            <IconButton
              colorScheme="blue"
              aria-label="Upload Payment"
              icon={<AttachmentIcon />}
              onClick={() => handleOpenPaymentPopup(member)}
            />
          )}
        </Td>
        {payeeUser?.id === user.uid && (
          <Td>
            <IconButton
              colorScheme="blue"
              aria-label="Verify Payment Status"
              icon={<CheckCircleIcon />}
              onClick={() => verifyPaymentStatus(payeeUser, member)}
            />
          </Td>
        )}
        <Td>
          {member.payment && member.payment.screenshot && (
            <Image src={member.payment.screenshot} alt="Payment Screenshot" maxW="100px" />
          )}
        </Td>
      </Tr>
    ))
  )}
</Tbody>


      </Table>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Upload Payment Screenshot</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Payment Screenshot</FormLabel>
              <Input type="file" onChange={handleFileChange} />
            </FormControl>
            <Text mt={2} fontSize="sm" color="gray.500">Please upload a screenshot of your payment.</Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit} isDisabled={!paymentScreenshot}>
              Submit
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default MembersInfo;
