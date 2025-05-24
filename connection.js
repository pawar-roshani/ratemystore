// connection.js
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/ratemystore'
});

const connectDB = async () => {
  try {
    await pool.connect();
    console.log('Connected to PostgreSQL');
  } catch (err) {
    console.error('Database connection failed', err);
  }
};

module.exports = { query: (text, params) => pool.query(text, params), connectDB };
