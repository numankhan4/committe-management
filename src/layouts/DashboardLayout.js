import React, { useContext } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { Box, Flex, useMediaQuery } from '@chakra-ui/react';
import SideNavigation from '../components/SideNavigation/SideNavigation';
import Header from '../components/Header/Header';
import DashboardComponent from '../components/Dashboard/Dashboard';
import MembersComponent from '../components/Members/Members';
import Profile from '../components/Profile/Profile';
import MemberManagement from '../components/MemberManagement/MemberManagement';
import RoleSetting from '../components/RoleSetting/RoleSetting';
import { AuthContext } from '../context/UserContext';
import DurationComponent from '../components/DurationComponent/DurationComponent';
import { useSidebar } from '../context/SidebarContext';

const DashboardLayout = () => {
  const { userRole } = useContext(AuthContext);
  const [isMobile] = useMediaQuery("(max-width: 768px)");

  return (
    <Flex direction="column" h="100vh" color="blackAlpha.700" fontWeight="bold">
      <Header />
      <Flex flexGrow={1} pl={`${isMobile ? '0' : '250px'}`} pt={`72px`}>
        <SideNavigation />
        <Box flex="1" p={4}>
          <Routes>
            <Route path="/dashboard" element={<DashboardComponent />} />
            <Route path="/members" element={<MembersComponent />} />
            <Route path="/edit-profile" element={<Profile />} />
            {userRole === 'Admin' ? (
              <Route path="/member-manage" element={<MemberManagement />} />
            ) : (
              <Route path="/member-manage" element={<Navigate to="/dashboard" />} />
            )}
            {userRole === 'Admin' ? (
              <Route path="/role-setting" element={<RoleSetting />} />
            ) : (
              <Route path="/role-setting" element={<Navigate to="/dashboard" />} />
            )}
            {userRole === 'Admin' ? (
              <Route path="/set-duration" element={<DurationComponent />} />
            ) : (
              <Route path="/set-duration" element={<Navigate to="/dashboard" />} />
            )}
          </Routes>
        </Box>
      </Flex>
      <Box as="footer" h="30px">
        Footer
      </Box>
    </Flex>
  );
};

export default DashboardLayout;
