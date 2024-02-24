import React, { useContext } from 'react';
import { Box, Text, Button,IconButton, Menu, MenuButton, MenuList, MenuItem, Avatar, useMediaQuery } from '@chakra-ui/react';
import { AuthContext } from '../../context/UserContext';
import { useSidebar } from '../../context/SidebarContext'; // Import useSidebar hook
import { HamburgerIcon } from '@chakra-ui/icons';

const Header = () => {
  const { logOut, userName, profilePictureUrl } = useContext(AuthContext);
  const { toggleSidebar } = useSidebar(); // Get toggleSidebar function from useSidebar hook
  const [isMobile] = useMediaQuery("(max-width: 768px)"); // Check if the screen size is less than 768px

  const handleLogout = async () => {
    try {
      await logOut();
      // Redirect to the login page or handle the logout success as needed
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

  return (
    <Box p={4} zIndex={9999} position={'fixed'} w={'100%'} bg="teal.500" display="flex" justifyContent="space-between" alignItems="center">
      {isMobile && ( // Render button only on mobile devices
        <IconButton
        colorScheme="teal"
        aria-label="Upload Payment"
        icon={<HamburgerIcon />}
        onClick={toggleSidebar}
      />
      )}
      <Text fontSize="xl" fontWeight="bold" color={'white'}>
        Welcome, {userName ? userName : 'Guest'}
      </Text>
      
      <Menu>
        <MenuButton as={Button} colorScheme="teal">
          <Avatar size="sm" name={userName} src={profilePictureUrl} />
        </MenuButton>
        <MenuList>
          <MenuItem as='a' href='/app/edit-profile'>Profile</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </MenuList>
      </Menu>
    </Box>
  );
};

export default Header;
