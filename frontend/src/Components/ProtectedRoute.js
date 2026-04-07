// import React from 'react';
// import { Navigate ,useLocation} from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// const ProtectedRoute = ({ children }) => {

//   const location = useLocation();
//   const { user, isAuthenticated } = useAuth();
//   console.log('isAuthenticated:', isAuthenticated);
//   console.log('User:', user);

//   if (!isAuthenticated) {
//     // Redirect to login if not authenticated
//     return React.createElement(Navigate, { to: "/login",from:location, replace: true });
//   }

//   return children;
// };

// export default ProtectedRoute;



import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './common/LoadingSpinner';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const location = useLocation();
  const { user, isAuthenticated, isLoading } = useAuth();

  console.log("USER:", user);

  if (isLoading) return <LoadingSpinner />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 🔥 ROLE CHECK (THIS IS WHAT YOU WERE MISSING)
  if (allowedRoles && !allowedRoles.some(role => user?.roles?.includes(role))) {
    console.log("ACCESS DENIED. USER ROLES:", user?.roles);
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;