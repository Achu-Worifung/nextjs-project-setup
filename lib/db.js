// lib/db.js
import pkg from 'pg';
const { Pool } = pkg;

// These map to your .env.local
const pool = new Pool({
  host:     process.env.PGHOST,
  port:     process.env.PGPORT,
  database: process.env.PGDATABASE,
  user:     process.env.PGUSER,
  password: process.env.PGPASSWORD,
  ssl:       process.env.PGSSLMODE === 'require' ? { rejectUnauthorized: false } : false,
});

export default pool;