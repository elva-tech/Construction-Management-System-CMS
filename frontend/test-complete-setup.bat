@echo off
echo ========================================
echo    CMS Complete Setup Test
echo ========================================
echo.

echo Checking Keycloak Status...
curl -s http://localhost:8080/health/ready >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Keycloak is not running!
    echo Please start Keycloak: docker-compose -f docker-compose.keycloak.yml up -d
    pause
    exit /b 1
)
echo ✅ Keycloak is running

echo.
echo Checking Keycloak Admin Console...
curl -s http://localhost:8080 >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Keycloak Admin Console not accessible!
    pause
    exit /b 1
)
echo ✅ Keycloak Admin Console accessible

echo.
echo ========================================
echo    Test Users Available
echo ========================================
echo.
echo 🔐 KEYCLOAK USERS (Real Authentication):
echo    Realm: cms-realm
echo    URL: http://localhost:8080
echo.
echo    1. ADMIN
echo       Username: admin
echo       Password: admin123
echo       Role: admin
echo       Access: Full system control
echo.
echo    2. SUPERVISOR  
echo       Username: supervisor
echo       Password: supervisor123
echo       Role: supervisor
echo       Access: Project management, inventory, reports
echo.
echo    3. CLIENT
echo       Username: client
echo       Password: client123
echo       Role: client
echo       Access: View-only for assigned projects
echo.
echo 🎭 MOCK USERS (Fallback Authentication):
echo    (Works even if Keycloak is down)
echo.
echo    1. admin / admin123 (Admin role)
echo    2. supervisor / supervisor123 (Supervisor role)
echo    3. client / client123 (Client role)
echo    4. demo / demo (Admin role)
echo.

echo ========================================
echo    Testing Instructions
echo ========================================
echo.
echo 1. Start React App:
echo    npm start
echo.
echo 2. Test Mock Authentication:
echo    - Go to login page
echo    - Try: admin / admin123
echo    - Verify admin features are visible
echo.
echo 3. Test Keycloak Authentication:
echo    - Logout from mock user
echo    - Login should redirect to Keycloak
echo    - Try: admin / admin123 (Keycloak user)
echo.
echo 4. Test Role-Based Access:
echo    - Login as different roles
echo    - Verify UI changes based on permissions
echo.

echo Expected Role Permissions:
echo.
echo 👑 ADMIN:
echo    ✅ Create/Edit/Delete Projects
echo    ✅ Manage Users
echo    ✅ Full Inventory Management
echo    ✅ Financial Management
echo    ✅ Approve/Reject Drawings
echo    ✅ System Settings
echo.
echo 👷 SUPERVISOR:
echo    ✅ Edit Projects (assigned)
echo    ✅ Manage Inventory
echo    ✅ Create/Edit Reports
echo    ✅ Upload/Approve Drawings
echo    ✅ View Financials
echo    ❌ Create Projects
echo    ❌ Manage Users
echo    ❌ System Settings
echo.
echo 👤 CLIENT:
echo    ✅ View Projects (assigned)
echo    ✅ View Reports
echo    ✅ View Drawings
echo    ✅ View Inventory
echo    ❌ Edit anything
echo    ❌ Create anything
echo    ❌ Manage anything
echo.

echo ========================================
echo    Ready to Test!
echo ========================================
echo.
echo Next Steps:
echo 1. Run: npm start
echo 2. Test login with different users
echo 3. Verify role-based features work
echo.
pause
