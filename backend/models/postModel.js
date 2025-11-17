import { pool } from "./db.js";

export const getAllPosts = async () => {
  const res = await pool.query(`
    SELECT p.*, u.username, u.avatar
    FROM posts p
    JOIN users u ON u.id = p.user_id
    ORDER BY p.created_at DESC
  `);

  const posts = res.rows.map(post => ({
    id: post.id,
    user_id: post.user_id,
    user: { username: post.username, avatar: post.avatar },
    content: post.content,
    likes: post.likes,
    reposts: post.reposts,
    created_at: post.created_at,
    comments: []
  }));

  for (let post of posts) {
    const commentsRes = await pool.query(`
      SELECT c.id, c.text, c.user_id, u.username, u.avatar
      FROM comments c
      JOIN users u ON u.id = c.user_id
      WHERE c.post_id=$1
    `, [post.id]);

    post.comments = commentsRes.rows.map(c => ({
      id: c.id,
      text: c.text,
      user_id: c.user_id,
      user: { username: c.username, avatar: c.avatar }
    }));
  }

  return posts;
};

export const createPost = async (user_id, content) => {
  const res = await pool.query(
    "INSERT INTO posts(user_id, content) VALUES($1,$2) RETURNING *",
    [user_id, content]
  );
  return res.rows[0];
};

export const likePost = async (postId) => {
  await pool.query("UPDATE posts SET likes = likes + 1 WHERE id=$1", [postId]);
  const res = await pool.query("SELECT * FROM posts WHERE id=$1", [postId]);
  return res.rows[0];
};

export const repostPost = async (postId) => {
  await pool.query("UPDATE posts SET reposts = reposts + 1 WHERE id=$1", [postId]);
  const res = await pool.query("SELECT * FROM posts WHERE id=$1", [postId]);
  return res.rows[0];
};

export const addComment = async (postId, userId, text) => {
  const res = await pool.query(
    "INSERT INTO comments(post_id, user_id, text) VALUES($1,$2,$3) RETURNING *",
    [postId, userId, text]
  );
  return res.rows[0];
};
