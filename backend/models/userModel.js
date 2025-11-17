import { pool } from "./db.js";
import bcrypt from "bcrypt";

export const getUserById = async (id) => {
  const res = await pool.query("SELECT id, username, avatar, level FROM users WHERE id=$1", [id]);
  return res.rows[0];
};

export const getUserByUsername = async (username) => {
  const res = await pool.query("SELECT * FROM users WHERE username=$1", [username]);
  return res.rows[0];
};

export const createUser = async (username, password, avatar) => {
  const hash = await bcrypt.hash(password, 10);
  const res = await pool.query(
    "INSERT INTO users(username, password, avatar, level) VALUES($1,$2,$3,1) RETURNING id, username, avatar, level",
    [username, hash, avatar]
  );
  return res.rows[0];
};

export const checkPassword = async (username, password) => {
  const user = await getUserByUsername(username);
  if (!user) return null;
  const match = await bcrypt.compare(password, user.password);
  if (!match) return null;
  return user;
};
