import { pool } from "../db.js";

// Получить пользователя по ID
export async function getUserById(id) {
  const { rows } = await pool.query(
    `SELECT id, email, username, avatar_url AS avatar, riot_id, rank, role, xp, created_at
     FROM users
     WHERE id = $1 LIMIT 1`,
    [id]
  );
  return rows[0];
}

// Обновить профиль
export async function updateUser(id, { username, email, avatar_url }) {
  const { rows } = await pool.query(
    `UPDATE users
     SET username = $1, email = $2, avatar_url = $3
     WHERE id = $4
     RETURNING id, email, username, avatar_url AS avatar, riot_id, rank, role, xp, created_at`,
    [username, email, avatar_url, id]
  );
  return rows[0];
}
