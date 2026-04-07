// import Keycloak from 'keycloak-js';

// // Keycloak configuration
// const keycloakConfig = {
//   url: process.env.REACT_APP_KEYCLOAK_URL || 'http://localhost:8080',
//   realm: process.env.REACT_APP_KEYCLOAK_REALM || 'cms-realm',
//   clientId: process.env.REACT_APP_KEYCLOAK_CLIENT_ID || 'cms-frontend',
// };

// // Initialize Keycloak instance
// const keycloak = new Keycloak(keycloakConfig);

// // Keycloak initialization options
// export const keycloakInitOptions = {
//   onLoad: 'check-sso', // or 'login-required' for immediate login
//   silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
//   checkLoginIframe: false, // Disable iframe check for development
//   enableLogging: process.env.NODE_ENV === 'development',
// };

// // Helper functions
// export const keycloakHelpers = {
//   // Check if user is authenticated
//   isAuthenticated: () => {
//     return keycloak.authenticated || false;
//   },

//   // Get user token
//   getToken: () => {
//     return keycloak.token;
//   },

//   // Get refresh token
//   getRefreshToken: () => {
//     return keycloak.refreshToken;
//   },

//   // Get user info from token
//   getUserInfo: () => {
//     if (!keycloak.tokenParsed) return null;
    
//     return {
//       id: keycloak.tokenParsed.sub,
//       username: keycloak.tokenParsed.preferred_username,
//       email: keycloak.tokenParsed.email,
//       firstName: keycloak.tokenParsed.given_name,
//       lastName: keycloak.tokenParsed.family_name,
//       name: keycloak.tokenParsed.name || 
//             `${keycloak.tokenParsed.given_name || ''} ${keycloak.tokenParsed.family_name || ''}`.trim() ||
//             keycloak.tokenParsed.preferred_username,
//       roles: keycloak.tokenParsed.realm_access?.roles || [],
//       clientRoles: keycloak.tokenParsed.resource_access?.[keycloakConfig.clientId]?.roles || [],
//     };
//   },

//   // Check if user has specific role
//   hasRole: (role) => {
//     return keycloak.hasRealmRole(role) || keycloak.hasResourceRole(role, keycloakConfig.clientId);
//   },

//   // Check if user has any of the specified roles
//   hasAnyRole: (roles) => {
//     return roles.some(role => keycloakHelpers.hasRole(role));
//   },

//   // Login
//   login: (options = {}) => {
//     return keycloak.login({
//       redirectUri: window.location.origin + '/app/projects',
//       ...options
//     });
//   },

//   // Logout
//   logout: (options = {}) => {
//     return keycloak.logout({
//       redirectUri: window.location.origin + '/login',
//       ...options
//     });
//   },

//   // Update token if it's about to expire
//   updateToken: (minValidity = 30) => {
//     return keycloak.updateToken(minValidity);
//   },

//   // Account management
//   accountManagement: () => {
//     return keycloak.accountManagement();
//   },

//   // Get user permissions based on 3-role system (admin, supervisor, client)
//   getUserPermissions: () => {
//     const userInfo = keycloakHelpers.getUserInfo();
//     if (!userInfo) return {};

//     const roles = [...userInfo.roles, ...userInfo.clientRoles];
//     const isAdmin = roles.includes('admin');
//     const isSupervisor = roles.includes('supervisor');
//     const isClient = roles.includes('client');

//     return {
//       // Project Management
//       canCreateProject: isAdmin,
//       canEditProject: isAdmin || isSupervisor,
//       canDeleteProject: isAdmin,
//       canViewProjects: true, // All roles can view projects
//       canAssignProjects: isAdmin,

//       // User Management
//       canCreateUsers: isAdmin,
//       canEditUsers: isAdmin,
//       canDeleteUsers: isAdmin,
//       canViewUsers: isAdmin,

//       // Inventory Management
//       canManageInventory: isAdmin || isSupervisor,
//       canViewInventory: true, // All roles can view inventory
//       canAddInventoryItems: isAdmin || isSupervisor,
//       canEditInventoryItems: isAdmin || isSupervisor,
//       canDeleteInventoryItems: isAdmin,

//       // Daily Reports
//       canCreateReports: isAdmin || isSupervisor,
//       canEditReports: isAdmin || isSupervisor,
//       canDeleteReports: isAdmin,
//       canViewReports: true, // All roles can view reports

//       // Financial Management
//       canManagePayments: isAdmin,
//       canViewFinancials: isAdmin || isSupervisor,
//       canApprovePayments: isAdmin,

//       // Drawing Management
//       canUploadDrawings: isAdmin || isSupervisor,
//       canApproveDrawings: isAdmin || isSupervisor,
//       canRejectDrawings: isAdmin || isSupervisor,
//       canViewDrawings: true, // All roles can view drawings

//       // Dashboard Access
//       canViewDashboard: true, // All authenticated users can view dashboard
//       canViewAllProjects: isAdmin,
//       canViewAssignedProjects: isSupervisor || isClient,

