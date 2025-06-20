import pool from './lib.js';

async function testConnection() {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('Database connected! Time:', result.rows[0].now);
    process.exit(0);
  } catch (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }
}

testConnection();