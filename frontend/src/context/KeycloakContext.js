import React, { createContext, useContext, useState, useEffect } from 'react';
import keycloak, { keycloakInitOptions, keycloakHelpers } from '../config/keycloak';

// Create Keycloak context
const KeycloakContext = createContext();

// Custom hook to use Keycloak context
// Custom hook to use Keycloak context
export const useKeycloak = () => {
  const context = useContext(KeycloakContext);
  // Remove the "throw Error" block to allow fallback authentication 
  // when KeycloakProvider is conditionally not rendered.
  return context;
};

// Keycloak Provider Component
export const KeycloakProvider = ({ children }) => {
  const [isKeycloakReady, setIsKeycloakReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [keycloakError, setKeycloakError] = useState(null);

  // Initialize Keycloak
  useEffect(() => {
    const initKeycloak = async () => {
      try {
        // Check if Keycloak should be used
        const useKeycloak = process.env.REACT_APP_USE_KEYCLOAK === 'true';

        if (!useKeycloak) {
          console.log('Keycloak disabled via environment variable');
          setIsKeycloakReady(false);
          setIsLoading(false);
          return;
        }

        console.log('Initializing Keycloak...');

        // Initialize Keycloak
        const authenticated = await keycloak.init(keycloakInitOptions);
        
        console.log('Keycloak initialized. Authenticated:', authenticated);
        
        setIsKeycloakReady(true);
        setIsAuthenticated(authenticated);
        
        if (authenticated) {
          const userInfo = keycloakHelpers.getUserInfo();
          setUser(userInfo);
          console.log('User info:', userInfo);
          
          // Set up token refresh
          setupTokenRefresh();
        }
        
      } catch (error) {
        console.error('Keycloak initialization failed:', error);
        setKeycloakError(error.message || 'Failed to initialize Keycloak');
        
        // Fallback to mock authentication for development
        console.log('Falling back to mock authentication...');
        setIsKeycloakReady(false);
        
      } finally {
        setIsLoading(false);
      }
    };

    initKeycloak();
  }, []);

  // Setup automatic token refresh
  const setupTokenRefresh = () => {
    // Refresh token every 30 seconds if it's about to expire
    setInterval(() => {
      if (keycloak.authenticated) {
        keycloak.updateToken(30)
          .then((refreshed) => {
            if (refreshed) {
              console.log('Token refreshed');
            }
          })
          .catch((error) => {
            console.error('Failed to refresh token:', error);
            // Force logout if token refresh fails
            handleLogout();
          });
      }
    }, 30000); // Check every 30 seconds
  };

  // Login function
  const handleLogin = async (options = {}) => {
    try {
      if (isKeycloakReady) {
        await keycloakHelpers.login(options);
      } else {
        throw new Error('Keycloak not ready');
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  // Logout function
  const handleLogout = async (options = {}) => {
    try {
      if (isKeycloakReady && keycloak.authenticated) {
        await keycloakHelpers.logout(options);
      } else {
        // Clear local state
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Logout failed:', error);
      // Clear local state anyway
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  // Account management
  const openAccountManagement = () => {
    if (isKeycloakReady) {
      keycloakHelpers.accountManagement();
    }
  };

  // Check if user has specific role
  const hasRole = (role) => {
    if (!isKeycloakReady || !isAuthenticated) return false;
    return keycloakHelpers.hasRole(role);
  };

  // Check if user has any of the specified roles
  const hasAnyRole = (roles) => {
    if (!isKeycloakReady || !isAuthenticated) return false;
    return keycloakHelpers.hasAnyRole(roles);
  };

  // Get user permissions
  const getUserPermissions = () => {
    if (!isKeycloakReady || !isAuthenticated) return {};
    return keycloakHelpers.getUserPermissions();
  };

  // Get access token
  const getToken = () => {
    if (!isKeycloakReady) return null;
    return keycloakHelpers.getToken();
  };

  // Context value
  const contextValue = {
    // Keycloak state
    isKeycloakReady,
    isAuthenticated,
    isLoading,
    user,
    keycloakError,
    
    // Keycloak instance (for advanced usage)
    keycloak: isKeycloakReady ? keycloak : null,
    
    // Authentication methods
    login: handleLogin,
    logout: handleLogout,
    
    // User management
    openAccountManagement,
    
    // Authorization methods
    hasRole,
    hasAnyRole,
    getUserPermissions,
    
    // Token methods
    getToken,
    
    // Helpers
    keycloakHelpers: isKeycloakReady ? keycloakHelpers : null,
  };

  return (
    <KeycloakContext.Provider value={contextValue}>
      {children}
    </KeycloakContext.Provider>
  );
};
