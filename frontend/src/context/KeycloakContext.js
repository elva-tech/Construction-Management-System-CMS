// import React, { createContext, useContext, useState, useEffect } from 'react';
// import keycloak, { keycloakInitOptions, keycloakHelpers } from '../config/keycloak';

// const KeycloakContext = createContext();

// export const useKeycloak = () => useContext(KeycloakContext);

// let keycloakInitialized = false;

// export const KeycloakProvider = ({ children }) => {
//   const [isKeycloakReady, setIsKeycloakReady] = useState(false);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [user, setUser] = useState(null);
//   const [keycloakError, setKeycloakError] = useState(null);

//   useEffect(() => {
//     const initKeycloak = async () => {
//       try {
//         const useKeycloak = process.env.REACT_APP_USE_KEYCLOAK === 'true';

//         if (!useKeycloak) {
//           setIsKeycloakReady(false);
//           setIsLoading(false);
//           return;
//         }

//         if (keycloakInitialized) {
//           setIsKeycloakReady(true);
//           setIsAuthenticated(keycloak.authenticated || false);
//           if (keycloak.authenticated) {
//             setUser(keycloakHelpers.getUserInfo());
//             setupTokenRefresh();
//           }
//           setIsLoading(false);
//           return;
//         }

//         keycloakInitialized = true;
        
        

// keycloak.onAuthSuccess = () => {
//   console.log('Keycloak auth success!');
//   setIsAuthenticated(true);
//   setUser(keycloakHelpers.getUserInfo());
// };

// keycloak.onAuthError = () => {
//   console.log('Keycloak auth error!');
//   setIsAuthenticated(false);
// };

// keycloak.onTokenExpired = () => {
//   keycloak.updateToken(30).catch(() => handleLogout());
// };
// const authenticated = await keycloak.init(keycloakInitOptions);
// console.log('authenticated:', authenticated);
// console.log('keycloak.authenticated:', keycloak.authenticated);
// console.log('keycloak.token:', keycloak.token ? 'EXISTS' : 'NULL');

// // Force check after init
// const isAuth = authenticated || keycloak.authenticated || false;
// setIsKeycloakReady(true);
// setIsAuthenticated(isAuth);

// if (isAuth) {
//   const userInfo = keycloakHelpers.getUserInfo();
//   setUser(userInfo);
//   setupTokenRefresh();
// }
//         setIsKeycloakReady(true);
//         setIsAuthenticated(authenticated);

//         if (authenticated) {
//           const userInfo = keycloakHelpers.getUserInfo();
//           setUser(userInfo);
//           setupTokenRefresh();
//         }

//       } catch (error) {
//         console.error('Keycloak initialization failed:', error);
//         setKeycloakError(error.message || 'Failed to initialize Keycloak');
//         keycloakInitialized = false;
//         setIsKeycloakReady(false);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     initKeycloak();
//   }, []);

//   const setupTokenRefresh = () => {
//     setInterval(() => {
//       if (keycloak.authenticated) {
//         keycloak.updateToken(30).catch(() => handleLogout());
//       }
//     }, 30000);
//   };

//   const handleLogin = async (options = {}) => {
//     try {
//       if (isKeycloakReady) {
//         await keycloakHelpers.login(options);
//       } else {
//         throw new Error('Keycloak not ready');
//       }
//     } catch (error) {
//       console.error('Login failed:', error);
//       throw error;
//     }
//   };

//   const handleLogout = async (options = {}) => {
//     try {
//       if (isKeycloakReady && keycloak.authenticated) {
//         await keycloakHelpers.logout(options);
//       } else {
//         setIsAuthenticated(false);
//         setUser(null);
//       }
//     } catch (error) {
//       setIsAuthenticated(false);
//       setUser(null);
//     }
//   };

//   const contextValue = {
//     isKeycloakReady,
//     isAuthenticated,
//     isLoading,
//     user,
//     keycloakError,
//     keycloak: isKeycloakReady ? keycloak : null,
//     login: handleLogin,
//     logout: handleLogout,
//     openAccountManagement: () => isKeycloakReady && keycloakHelpers.accountManagement(),
//     hasRole: (role) => isKeycloakReady && isAuthenticated ? keycloakHelpers.hasRole(role) : false,
//     hasAnyRole: (roles) => isKeycloakReady && isAuthenticated ? keycloakHelpers.hasAnyRole(roles) : false,
//     getUserPermissions: () => isKeycloakReady && isAuthenticated ? keycloakHelpers.getUserPermissions() : {},
//     getToken: () => isKeycloakReady ? keycloakHelpers.getToken() : null,
//     keycloakHelpers: isKeycloakReady ? keycloakHelpers : null,
//   };

