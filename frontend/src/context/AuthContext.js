// import React, { createContext, useState, useContext, useEffect } from 'react';
// import authService from '../services/authService';
// import { useKeycloak } from './KeycloakContext';

// // Create the authentication context
// const AuthContext = createContext();

// // Custom hook to use the auth context
// export const useAuth = () => {
//   return useContext(AuthContext);
// };

// // Provider component that wraps the app and makes auth object available to any child component that calls useAuth()
// export const AuthProvider = ({ children }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [user, setUser] = useState(null);

//   // Get Keycloak context (will be null if not wrapped in KeycloakProvider)
//   // FIX: Moved useKeycloak() out of try/catch to satisfy React Hook rules
//   const keycloakContext = useKeycloak();
// useEffect(() => {
//   const checkAuth = async () => {
//     try {
//       if (keycloakContext && keycloakContext.isLoading) {
//         return; // Wait for Keycloak to finish loading
//       }

//       if (
//         keycloakContext &&
//         keycloakContext.isKeycloakReady &&
//         !keycloakContext.isLoading &&
//         keycloakContext.isAuthenticated
//       ) {
//         setIsAuthenticated(true);
//         setUser(keycloakContext.user);
//         setIsLoading(false);
//         return;
//       }

//       if (localStorage.getItem("isAuthenticated") === "true") {
//         const userData = JSON.parse(localStorage.getItem("userData"));
//         if (userData) {
//           setIsAuthenticated(true);
//           setUser(userData);
//         } else {
//           try {
//             const userInfo = await authService.getUserInfo();
//             setIsAuthenticated(true);
//             setUser(userInfo);
//           } catch (error) {
//             console.error('Failed to get user info:', error);
//             setIsAuthenticated(false);
//             setUser(null);
//             await authService.logout();
//           }
//         }
//       } else {
//         setIsAuthenticated(false);
//         setUser(null);
//       }
//     } catch (error) {
//       console.error('Error checking authentication:', error);
//       setIsAuthenticated(false);
//       setUser(null);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   checkAuth();
// }, [keycloakContext?.isLoading, keycloakContext?.isAuthenticated]);

//   // Login function using Keycloak (with dummy credentials fallback for testing)
//   const login = async (username, password) => {
//     try {
//       setIsLoading(true);

//       // If Keycloak is available and ready, use it for login
//       if (keycloakContext && keycloakContext.isKeycloakReady) {
//         try {
//           await keycloakContext.login();
//           // Keycloak will handle the redirect, so we don't need to return anything
//           return { success: true };
//         } catch (keycloakError) {
//           console.error('Keycloak login failed:', keycloakError);
//           // Fall through to dummy credentials
//         }
//       }

//       // Admin-only login credentials (supervisors and clients are managed through Add User)
//       const adminCredentials = [
//         { username: 'admin', password: 'admin123', role: 'admin', name: 'System Administrator' },
//         { username: 'demo', password: 'demo', role: 'admin', name: 'Demo Admin' },
//         { username: 'user', password: 'user123', role: 'user', name: 'User' }
//       ];

//       // Check if credentials match admin credentials
//       const adminUser = adminCredentials.find(
//         cred => cred.username === username && cred.password === password
//       );

//       if (adminUser) {
//         // Create admin user data with full permissions
//         const mockUser = {
//           name: adminUser.name || adminUser.username.charAt(0).toUpperCase() + adminUser.username.slice(1),
//           email: `${adminUser.username}@cms.com`,
//           username: adminUser.username,
//           roles: ['admin'],
//           permissions: {
//             // Admin has full permissions
//             canCreateProject: true,
//             canEditProject: true,
//             canDeleteProject: true,
//             canViewProjects: true,
//             canAssignProjects: true,

//             // User Management
//             canCreateUsers: true,
//             canEditUsers: true,
//             canDeleteUsers: true,
//             canViewUsers: true,

//             // Inventory Management
//             canManageInventory: true,
//             canViewInventory: true,
//             canAddInventoryItems: true,
//             canEditInventoryItems: true,
//             canDeleteInventoryItems: true,

