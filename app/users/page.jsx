// app/users/page.jsx
import pool from '../../lib/db';

export default async function UsersPage() {
  const { rows: users } = await pool.query('SELECT id, name FROM users;');

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map(u => (
          <li key={u.id}>{u.name}</li>
        ))}
      </ul>
    </div>
  );
}