@echo off
echo ========================================
echo    CMS Keycloak Setup Script
echo ========================================
echo.

echo Step 1: Checking Docker installation...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker is not installed or not running!
    echo Please install Docker Desktop from: https://www.docker.com/products/docker-desktop/
    echo After installation, restart your computer and run this script again.
    pause
    exit /b 1
)
echo ✅ Docker is installed and running

echo.
echo Step 2: Stopping any existing Keycloak containers...
docker-compose -f docker-compose.keycloak.yml down

echo.
echo Step 3: Starting Keycloak and PostgreSQL...
echo This may take 2-3 minutes for first-time setup...
docker-compose -f docker-compose.keycloak.yml up -d

echo.
echo Step 4: Waiting for services to start...
echo Checking PostgreSQL...
:wait_postgres
docker exec cms-postgres pg_isready -U keycloak >nul 2>&1
if %errorlevel% neq 0 (
    echo Waiting for PostgreSQL to start...
    timeout /t 5 /nobreak >nul
    goto wait_postgres
)
echo ✅ PostgreSQL is ready

echo.
echo Checking Keycloak...
:wait_keycloak
curl -f http://localhost:8080/health/ready >nul 2>&1
if %errorlevel% neq 0 (
    echo Waiting for Keycloak to start...
    timeout /t 10 /nobreak >nul
    goto wait_keycloak
)
echo ✅ Keycloak is ready

echo.
echo ========================================
echo    Setup Complete!
echo ========================================
echo.
echo Keycloak Admin Console: http://localhost:8080
echo Username: admin
echo Password: admin123
echo.
echo Next steps:
echo 1. Open http://localhost:8080 in your browser
echo 2. Login with admin/admin123
echo 3. Follow the configuration guide
echo.
pause