//       // System Settings
//       canManageSettings: isAdmin,
//       canViewSettings: isAdmin,

//       // Role identification
//       role: isAdmin ? 'admin' : isSupervisor ? 'supervisor' : isClient ? 'client' : 'unknown',
//       isAdmin,
//       isSupervisor,
//       isClient
//     };
//   }
// };

// export default keycloak;





import Keycloak from 'keycloak-js';

// Keycloak configuration — reads from env vars
const keycloakConfig = {
  url: process.env.REACT_APP_KEYCLOAK_URL || 'http://localhost:8080',
  realm: process.env.REACT_APP_KEYCLOAK_REALM || 'elva',
  clientId: process.env.REACT_APP_KEYCLOAK_CLIENT_ID || 'sbpatil',
};

// Initialize Keycloak instance
const keycloak = new Keycloak(keycloakConfig);

// Keycloak initialization options
export const keycloakInitOptions = {
  onLoad: 'check-sso',
  silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
  checkLoginIframe: false,
  enableLogging: true,
  pkceMethod: 'S256',
  flow: 'standard',
};

// Helper functions
export const keycloakHelpers = {
  isAuthenticated: () => keycloak.authenticated || false,

  getToken: () => keycloak.token,

  getRefreshToken: () => keycloak.refreshToken,

  getUserInfo: () => {
    if (!keycloak.tokenParsed) return null;
    return {
      id: keycloak.tokenParsed.sub,
      username: keycloak.tokenParsed.preferred_username,
      email: keycloak.tokenParsed.email,
      firstName: keycloak.tokenParsed.given_name,
      lastName: keycloak.tokenParsed.family_name,
      name: keycloak.tokenParsed.name ||
            `${keycloak.tokenParsed.given_name || ''} ${keycloak.tokenParsed.family_name || ''}`.trim() ||
            keycloak.tokenParsed.preferred_username,
      roles: keycloak.tokenParsed.realm_access?.roles || [],
      clientRoles: keycloak.tokenParsed.resource_access?.[keycloakConfig.clientId]?.roles || [],
      // Derive single role
      role: keycloak.tokenParsed.realm_access?.roles?.includes('admin') ? 'admin'
          : keycloak.tokenParsed.realm_access?.roles?.includes('supervisor') ? 'supervisor'
          : 'client'
    };
  },

  hasRole: (role) => keycloak.hasRealmRole(role) || keycloak.hasResourceRole(role, keycloakConfig.clientId),

  hasAnyRole: (roles) => roles.some(role => keycloakHelpers.hasRole(role)),

  login: (options = {}) => keycloak.login({
    redirectUri: window.location.origin + '/app/projects',
    ...options
  }),

  logout: (options = {}) => keycloak.logout({
    redirectUri: window.location.origin + '/login',
    ...options
  }),

  updateToken: (minValidity = 30) => keycloak.updateToken(minValidity),

  accountManagement: () => keycloak.accountManagement(),

  getUserPermissions: () => {
    const userInfo = keycloakHelpers.getUserInfo();
    if (!userInfo) return {};

    const roles = [...userInfo.roles, ...userInfo.clientRoles];
    const isAdmin = roles.includes('admin');
    const isSupervisor = roles.includes('supervisor');
    const isClient = roles.includes('client');

    return {
      canCreateProject: isAdmin,
      canEditProject: isAdmin || isSupervisor,
      canDeleteProject: isAdmin,
      canViewProjects: true,
      canAssignProjects: isAdmin,
      canCreateUsers: isAdmin,
      canEditUsers: isAdmin,
      canDeleteUsers: isAdmin,
      canViewUsers: isAdmin,
      canManageInventory: isAdmin || isSupervisor,
      canViewInventory: true,
      canAddInventoryItems: isAdmin || isSupervisor,
      canEditInventoryItems: isAdmin || isSupervisor,
      canDeleteInventoryItems: isAdmin,
      canCreateReports: isAdmin || isSupervisor,
      canEditReports: isAdmin || isSupervisor,
      canDeleteReports: isAdmin,
      canViewReports: true,
      canManagePayments: isAdmin,
      canViewFinancials: isAdmin || isSupervisor,
      canApprovePayments: isAdmin,
      canUploadDrawings: isAdmin || isSupervisor,
      canApproveDrawings: isAdmin || isSupervisor,
      canRejectDrawings: isAdmin || isSupervisor,
      canViewDrawings: true,
      canViewDashboard: true,
      canViewAllProjects: isAdmin,
      canViewAssignedProjects: isSupervisor || isClient,
      canManageSettings: isAdmin,
      canViewSettings: isAdmin,
      role: isAdmin ? 'admin' : isSupervisor ? 'supervisor' : isClient ? 'client' : 'unknown',
      isAdmin,
      isSupervisor,
      isClient
    };
  }
};

export default keycloak;