// backend/routes/posts.js
import express from "express";
import auth from "../middleware/auth.js";
import { deletePost, restorePost } from "../models/postModel.js";
import requireRole from "../middleware/role.js";


import {
  createPost,
  getPosts,
  likePost,
  unlikePost,
  repostPost,
  addComment
} from "../models/postModel.js";

const router = express.Router();

// GET /api/posts — получить ленту
router.get("/", async (req, res) => {
  try {
    const posts = await getPosts({ limit: 50, offset: 0 });
    res.json(posts);
  } catch (err) {
    console.error("Get posts error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/posts — создать пост
router.post("/", auth, async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: "Content cannot be empty" });
    }

    const post = await createPost({
      user_id: req.user.id,
      content
    });

    res.json(post);
  } catch (err) {
    console.error("Create post error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/posts/like/:id — лайк
router.post("/like/:id", auth, async (req, res) => {
  try {
    const postId = Number(req.params.id);

    if (isNaN(postId)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    const result = await likePost({
      postId,
      userId: req.user.id
    });

    res.json(result);
  } catch (err) {
    console.error("Like post error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/posts/unlike/:id — убрать лайк
router.post("/unlike/:id", auth, async (req, res) => {
  try {
    const postId = Number(req.params.id);

    if (isNaN(postId)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    const result = await unlikePost({
      postId,
      userId: req.user.id
    });

    res.json(result);
  } catch (err) {
    console.error("Unlike post error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/posts/repost/:id — репост
router.post("/repost/:id", auth, async (req, res) => {
  try {
    const postId = Number(req.params.id);

    if (isNaN(postId)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    const result = await repostPost({
      postId,
      userId: req.user.id
    });

    res.json(result);
  } catch (err) {
    console.error("Repost error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/posts/comment/:id — коммент
router.post("/comment/:id", auth, async (req, res) => {
  try {
    const postId = Number(req.params.id);
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Empty comment" });
    }

    if (isNaN(postId)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    const comment = await addComment({
      postId,
      userId: req.user.id,
      text
    });

    res.json(comment);
  } catch (err) {
    console.error("Comment error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
// Soft delete поста (только владелец)
router.delete("/:id", auth, async (req, res) => {
  const postId = parseInt(req.params.id, 10);
  const post = await deletePost(postId, req.user.id);
  if (!post) return res.status(404).json({ message: "Post not found or not yours" });
  res.json({ message: "Deleted", post });
});

// Restore post (только admin)
router.post("/restore/:id", auth, requireRole("admin"), async (req, res) => {
  const postId = parseInt(req.params.id, 10);
  const post = await restorePost(postId);
  if (!post) return res.status(404).json({ message: "Post not found" });
  res.json({ message: "Restored", post });
});

export default router;

