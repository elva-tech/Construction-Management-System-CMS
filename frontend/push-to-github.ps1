# PowerShell script to push CMS project to GitHub
Write-Host "🚀 Pushing CMS project to GitHub repository..." -ForegroundColor Green
Write-Host ""

# Navigate to script directory
Set-Location $PSScriptRoot

try {
    # Check if git is installed
    Write-Host "Checking Git installation..." -ForegroundColor Yellow
    git --version
    if ($LASTEXITCODE -ne 0) {
        throw "Git is not installed or not in PATH"
    }

    # Initialize git repository
    Write-Host "Initializing Git repository..." -ForegroundColor Yellow
    git init

    # Create README.md
    Write-Host "Creating README.md..." -ForegroundColor Yellow
    @"
# CMS - Construction Management System

A comprehensive Construction Management System built with React.

## Features
- Project Management
- Daily Work Reports  
- Inventory Management
- Labour Payment Tracking
- Client Payment Management
- Document Management
- Dashboard Analytics

## Installation
1. Clone the repository
2. Run ``npm install``
3. Run ``npm start``

## Login Credentials (Demo)
- Username: demo, Password: demo
- Username: admin, Password: admin123
- Username: manager, Password: manager123
- Username: user, Password: user123

## Technology Stack
- React 18.2.0
- React Router DOM 6.22.3
- Tailwind CSS 3.4.17
- Framer Motion 12.16.0
- Formik 2.4.6
- PDF-lib 1.17.1

## Project Structure
- `/src/Pages` - Main application pages
- `/src/Components` - Reusable UI components
- `/src/context` - React context providers
- `/src/services` - API services
- `/src/routes` - Application routing

## Development
- Development server runs on http://localhost:3000
- Built with Create React App
- Uses localStorage for demo data persistence
"@ | Out-File -FilePath "README.md" -Encoding UTF8

    # Add all files
    Write-Host "Adding all files to git..." -ForegroundColor Yellow
    git add .

    # Create initial commit
    Write-Host "Creating initial commit..." -ForegroundColor Yellow
    git commit -m "Initial commit - CMS Construction Management System with React frontend"

    # Set updated-frontend branch
    Write-Host "Setting updated-frontend branch..." -ForegroundColor Yellow
    git branch -M updated-frontend

    # Add remote origin
    Write-Host "Adding remote repository..." -ForegroundColor Yellow
    git remote add origin https://github.com/elva-tech/CMS.git

    # Push to GitHub
    Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
    git push -u origin updated-frontend

    Write-Host ""
    Write-Host "✅ Successfully pushed to GitHub!" -ForegroundColor Green
    Write-Host "Repository URL: https://github.com/elva-tech/CMS/tree/updated-frontend" -ForegroundColor Cyan
    Write-Host ""
}
catch {
    Write-Host "❌ Error occurred: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please ensure:" -ForegroundColor Yellow
    Write-Host "1. Git is installed and in your PATH" -ForegroundColor Yellow
    Write-Host "2. You're authenticated with GitHub" -ForegroundColor Yellow
    Write-Host "3. The repository exists at https://github.com/elva-tech/CMS.git" -ForegroundColor Yellow
}

Read-Host "Press Enter to continue..."
