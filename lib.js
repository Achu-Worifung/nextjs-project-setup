import { Pool } from 'pg'

// In development, avoid creating a new pool on every hot-reload
// eslint-disable-next-line no-var
var pgPool

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
 throw new Error('⚠️ DATABASE_URL environment variable not set')
}

const pool = global.pgPool ?? new Pool({ connectionString })

if (process.env.NODE_ENV !== 'production') {
 global.pgPool = pool
 
}

export default pool