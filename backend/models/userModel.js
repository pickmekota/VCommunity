import { pool } from "../db.js";

// Получить пользователя по ID
export async function getUserById(id) {
  const { rows } = await pool.query(
    `SELECT id, email, username, avatar_url, riot_id, rank, role, xp, created_at
     FROM users 
     WHERE id = $1
     LIMIT 1`,
    [id]
  );

  return rows[0] || null;
}

// Получить пользователя по email (для login)
export async function getUserRowByEmail(email) {
  const { rows } = await pool.query(
    `SELECT * FROM users WHERE email = $1 LIMIT 1`,
    [email]
  );
  return rows[0] || null;
}

// Создать пользователя
export async function createUser({ email, username, password_hash, riot_id = null }) {
  const { rows } = await pool.query(
    `INSERT INTO users (email, username, password_hash, riot_id)
     VALUES ($1, $2, $3, $4)
     RETURNING id, email, username, riot_id, avatar_url, rank, role, xp, created_at`,
    [email, username, password_hash, riot_id]
  );
  return rows[0];
}

// Обновить профиль пользователя (частичное обновление)
export async function updateUser(id, updateData) {
  const allowed = ["username", "avatar_url", "rank", "role", "xp", "riot_id"];

  const keys = Object.keys(updateData).filter(k => allowed.includes(k));
  if (keys.length === 0) return null;

  const set = keys.map((key, index) => `${key} = $${index + 1}`).join(", ");
  const values = keys.map(key => updateData[key]);

  values.push(id);

  const { rows } = await pool.query(
    `UPDATE users SET ${set}
     WHERE id = $${keys.length + 1}
     RETURNING id, email, username, riot_id, avatar_url, rank, role, xp, created_at`,
    values
  );

  return rows[0];
}
