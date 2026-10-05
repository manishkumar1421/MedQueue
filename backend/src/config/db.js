const mysql = require('mysql2/promise');
require('dotenv').config();

// Create a connection pool (more efficient than single connection)
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  database: process.env.DB_NAME || 'medqueue_db',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: '+05:30',   // IST
  charset: 'utf8mb4'
});

// Test connection on startup
const connectDB = async () => {
  try {
    const conn = await pool.getConnection();
    console.log(`✅ MySQL Connected: ${process.env.DB_HOST}:${process.env.DB_PORT} → ${process.env.DB_NAME}`);
    conn.release();
  } catch (err) {
    console.error('❌ MySQL Connection Failed:', err.message);
    console.error('\n🔧 Check your .env file:');
    console.error('   DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD\n');
    process.exit(1);
  }
};

module.exports = { pool, connectDB };
