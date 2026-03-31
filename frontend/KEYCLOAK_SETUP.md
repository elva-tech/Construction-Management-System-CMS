# Keycloak Setup Guide for CMS Application

This guide will help you set up Keycloak for the Construction Management System.

## Prerequisites

- Docker and Docker Compose installed
- Node.js and npm installed
- Basic understanding of Keycloak concepts

## Quick Start with Docker

### 1. Start Keycloak Server

Create a `docker-compose.yml` file in your project root:

```yaml
version: '3.8'
services:
  keycloak:
    image: quay.io/keycloak/keycloak:23.0.0
    environment:
      KEYCLOAK_ADMIN: admin
      KEYCLOAK_ADMIN_PASSWORD: admin123
      KC_DB: dev-file
    ports:
      - "8080:8080"
    command: start-dev
    volumes:
      - keycloak_data:/opt/keycloak/data

volumes:
  keycloak_data:
```

Start Keycloak:
```bash
docker-compose up -d
```

### 2. Access Keycloak Admin Console

1. Open http://localhost:8080
2. Click "Administration Console"
3. Login with:
   - Username: `admin`
   - Password: `admin123`

### 3. Create Realm

1. Click "Create Realm" button
2. Enter realm name: `cms-realm`
3. Click "Create"

### 4. Create Client

1. Go to "Clients" in the left sidebar
2. Click "Create client"
3. Fill in:
   - Client type: `OpenID Connect`
   - Client ID: `cms-frontend`
   - Name: `CMS Frontend Application`
4. Click "Next"
5. Configure:
   - Client authentication: `OFF` (public client)
   - Authorization: `OFF`
   - Standard flow: `ON`
   - Direct access grants: `ON`
6. Click "Next"
7. Valid redirect URIs:
   - `http://localhost:3000/*`
   - `http://localhost:3001/*`
8. Web origins: `*`
9. Click "Save"

### 5. Create Roles

1. Go to "Realm roles" in the left sidebar
2. Create the following roles:
   - `admin` - Full system access
   - `manager` - Project and team management
   - `project-manager` - Project-specific management
   - `inventory-manager` - Inventory management
   - `finance-manager` - Financial operations
   - `viewer` - Read-only access

### 6. Create Users

1. Go to "Users" in the left sidebar
2. Click "Add user"
3. Create test users:

#### Admin User
- Username: `admin`
- Email: `admin@cms.com`
- First name: `Admin`
- Last name: `User`
- Email verified: `ON`
- Enabled: `ON`

#### Manager User
- Username: `manager`
- Email: `manager@cms.com`
- First name: `Manager`
- Last name: `User`
- Email verified: `ON`
- Enabled: `ON`

#### Demo User
- Username: `demo`
- Email: `demo@cms.com`
- First name: `Demo`
- Last name: `User`
- Email verified: `ON`
- Enabled: `ON`

### 7. Set User Passwords

For each user:
1. Click on the user
2. Go to "Credentials" tab
3. Click "Set password"
4. Enter password (e.g., `password123`)
5. Set "Temporary": `OFF`
6. Click "Save"

### 8. Assign Roles to Users

For each user:
1. Click on the user
2. Go to "Role mapping" tab
3. Click "Assign role"
4. Select appropriate roles:
   - Admin user: `admin`
   - Manager user: `manager`, `project-manager`
   - Demo user: `admin` (for testing)

## Environment Configuration

Update your `.env` file:

```env
# Keycloak Configuration
REACT_APP_KEYCLOAK_URL=http://localhost:8080
REACT_APP_KEYCLOAK_REALM=cms-realm
REACT_APP_KEYCLOAK_CLIENT_ID=cms-frontend
```

## Testing the Integration

1. Start your React application:
   ```bash
   npm start
   ```

2. Navigate to http://localhost:3000

3. The application will:
   - Try to initialize Keycloak
   - If Keycloak is available, redirect to Keycloak login
   - If Keycloak is not available, fall back to mock authentication

## User Roles and Permissions

The application maps Keycloak roles to the following permissions:

- **admin**: Full access to all features
- **manager**: Project management, user management, reports
- **project-manager**: Project-specific management
- **inventory-manager**: Inventory and material management
- **finance-manager**: Payment and financial management
- **viewer**: Read-only access to reports and data

## Troubleshooting

### Keycloak Not Starting
- Check if port 8080 is available
- Verify Docker is running
- Check Docker logs: `docker-compose logs keycloak`

### Authentication Fails
- Verify realm name matches configuration
- Check client ID and redirect URIs
- Ensure user has correct roles assigned

### CORS Issues
- Add your application URL to "Web origins" in client settings
- Use `*` for development (not recommended for production)

## Production Considerations

1. **Use PostgreSQL Database**:
   ```yaml
   services:
     postgres:
       image: postgres:15
       environment:
         POSTGRES_DB: keycloak
         POSTGRES_USER: keycloak
         POSTGRES_PASSWORD: password
     
     keycloak:
       environment:
         KC_DB: postgres
         KC_DB_URL: jdbc:postgresql://postgres:5432/keycloak
         KC_DB_USERNAME: keycloak
         KC_DB_PASSWORD: password
   ```

2. **Enable HTTPS**
3. **Configure proper realm settings**
4. **Set up email server for user registration**
5. **Configure session timeouts**
6. **Set up backup and monitoring**

## Additional Features

### Social Login
Configure social identity providers (Google, GitHub, etc.) in Keycloak admin console.

### Multi-factor Authentication
Enable OTP or other MFA methods in realm security settings.

### User Self-Registration
Enable user registration in realm login settings.

For more detailed Keycloak configuration, refer to the [official Keycloak documentation](https://www.keycloak.org/documentation).
