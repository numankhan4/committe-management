// AppRouter.js
import React, { useContext } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import AdminPanel from './components/AdminPanel';
import Dashboard from './pages/Dashboard';
import Login from './Auth/Login'; // Import your Login component
import Register from './Auth/Register'; // Import your Register component
import { AuthContext } from './context/UserContext';
import LandingPage from './pages/LandingPage';
import DashboardLayout from './layouts/DashboardLayout';
import { PageLoadingProvider } from './context/PageLoadingContext';

const AppRouter = () => {
  const { user } = useContext(AuthContext);

  const PrivateRoute = ({ element, authenticated, ...props }) => {
    return authenticated ? (
      element
    ) : (
      <Navigate to="/login" state={{ from: props.location }} replace />
    );
  };

  return (

    <Router>
      <Routes>
      <Route  path="/" element={ <LandingPage /> } />
        <Route path="/admin" element={<PrivateRoute element={<AdminPanel />} authenticated={user !== null} />} />
        <Route
          path="/app/*"
          element={<PrivateRoute element={<DashboardLayout />} authenticated={user !== null} />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
    
      </Routes>
    </Router>

  );
};

export default AppRouter;
