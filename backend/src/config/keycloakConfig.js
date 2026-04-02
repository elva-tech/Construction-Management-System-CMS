module.exports = {
  KEYCLOAK_URL: "http://localhost:8080",
  REALM: "elva",
  CLIENTS: [
    {
      CLIENT_ID: "sbpatil",
      CLIENT_SECRET: "B7Xe3B2awgwVI99quW49yVFGmxcfSLDP",
    },
  ],
  // Test users for development (bypass Keycloak)
 TEST_USERS: [
  {
    id: "admin-001",        // ← ADD
    username: "admin",
    password: "admin123",
    email: "admin@elva.com",  // ← ADD
    name: "Admin",            // ← ADD
    roles: ["Admin"]
  },
  {
    id: "admin-002",        // ← ADD
    username: "user",
    password: "user123",
    email: "user@elva.com",   // ← ADD
    name: "User",             // ← ADD
    roles: ["User"]
  }
]
};
