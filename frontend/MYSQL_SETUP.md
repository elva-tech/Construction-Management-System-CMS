# MySQL Database Setup Guide

This guide will help you set up MySQL database for the CMS application.

## 🗄️ Prerequisites

### 1. Install MySQL Server

#### **Windows:**
1. Download MySQL Installer from https://dev.mysql.com/downloads/installer/
2. Run the installer and choose "Developer Default"
3. Set root password during installation
4. Complete the installation

#### **macOS:**
```bash
# Using Homebrew
brew install mysql
brew services start mysql

# Set root password
mysql_secure_installation
```

#### **Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install mysql-server
sudo mysql_secure_installation
```

### 2. Verify MySQL Installation

```bash
mysql --version
```

## 🚀 Database Setup

### Method 1: Using MySQL Command Line

1. **Login to MySQL:**
```bash
mysql -u root -p
```

2. **Run the setup script:**
```sql
source backend/setup-mysql.sql
```

3. **Exit MySQL:**
```sql
exit;
```

### Method 2: Using MySQL Workbench

1. Open MySQL Workbench
2. Connect to your MySQL server
3. Open `backend/setup-mysql.sql`
4. Execute the script

### Method 3: Manual Setup

```sql
-- Create database
CREATE DATABASE cms_database CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Use the database
USE cms_database;

-- Verify
SHOW DATABASES;
```

## ⚙️ Environment Configuration

Update your `backend/.env` file:

```env
# MySQL Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=cms_database
DB_USER=root
DB_PASSWORD=your_mysql_root_password

# For custom user (optional)
# DB_USER=cms_user
# DB_PASSWORD=cms_password
```

## 🔧 Application Setup

### 1. Install Dependencies

```bash
cd backend
npm install mysql2 sequelize sequelize-cli
```

### 2. Start the Backend Server

```bash
npm run dev
```

### 3. Verify Database Connection

Check the console output for:
```
✅ MySQL Connected successfully
📊 Database: cms_database
🔗 Host: localhost:3306
📋 Database tables synchronized
🌱 Starting database seeding...
✅ Users created
✅ Clients created
✅ Projects created
✅ Daily reports created
✅ Daily report entries created
✅ Inventory created
✅ Labour records created
🎉 Database seeding completed successfully!
```

## 📊 Database Schema

The application will automatically create these tables:

### **Core Tables:**
- `users` - User accounts and authentication
- `clients` - Client information
- `projects` - Project details
- `daily_reports` - Daily progress reports
- `daily_report_entries` - Individual report entries
- `inventory` - Material inventory tracking
- `labour` - Worker and payment records

### **Sample Data:**
The application automatically seeds the database with:
- 2 demo users (admin, demo)
- 2 sample clients
- 2 sample projects
- Sample daily reports with entries
- Sample inventory items
- Sample labour records

## 🔍 Verify Database Setup

### 1. Check Tables

```sql
USE cms_database;
SHOW TABLES;
```

### 2. Check Sample Data

```sql
-- Check users
SELECT id, username, name, roles FROM users;

-- Check projects
SELECT id, name, status, budget FROM projects;

-- Check inventory
SELECT id, material, unit, totalReceived, totalConsumed, remaining FROM inventory;
```

### 3. Test API Endpoints

```bash
# Health check
curl http://localhost:3001/health

# Login test
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "demo", "password": "demo"}'

# Get projects (with token)
curl -X GET http://localhost:3001/api/v1/projects \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🛠️ Troubleshooting

### Common Issues:

#### **1. Connection Refused**
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```
**Solution:**
- Ensure MySQL server is running
- Check if port 3306 is available
- Verify MySQL service status

#### **2. Access Denied**
```
Error: Access denied for user 'root'@'localhost'
```
**Solution:**
- Check username and password in `.env`
- Reset MySQL root password if needed
- Ensure user has proper privileges

#### **3. Database Doesn't Exist**
```
Error: Unknown database 'cms_database'
```
**Solution:**
- Run the setup script: `source backend/setup-mysql.sql`
- Or manually create: `CREATE DATABASE cms_database;`

#### **4. Port Already in Use**
```
Error: listen EADDRINUSE :::3306
```
**Solution:**
- Check what's using port 3306: `netstat -an | grep 3306`
- Stop conflicting services
- Or change MySQL port in configuration

### **Reset Database:**

```sql
-- Drop and recreate database
DROP DATABASE IF EXISTS cms_database;
CREATE DATABASE cms_database CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Then restart the backend server to recreate tables and seed data.

## 🔐 Security Considerations

### **Production Setup:**

1. **Create dedicated user:**
```sql
CREATE USER 'cms_user'@'localhost' IDENTIFIED BY 'strong_password';
GRANT ALL PRIVILEGES ON cms_database.* TO 'cms_user'@'localhost';
FLUSH PRIVILEGES;
```

2. **Update environment variables:**
```env
DB_USER=cms_user
DB_PASSWORD=strong_password
```

3. **Enable SSL (recommended):**
```env
DB_SSL=true
```

4. **Regular backups:**
```bash
mysqldump -u root -p cms_database > backup.sql
```

## 📈 Performance Optimization

### **For Production:**

1. **Optimize MySQL configuration**
2. **Add database indexes**
3. **Enable query caching**
4. **Monitor slow queries**
5. **Regular maintenance**

## 🎯 Next Steps

1. ✅ **Database Setup Complete**
2. 🔄 **Start Backend Server**
3. 🌐 **Test API Endpoints**
4. 💻 **Connect Frontend**
5. 📊 **Verify Data Flow**

Your MySQL database is now ready for the CMS application! 🎉