//             // Daily Reports
//             canCreateReports: true,
//             canEditReports: true,
//             canDeleteReports: true,
//             canViewReports: true,

//             // Financial Management
//             canManagePayments: true,
//             canViewFinancials: true,
//             canApprovePayments: true,

//             // Drawing Management
//             canUploadDrawings: true,
//             canApproveDrawings: true,
//             canRejectDrawings: true,
//             canViewDrawings: true,

//             // Dashboard Access
//             canViewDashboard: true,
//             canViewAllProjects: true,
//             canViewAssignedProjects: true,

//             // System Settings
//             canManageSettings: true,
//             canViewSettings: true,

//             // Role identification
//             role: 'admin',
//             isAdmin: true,
//             isSupervisor: false,
//             isClient: false
//           }
//         };

//         // Store mock user data
//         localStorage.setItem('access_token', 'mock_token_' + Date.now());
//         localStorage.setItem('refresh_token', 'mock_refresh_token_' + Date.now());
//         localStorage.setItem('isAuthenticated', 'true');
//         localStorage.setItem('userData', JSON.stringify(mockUser));

//         setUser(mockUser);
//         setIsAuthenticated(true);
//         return { success: true };
//       }

//       // Try real authentication if dummy credentials don't match
//       try {
//         const result = await authService.login(username, password);

//         if (result.success) {
//           setUser(result.user);
//           setIsAuthenticated(true);
//           return { success: true };
//         } else {
//           return {
//             success: false,
//             error: keycloakContext && keycloakContext.isKeycloakReady
//               ? 'Authentication failed. Please try again or use Keycloak login.'
//               : 'Invalid admin credentials. Only administrators can log in. Try: admin/admin123 or demo/demo'
//           };
//         }
//       } catch (authError) {
//         return {
//           success: false,
//           error: keycloakContext && keycloakContext.isKeycloakReady
//             ? 'Authentication failed. Please try again or use Keycloak login.'
//             : 'Invalid admin credentials. Only administrators can log in. Try: admin/admin123 or demo/demo'
//         };
//       }

//     } catch (error) {
//       console.error('Login error:', error);
//       return {
//         success: false,
//         error: keycloakContext && keycloakContext.isKeycloakReady
//           ? 'Authentication failed. Please try again.'
//           : 'Invalid credentials. Try: admin/admin123, manager/manager123, user/user123, or demo/demo'
//       };
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Logout function
//   const logout = async () => {
//     try {
//       setIsLoading(true);

//       // If Keycloak is available and user is authenticated through Keycloak, use Keycloak logout
//       if (keycloakContext && keycloakContext.isKeycloakReady && keycloakContext.isAuthenticated) {
//         await keycloakContext.logout();
//       } else {
//         // Fallback to traditional logout
//         await authService.logout();
//       }
//     } catch (error) {
//       console.error('Logout error:', error);
//     } finally {
//       setUser(null);
//       setIsAuthenticated(false);
//       setIsLoading(false);
//     }
//   };

//   // Update user profile
//   const updateUserProfile = (userData) => {
//     setUser(prevUser => {
//       const updatedUser = { ...prevUser, ...userData };
//       localStorage.setItem('userData', JSON.stringify(updatedUser));
//       return updatedUser;
//     });
//   };

//   // Additional Keycloak methods
//   const hasRole = (role) => {
//     if (keycloakContext && keycloakContext.isKeycloakReady) {
//       return keycloakContext.hasRole(role);
//     }
//     // Fallback: check user roles from mock data
//     return user?.roles?.includes(role) || false;
//   };

//   const hasAnyRole = (roles) => {
//     if (keycloakContext && keycloakContext.isKeycloakReady) {
//       return keycloakContext.hasAnyRole(roles);
//     }
//     // Fallback: check user roles from mock data
//     return roles.some(role => user?.roles?.includes(role)) || false;
//   };

