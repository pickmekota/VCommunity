// backend/models/postModel.js
import { pool } from "../db.js";

/**
 * Create a post
 */
export async function createPost({ user_id, content }) {
  try {
    const { rows } = await pool.query(
      `INSERT INTO posts (user_id, content) VALUES ($1, $2) RETURNING *`,
      [user_id, content]
    );
    return rows[0];
  } catch (err) {
    console.error("createPost error:", err);
    throw err;
  }
}

/**
 * Get posts with user info, counts and up to 5 comments (latest 5) per post
 */
export async function getPosts({ limit = 20, offset = 0 } = {}) {
  try {
    const { rows } = await pool.query(
      `SELECT p.*,
              u.username, u.avatar_url, u.riot_id, u.rank,
              COALESCE(l.likes_count,0) as likes,
              COALESCE(r.reposts_count,0) as reposts,
              COALESCE(c.comments_count,0) as comments_count
       FROM posts p
       JOIN users u ON u.id = p.user_id
       LEFT JOIN (
         SELECT post_id, COUNT(*) as likes_count FROM likes GROUP BY post_id
       ) l ON l.post_id = p.id
       LEFT JOIN (
         SELECT post_id, COUNT(*) as reposts_count FROM reposts GROUP BY post_id
       ) r ON r.post_id = p.id
       LEFT JOIN (
         SELECT post_id, COUNT(*) as comments_count FROM comments GROUP BY post_id
       ) c ON c.post_id = p.id
       ORDER BY p.created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const postIds = rows.map(r => r.id);
    let commentsByPost = {};

    if (postIds.length) {
      // get up to 5 latest comments per post (latest by created_at ASC or DESC as you need)
      const { rows: cRows } = await pool.query(
        `WITH ranked AS (
           SELECT cm.*, u.username, u.avatar_url,
                  ROW_NUMBER() OVER (PARTITION BY cm.post_id ORDER BY cm.created_at DESC) as rn
           FROM comments cm
           JOIN users u ON u.id = cm.user_id
           WHERE cm.post_id = ANY($1)
         )
         SELECT * FROM ranked WHERE rn <= 5 ORDER BY post_id, created_at DESC`,
        [postIds]
      );

      commentsByPost = cRows.reduce((acc, cm) => {
        acc[cm.post_id] = acc[cm.post_id] || [];
        acc[cm.post_id].push(cm);
        return acc;
      }, {});
    }

    return rows.map(r => ({ ...r, comments: commentsByPost[r.id] || [] }));
  } catch (err) {
    console.error("getPosts error:", err);
    throw err;
  }
}

/**
 * Like post (idempotent)
 */
export async function likePost({ postId, userId }) {
  try {
    await pool.query(
      `INSERT INTO likes (post_id, user_id) VALUES ($1, $2)
       ON CONFLICT (post_id, user_id) DO NOTHING`,
      [postId, userId]
    );

    const { rows } = await pool.query(
      `SELECT COUNT(*)::int as likes FROM likes WHERE post_id = $1`,
      [postId]
    );
    return { likes: rows[0].likes };
  } catch (err) {
    console.error("likePost error:", err);
    throw err;
  }
}

/**
 * Unlike
 */
export async function unlikePost({ postId, userId }) {
  try {
    await pool.query(`DELETE FROM likes WHERE post_id = $1 AND user_id = $2`, [postId, userId]);
    const { rows } = await pool.query(`SELECT COUNT(*)::int as likes FROM likes WHERE post_id = $1`, [postId]);
    return { likes: rows[0].likes };
  } catch (err) {
    console.error("unlikePost error:", err);
    throw err;
  }
}

/**
 * Repost (idempotent)
 */
export async function repostPost({ postId, userId }) {
  try {
    await pool.query(
      `INSERT INTO reposts (post_id, user_id) VALUES ($1, $2)
       ON CONFLICT (post_id, user_id) DO NOTHING`,
      [postId, userId]
    );
    const { rows } = await pool.query(`SELECT COUNT(*)::int as reposts FROM reposts WHERE post_id = $1`, [postId]);
    return { reposts: rows[0].reposts };
  } catch (err) {
    console.error("repostPost error:", err);
    throw err;
  }
}

/**
 * Add comment
 */
export async function addComment({ postId, userId, text }) {
  try {
    const { rows } = await pool.query(
      `INSERT INTO comments (post_id, user_id, text) VALUES ($1, $2, $3) RETURNING *`,
      [postId, userId, text]
    );
    return rows[0];
  } catch (err) {
    console.error("addComment error:", err);
    throw err;
  }
}
