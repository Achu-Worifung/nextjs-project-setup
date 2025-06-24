// import type { NextApiRequest, NextApiResponse } from 'next'
// import pool from '../../lib'

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   try {
//     const { rows } = await pool.query('SELECT * FROM users')
//     return res.status(200).json(rows)
//   } catch (error) {
//     console.error('Database error:', error)
//     return res.status(500).json({ error: 'Internal Server Error' })
//   }
// }