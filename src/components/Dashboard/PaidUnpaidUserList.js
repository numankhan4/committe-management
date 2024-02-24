import React from 'react';
import { Box, List, ListItem, Text, Avatar, Flex } from '@chakra-ui/react';

const PaidUnpaidUserList = ({ userData }) => {
  // Filter users into paid and unpaid categories
  const paidUsers = userData.filter(user => user.payment?.status === 'verified');
  const unpaidUsers = userData.filter(user => !user.payment || user.payment.status !== 'verified');

  return (
    <>
      <Flex flexDirection={{ base: 'column', md: 'row' }} gap={6}  h="100%">
        <Box flex="1" h="100%">
          <Box p="4" bg="gray.100" boxShadow="md" borderRadius="md" h="100%"  >
            <Text fontWeight="bold" fontSize="xl" mb={10} color="teal.500">Paid Users</Text> {/* Text color */}
            <List styleType="none" ml={0} spacing={5}>
              {paidUsers.map((user, index) => (
                <ListItem key={index}>
                  <Flex alignItems="center">
                    <Avatar name={user.name} src={user.avatar} size="xs" mr={5} />
                    <Text>{user.name}</Text>
                  </Flex>
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
        <Box flex="1" h="100%">
          <Box p="4" bg="gray.100" boxShadow="md" borderRadius="md" h="100%" >
            <Text fontWeight="bold" fontSize="xl" mt={4} mb={10} color="red.500">Unpaid Users</Text> {/* Text color */}
            <List styleType="none" ml={0} spacing={5}>
              {unpaidUsers.map((user, index) => (
                <ListItem key={index}>
                  <Flex alignItems="center">
                    <Avatar name={user.name} src={user.profilePictureUrl} size="xs" mr={5} />
                    <Text>{user.name}</Text>
                  </Flex>
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
      </Flex>
    </>
  );
};

export default PaidUnpaidUserList;
