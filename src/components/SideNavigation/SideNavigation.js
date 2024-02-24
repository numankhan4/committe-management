import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { VStack, Text, Button, Flex, useMediaQuery, Box } from '@chakra-ui/react';
import { FaHome, FaUsers, FaUser, FaCog, FaClock } from 'react-icons/fa'; // Importing icons
import { AuthContext } from '../../context/UserContext';
import { useSidebar } from '../../context/SidebarContext';
import { usePageLoading } from '../../context/PageLoadingContext';

const SideNavigation = () => {
  const { userRole } = useContext(AuthContext);
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const [isReady, setIsReady] = useState(false);
  const { setLoading } = usePageLoading();
  const location = useLocation();

  useEffect(() => {
    console.log("userRole", userRole);
    if (userRole) {
      setIsReady(true);
      setLoading(false);
    }
  }, [userRole, setLoading]);

  if (!isReady) {
    setLoading(true);
    return null;
  }

  const closeSidebar = () => {
    if (isMobile && isSidebarOpen) {
      toggleSidebar();
    }
  };

  return (
    <>
      {isMobile && isSidebarOpen && (
        <Box
          bg="rgba(0,0,0,0.5)"
          position="fixed"
          top="0"
          bottom="0"
          left="0"
          right="0"
          zIndex="999"
          onClick={toggleSidebar} // Close sidebar when overlay is clicked
        />
      )}
      <div
        style={{
          left: isMobile ? (isSidebarOpen ? '0' : '-250px') : '0',
          transition: 'left 0.5s',
          backgroundColor: '#f0f0f0',
          position: 'fixed',
          top: '0',
          bottom: '0',
          zIndex: '1000',
          overflowX: 'hidden',
          width: '250px',
          paddingTop: '60px',
        }}
      >
        <VStack align="left" justify="start" spacing={3} p={4} mt={4}>
          {[
            { path: "/app/dashboard", label: "Dashboard", icon: <FaHome /> },
            { path: "/app/members", label: "Members", icon: <FaUsers /> },
            { path: "/app/edit-profile", label: "Profile", icon: <FaUser /> },
            { path: "/app/member-manage", label: "Member Management", visible: userRole === 'Admin', icon: <FaCog /> },
            { path: "/app/role-setting", label: "Role Setting", visible: userRole === 'Admin', icon: <FaCog /> },
            { path: "/app/set-duration", label: "Duration Setting", visible: userRole === 'Admin', icon: <FaClock /> },
          ].map((item, index) => (
            item.visible !== false && (
              <Link key={index} to={item.path} onClick={closeSidebar}>
                <Button
                  boxSize="initial"
                  justifyContent="flex-start"
                  alignItems="center"
                  bg={location.pathname === item.path ? 'teal.300' : 'transparent'}
                  py="12px"
                  px="16px"
                  borderRadius="10px"
                  _hover="none"
                  w="100%"
                  _active={{
                    bg: "inherit",
                    transform: "none",
                    borderColor: "transparent",
                  }}
                  _focus={{
                    boxShadow: "none",
                  }}
                >
                  <Flex>
                    {item.icon && (
                      <Flex mr={2} color={location.pathname === item.path ? 'white' : 'black'}>{item.icon}</Flex>
                    )}
                    <Text my="auto" fontSize="sm" color={location.pathname === item.path ? 'white' : 'black'}>
                      {item.label}
                    </Text>
                  </Flex>
                </Button>
              </Link>
            )
          ))}
        </VStack>
      </div>
    </>
  );
};

export default SideNavigation;
