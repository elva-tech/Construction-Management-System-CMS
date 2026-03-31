# 🔐 Complete Keycloak Configuration Guide for CMS

## Prerequisites Setup

### 1. Install Docker Desktop
1. Download from: https://www.docker.com/products/docker-desktop/
2. Install and restart your computer
3. Start Docker Desktop

### 2. Start Keycloak Server
1. Open Command Prompt in your project folder
2. Run: `setup-keycloak.bat`
3. Wait for setup to complete (2-3 minutes)
4. Access: http://localhost:8080

## Keycloak Configuration Steps

### Step 1: Login to Admin Console
- URL: http://localhost:8080
- Username: `admin`
- Password: `admin123`

### Step 2: Create CMS Realm
1. Click on "Master" dropdown (top-left)
2. Click "Create Realm"
3. Enter Realm name: `cms-realm`
4. Click "Create"

### Step 3: Create Roles
1. Go to "Realm roles" in left sidebar
2. Click "Create role" and create these roles:

**Role 1: admin**
- Name: `admin`
- Description: `Full system administrator with all permissions`

**Role 2: supervisor**
- Name: `supervisor`
- Description: `Project supervisor with project management permissions`

**Role 3: client**
- Name: `client`
- Description: `Client with view-only permissions for assigned projects`

### Step 4: Create Frontend Client
1. Go to "Clients" in left sidebar
2. Click "Create client"
3. Configure:
   - Client type: `OpenID Connect`
   - Client ID: `cms-frontend`
   - Name: `CMS Frontend Application`
4. Click "Next"
5. Configure Capability:
   - Client authentication: `OFF`
   - Authorization: `OFF`
   - Standard flow: `ON`
   - Direct access grants: `ON`
6. Click "Next"
7. Configure Login settings:
   - Root URL: `http://localhost:3000`
   - Home URL: `http://localhost:3000`
   - Valid redirect URIs: `http://localhost:3000/*`
   - Valid post logout redirect URIs: `http://localhost:3000/*`
   - Web origins: `http://localhost:3000`
8. Click "Save"

### Step 5: Create Backend Client
1. Go to "Clients" in left sidebar
2. Click "Create client"
3. Configure:
   - Client type: `OpenID Connect`
   - Client ID: `cms-backend`
   - Name: `CMS Backend API`
4. Click "Next"
5. Configure Capability:
   - Client authentication: `ON`
   - Authorization: `OFF`
   - Service accounts roles: `ON`
6. Click "Next"
7. Configure Login settings:
   - Root URL: `http://localhost:3001`
   - Valid redirect URIs: `http://localhost:3001/*`
8. Click "Save"
9. Go to "Credentials" tab and copy the "Client secret"

### Step 6: Create Test Users
1. Go to "Users" in left sidebar
2. Click "Create new user"

**Admin User:**
- Username: `admin`
- Email: `admin@cms.com`
- First name: `Admin`
- Last name: `User`
- Email verified: `ON`
- Enabled: `ON`
- Click "Create"
- Go to "Credentials" tab → Set password: `admin123` (Temporary: OFF)
- Go to "Role mapping" tab → Assign roles → Select `admin`

**Supervisor User:**
- Username: `supervisor`
- Email: `supervisor@cms.com`
- First name: `Project`
- Last name: `Supervisor`
- Email verified: `ON`
- Enabled: `ON`
- Click "Create"
- Go to "Credentials" tab → Set password: `supervisor123` (Temporary: OFF)
- Go to "Role mapping" tab → Assign roles → Select `supervisor`

**Client User:**
- Username: `client`
- Email: `client@cms.com`
- First name: `Project`
- Last name: `Client`
- Email verified: `ON`
- Enabled: `ON`
- Click "Create"
- Go to "Credentials" tab → Set password: `client123` (Temporary: OFF)
- Go to "Role mapping" tab → Assign roles → Select `client`

## Environment Configuration

### Update .env file:
```env
# Keycloak Configuration
REACT_APP_KEYCLOAK_URL=http://localhost:8080
REACT_APP_KEYCLOAK_REALM=cms-realm
REACT_APP_KEYCLOAK_CLIENT_ID=cms-frontend
```

### Update backend .env file:
```env
# Keycloak Configuration
KEYCLOAK_URL=http://localhost:8080
KEYCLOAK_REALM=cms-realm
KEYCLOAK_CLIENT_ID=cms-backend
KEYCLOAK_CLIENT_SECRET=[paste the client secret from Step 5]
```

## Testing the Setup

### Test Users:
- **Admin**: admin / admin123
- **Supervisor**: supervisor / supervisor123  
- **Client**: client / client123

### Verification Steps:
1. Start your React app: `npm start`
2. Go to login page
3. Try logging in with each test user
4. Verify role-based access works

## Troubleshooting

### Common Issues:
1. **Docker not running**: Start Docker Desktop
2. **Port 8080 in use**: Stop other services using port 8080
3. **Services not starting**: Run `docker-compose -f docker-compose.keycloak.yml logs`
4. **Connection refused**: Wait longer for services to start

### Useful Commands:
```bash
# Check service status
docker-compose -f docker-compose.keycloak.yml ps

# View logs
docker-compose -f docker-compose.keycloak.yml logs keycloak

# Restart services
docker-compose -f docker-compose.keycloak.yml restart

# Stop services
docker-compose -f docker-compose.keycloak.yml down
```

## Next Steps
After completing this setup, you'll have:
- ✅ Keycloak server running
- ✅ CMS realm configured
- ✅ 3 roles defined (admin, supervisor, client)
- ✅ Frontend and backend clients configured
- ✅ Test users for each role
- ✅ Ready for role-based application development
