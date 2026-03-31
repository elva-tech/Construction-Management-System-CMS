const mysql2 = require('mysql2/promise');
require("dotenv").config();

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
  rejectUnauthorized: false
}
};

// Create connection pool
const pool = mysql2.createPool(dbConfig);

// Test the connection (optional - won't crash if DB is not available)
// const testConnection = async () => {
//   try {
//     const connection = await pool.getConnection();
//     console.log("Database connected successfully");
//     connection.release();
//   } catch (error) {
//     console.warn("Database connection failed (continuing without DB):", error.message);
//     console.warn("Note: Set up MySQL database for full functionality");
//   }
// };


const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("Database connected successfully");
    connection.release();
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1); // 🔥 kill app
  }
};

// Test connection on startup
testConnection();

module.exports = pool;
