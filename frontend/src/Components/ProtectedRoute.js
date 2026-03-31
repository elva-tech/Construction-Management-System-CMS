import React from 'react';
import { Navigate ,useLocation} from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
const ProtectedRoute = ({ children }) => {

  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  console.log('isAuthenticated:', isAuthenticated);
  console.log('User:', user);

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return React.createElement(Navigate, { to: "/login",from:location, replace: true });
  }

  return children;
};

export default ProtectedRoute;
