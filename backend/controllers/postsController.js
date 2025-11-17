import db from "../db.js";

// GET posts
export const getPosts = async (req, res) => {
  try {
    const posts = await db.query(
      `SELECT * FROM posts ORDER BY created_at DESC`
    );
    res.json(posts.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE post
export const createPost = async (req, res) => {
  const { user_id, content } = req.body;

  try {
    const newPost = await db.query(
      `INSERT INTO posts (user_id, content) VALUES ($1, $2) RETURNING *`,
      [user_id, content]
    );
    res.json(newPost.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// LIKE post
export const likePost = async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await db.query(
      `UPDATE posts SET likes = likes + 1 WHERE id = $1 RETURNING *`,
      [id]
    );
    res.json(updated.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
