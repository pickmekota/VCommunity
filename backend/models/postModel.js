// backend/models/postModel.js
import { pool } from "../db.js";

/**
 * Create a post
 */
export async function createPost({ user_id, content }) {
  const { rows } = await pool.query(
    `INSERT INTO posts (user_id, content) VALUES ($1, $2) RETURNING *`,
    [user_id, content]
  );
  return rows[0];
}

/**
 * Get posts with user info, counts and a few comments (latest 5)
 */
export async function getPosts({ limit = 20, offset = 0 } = {}) {
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

  // load top 5 comments for each post (optional)
  const postIds = rows.map(r => r.id);
  let commentsByPost = {};
  if (postIds.length) {
    const { rows: cRows } = await pool.query(
      `SELECT cm.*, u.username, u.avatar_url
       FROM comments cm
       JOIN users u ON u.id = cm.user_id
       WHERE cm.post_id = ANY($1)
       ORDER BY cm.created_at ASC
       LIMIT 200`,
      [postIds]
    );
    commentsByPost = cRows.reduce((acc, cm) => {
      acc[cm.post_id] = acc[cm.post_id] || [];
      acc[cm.post_id].push(cm);
      return acc;
    }, {});
  }

  return rows.map(r => ({ ...r, comments: commentsByPost[r.id] || [] }));
}

/**
 * Like post (idempotent) — returns updated counts and whether this user now likes
 */
export async function likePost({ postId, userId }) {
  // insert if not exists
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
}

/**
 * Unlike (optional)
 */
export async function unlikePost({ postId, userId }) {
  await pool.query(`DELETE FROM likes WHERE post_id = $1 AND user_id = $2`, [postId, userId]);
  const { rows } = await pool.query(`SELECT COUNT(*)::int as likes FROM likes WHERE post_id = $1`, [postId]);
  return { likes: rows[0].likes };
}

/**
 * Repost (idempotent)
 */
export async function repostPost({ postId, userId }) {
  await pool.query(
    `INSERT INTO reposts (post_id, user_id) VALUES ($1, $2)
     ON CONFLICT (post_id, user_id) DO NOTHING`,
    [postId, userId]
  );
  const { rows } = await pool.query(`SELECT COUNT(*)::int as reposts FROM reposts WHERE post_id = $1`, [postId]);
  return { reposts: rows[0].reposts };
}

/**
 * Add comment
 */
export async function addComment({ postId, userId, text }) {
  const { rows } = await pool.query(
    `INSERT INTO comments (post_id, user_id, text) VALUES ($1, $2, $3) RETURNING *`,
    [postId, userId, text]
  );
  return rows[0];
}

// Soft delete post
export async function deletePost(postId, userId) {
  const { rows } = await pool.query(
    `UPDATE posts
     SET is_deleted = TRUE
     WHERE id = $1 AND user_id = $2
     RETURNING *`,
    [postId, userId]
  );
  return rows[0] || null;
}

// Restore post (admin only)
export async function restorePost(postId) {
  const { rows } = await pool.query(
    `UPDATE posts
     SET is_deleted = FALSE
     WHERE id = $1
     RETURNING *`,
    [postId]
  );
  return rows[0] || null;
}

// Soft delete comment
export async function deleteComment(commentId, userId) {
  const { rows } = await pool.query(
    `UPDATE comments
     SET is_deleted = TRUE
     WHERE id = $1 AND user_id = $2
     RETURNING *`,
    [commentId, userId]
  );
  return rows[0] || null;
}

// Restore comment (admin only)
export async function restoreComment(commentId) {
  const { rows } = await pool.query(
    `UPDATE comments
     SET is_deleted = FALSE
     WHERE id = $1
     RETURNING *`,
    [commentId]
  );
  return rows[0] || null;
}
