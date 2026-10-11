const mysql = require('mysql2/promise');

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'furniture_factory',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

const pool = mysql.createPool(dbConfig);

// Test connection
pool.getConnection().then(() => {
  console.log('✅ MySQL Database connected successfully');
}).catch((err) => {
  console.error('❌ MySQL Connection Error:', err.message);
  console.log('⚠️  Running in demo mode without database');
});

module.exports = pool;
