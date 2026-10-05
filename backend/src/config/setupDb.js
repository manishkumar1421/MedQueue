const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const setupDatabase = async () => {
  console.log('🔄 Connecting to MySQL Server...');
  try {
    // Connect without selecting DB first so we can create it
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      multipleStatements: true
    });

    console.log('✅ Connected to MySQL successfully!');

    // Read schema.sql
    const schemaPath = path.join(__dirname, '../../schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf8');

    console.log('📦 Executing schema.sql to create database and tables...');
    await connection.query(sql);

    console.log('🎉 Database "medqueue_db" & all tables created successfully!');
    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n👉 Password galat hai ya empty hai! backend/.env file me DB_PASSWORD set karein.');
    }
    process.exit(1);
  }
};

setupDatabase();