//   const getUserPermissions = () => {
//     if (keycloakContext && keycloakContext.isKeycloakReady) {
//       return keycloakContext.getUserPermissions();
//     }
//     // Fallback: return permissions from mock data
//     return user?.permissions || {};
//   };

//   const getToken = () => {
//     if (keycloakContext && keycloakContext.isKeycloakReady) {
//       return keycloakContext.getToken();
//     }
//     // Fallback: return mock token
//     return localStorage.getItem('access_token');
//   };

//   const openAccountManagement = () => {
//     if (keycloakContext && keycloakContext.isKeycloakReady) {
//       keycloakContext.openAccountManagement();
//     } else {
//       console.log('Account management not available without Keycloak');
//     }
//   };

//   const value = {
//     isAuthenticated,
//     isLoading,
//     user,
//     login,
//     logout,
//     updateUserProfile,

//     // Keycloak-specific methods
//     hasRole,
//     hasAnyRole,
//     getUserPermissions,
//     getToken,
//     openAccountManagement,

//     // Keycloak context (for advanced usage)
//     keycloak: keycloakContext,
//     isKeycloakReady: keycloakContext?.isKeycloakReady || false,
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {!isLoading && children}
//     </AuthContext.Provider>
//   );
// };







import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';
import { useKeycloak } from './KeycloakContext';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Get Keycloak context (will be null if not wrapped in KeycloakProvider)
  const keycloakContext = useKeycloak();

 useEffect(() => {
  if (!keycloakContext || keycloakContext.isLoading) return;

  if (keycloakContext.isAuthenticated) {
    setIsAuthenticated(true);
    setUser(keycloakContext.user);
  } else {
    setIsAuthenticated(false);
    setUser(null);
  }

  setIsLoading(false);
}, [
  keycloakContext?.isLoading,
  keycloakContext?.isAuthenticated
]);

  // Login — Keycloak first, then backend (test users + DB)
const login = async () => {
  try {
    console.log("KC READY:", keycloakContext?.isKeycloakReady);

    if (!keycloakContext) return;

    if (!keycloakContext.isKeycloakReady) {
      console.warn("Keycloak not ready — click again");
      return;
    }

    await keycloakContext.login();
  } catch (error) {
    console.error('Login error:', error);
  }
};

  // Logout
  const logout = async () => {
    try {
      setIsLoading(true);
      if (keycloakContext && keycloakContext.isKeycloakReady && keycloakContext.isAuthenticated) {
        await keycloakContext.logout();
      } else {
        await authService.logout();
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  };

  // Update user profile
  const updateUserProfile = (userData) => {
    setUser(prevUser => {
      const updatedUser = { ...prevUser, ...userData };
      localStorage.setItem('userData', JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  // Role helpers — Keycloak first, then local user data
  const hasRole = (role) => {
    if (keycloakContext && keycloakContext.isKeycloakReady) {
      return keycloakContext.hasRole(role);
    }
    return user?.roles?.includes(role) || user?.role === role || false;
  };

  const hasAnyRole = (roles) => {
    if (keycloakContext && keycloakContext.isKeycloakReady) {
      return keycloakContext.hasAnyRole(roles);
    }
    return roles.some(r => user?.roles?.includes(r) || user?.role === r) || false;
  };

  const getUserPermissions = () => {
    if (keycloakContext && keycloakContext.isKeycloakReady) {
      return keycloakContext.getUserPermissions();
    }
    return user?.permissions || {};
  };

  const getToken = () => {
    if (keycloakContext && keycloakContext.isKeycloakReady) {
      return keycloakContext.getToken();
    }
    return localStorage.getItem('access_token');
  };

  const openAccountManagement = () => {
    if (keycloakContext && keycloakContext.isKeycloakReady) {
      keycloakContext.openAccountManagement();
    } else {
      console.log('Account management not available without Keycloak');
    }
  };

  const value = {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout,
    updateUserProfile,
    hasRole,
    hasAnyRole,
    getUserPermissions,
    getToken,
    openAccountManagement,
    keycloak: keycloakContext,
    isKeycloakReady: keycloakContext?.isKeycloakReady || false,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};