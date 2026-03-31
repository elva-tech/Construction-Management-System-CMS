@echo off
echo ========================================
echo    CMS MySQL Database Setup
echo ========================================
echo.

echo Step 1: Checking Docker installation...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker is not installed or not running!
    echo Please install Docker Desktop and run this script again.
    pause
    exit /b 1
)
echo ✅ Docker is installed and running

echo.
echo Step 2: Stopping any existing MySQL containers...
docker-compose -f docker-compose.mysql.yml down

echo.
echo Step 3: Starting MySQL and phpMyAdmin...
echo This may take 2-3 minutes for first-time setup...
docker-compose -f docker-compose.mysql.yml up -d

echo.
echo Step 4: Waiting for MySQL to start...
:wait_mysql
docker exec cms-mysql mysqladmin ping -h localhost -u root -proot123 >nul 2>&1
if %errorlevel% neq 0 (
    echo Waiting for MySQL to start...
    timeout /t 5 /nobreak >nul
    goto wait_mysql
)
echo ✅ MySQL is ready

echo.
echo Step 5: Database schema and sample data loaded automatically!

echo.
echo ========================================
echo    MySQL Setup Complete!
echo ========================================
echo.
echo Database Access:
echo   Host: localhost
echo   Port: 3306
echo   Database: cms_database
echo   Username: cms_user
echo   Password: cms_password123
echo.
echo phpMyAdmin (Web Interface):
echo   URL: http://localhost:8081
echo   Username: root
echo   Password: root123
echo.
echo Sample Data Included:
echo   ✅ 3 Users (admin, supervisor, client)
echo   ✅ 4 Sample Projects
echo   ✅ Material Inventory
echo   ✅ Financial Transactions
echo   ✅ Daily Reports
echo   ✅ Drawing Records
echo.
echo Next Steps:
echo 1. Install MySQL package in backend: npm install mysql2 sequelize
echo 2. Update backend code to use MySQL
echo 3. Test the application
echo.
pause
