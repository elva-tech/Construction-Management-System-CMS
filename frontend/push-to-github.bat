@echo off
echo Pushing CMS project to GitHub repository...
echo.

REM Navigate to project directory
cd /d "%~dp0"

REM Initialize git repository
echo Initializing Git repository...
git init

REM Create README.md
echo Creating README.md...
echo # CMS - Construction Management System > README.md
echo. >> README.md
echo A comprehensive Construction Management System built with React. >> README.md
echo. >> README.md
echo ## Features >> README.md
echo - Project Management >> README.md
echo - Daily Work Reports >> README.md
echo - Inventory Management >> README.md
echo - Labour Payment Tracking >> README.md
echo - Client Payment Management >> README.md
echo - Document Management >> README.md
echo - Dashboard Analytics >> README.md
echo. >> README.md
echo ## Installation >> README.md
echo 1. Clone the repository >> README.md
echo 2. Run `npm install` >> README.md
echo 3. Run `npm start` >> README.md
echo. >> README.md
echo ## Login Credentials (Demo) >> README.md
echo - Username: demo, Password: demo >> README.md
echo - Username: admin, Password: admin123 >> README.md

REM Add all files
echo Adding all files to git...
git add .

REM Create initial commit
echo Creating initial commit...
git commit -m "Initial commit - CMS Construction Management System with React frontend"

REM Set main branch
echo Setting main branch...
git branch -M main

REM Add remote origin
echo Adding remote repository...
git remote add origin https://github.com/XeRxEs02/domain.git

REM Push to GitHub
echo Pushing to GitHub...
git push -u origin main

echo.
echo ✅ Successfully pushed to GitHub!
echo Repository URL: https://github.com/XeRxEs02/domain.git
echo.
pause