//   return (
//     <KeycloakContext.Provider value={contextValue}>
//       {children}
//     </KeycloakContext.Provider>
//   );
// };



import React, { createContext, useContext, useState, useEffect } from 'react';
import keycloak, { keycloakInitOptions, keycloakHelpers } from '../config/keycloak';

const KeycloakContext = createContext();
export const useKeycloak = () => useContext(KeycloakContext);

let keycloakInitialized = false;

export const KeycloakProvider = ({ children }) => {
  const [isKeycloakReady, setIsKeycloakReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [keycloakError, setKeycloakError] = useState(null);

  useEffect(() => {
    const initKeycloak = async () => {
      try {
        const useKc = process.env.REACT_APP_USE_KEYCLOAK === 'true';
        if (!useKc) {
          setIsKeycloakReady(false);
          setIsLoading(false);
          return;
        }

        if (keycloakInitialized) {
          setIsKeycloakReady(true);
          setIsAuthenticated(keycloak.authenticated || false);
          if (keycloak.authenticated) {
            const userInfo = {
  username: keycloak.tokenParsed?.preferred_username,
  roles: keycloak.tokenParsed?.realm_access?.roles || []
};

setUser(userInfo);
          }
          setIsLoading(false);
          return;
        }

        keycloakInitialized = true;

        keycloak.onAuthSuccess = () => {
          console.log('onAuthSuccess fired');
          setIsAuthenticated(true);
          const userInfo = {
  username: keycloak.tokenParsed?.preferred_username,
  roles: keycloak.tokenParsed?.realm_access?.roles || []
};

setUser(userInfo);
        };

        keycloak.onAuthError = () => {
          console.log('onAuthError fired');
          setIsAuthenticated(false);
        };

        keycloak.onTokenExpired = () => {
          keycloak.updateToken(30).catch(() => handleLogout());
        };

        const authenticated = await keycloak.init(keycloakInitOptions);
        console.log('Keycloak init authenticated:', authenticated);
        console.log('keycloak.authenticated:', keycloak.authenticated);
        console.log('keycloak.token:', keycloak.token ? 'EXISTS' : 'NULL');

        const isAuth = authenticated || keycloak.authenticated || false;
        setIsKeycloakReady(true);
        setIsAuthenticated(isAuth);

        if (isAuth) {
          const userInfo = {
  username: keycloak.tokenParsed?.preferred_username,
  roles: keycloak.tokenParsed?.realm_access?.roles || []
};

setUser(userInfo);
          setupTokenRefresh();
        }

      } catch (error) {
        console.error('Keycloak initialization failed:', error);
        setKeycloakError(error.message);
        keycloakInitialized = false;
        setIsKeycloakReady(false);
      } finally {
        setIsLoading(false);
      }
    };

    initKeycloak();
  }, []);

  const setupTokenRefresh = () => {
    setInterval(() => {
      if (keycloak.authenticated) {
        keycloak.updateToken(30).catch(() => handleLogout());
      }
    }, 30000);
  };

  const handleLogin = async (options = {}) => {
    if (isKeycloakReady) {
      await keycloakHelpers.login(options);
    } else {
      throw new Error('Keycloak not ready');
    }
  };

  const handleLogout = async (options = {}) => {
    try {
      if (isKeycloakReady && keycloak.authenticated) {
        await keycloakHelpers.logout(options);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  const contextValue = {
    isKeycloakReady,
    isAuthenticated,
    isLoading,
    user,
    keycloakError,
    keycloak: isKeycloakReady ? keycloak : null,
    login: handleLogin,
    logout: handleLogout,
    openAccountManagement: () => isKeycloakReady && keycloakHelpers.accountManagement(),
    hasRole: (role) => isKeycloakReady && isAuthenticated ? keycloakHelpers.hasRole(role) : false,
    hasAnyRole: (roles) => isKeycloakReady && isAuthenticated ? keycloakHelpers.hasAnyRole(roles) : false,
    getUserPermissions: () => isKeycloakReady && isAuthenticated ? keycloakHelpers.getUserPermissions() : {},
    getToken: () => isKeycloakReady ? keycloakHelpers.getToken() : null,
    keycloakHelpers: isKeycloakReady ? keycloakHelpers : null,
  };

  return (
    <KeycloakContext.Provider value={contextValue}>
      {children}
    </KeycloakContext.Provider>
  );
};