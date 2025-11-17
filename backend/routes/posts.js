// backend/routes/posts.js
const express = require('express');
const router = express.Router();

// Симуляция БД
let users = [
  { id: 1, username: "pickmekota", avatar: "/avatar.jpg", level: 27 },
  { id: 2, username: "agent2", avatar: "/agent2.jpg", level: 15 }
];

let posts = [
  {
    id: 1,
    user_id: 1,
    content: "Valorant Nocturnum UI redesign in progress 🔥",
    likes: 0,
    reposts: 0,
    comments: [],
    created_at: new Date()
  }
];

// === GET all posts ===
router.get('/', (req, res) => {
  // соединяем данные пользователя с постом
  const enrichedPosts = posts.map(post => ({
    ...post,
    user: users.find(u => u.id === post.user_id)
  }));
  res.json(enrichedPosts);
});

// === CREATE post ===
router.post('/', (req, res) => {
  const { user_id, content } = req.body;
  const newPost = {
    id: posts.length + 1,
    user_id,
    content,
    likes: 0,
    reposts: 0,
    comments: [],
    created_at: new Date()
  };
  posts.unshift(newPost);
  res.json({ ...newPost, user: users.find(u => u.id === user_id) });
});

// === LIKE post ===
router.post('/like/:id', (req, res) => {
  const post = posts.find(p => p.id == req.params.id);
  if (post) {
    post.likes += 1;
    res.json({ ...post, user: users.find(u => u.id === post.user_id) });
  } else {
    res.status(404).json({ error: "Post not found" });
  }
});

// === REPOST post ===
router.post('/repost/:id', (req, res) => {
  const post = posts.find(p => p.id == req.params.id);
  if (post) {
    post.reposts += 1;
    res.json({ ...post, user: users.find(u => u.id === post.user_id) });
  } else {
    res.status(404).json({ error: "Post not found" });
  }
});

// === ADD COMMENT ===
router.post('/comment/:id', (req, res) => {
  const post = posts.find(p => p.id == req.params.id);
  if (post) {
    const { user_id, text } = req.body;
    const comment = {
      id: post.comments.length + 1,
      user_id,
      text,
      created_at: new Date()
    };
    post.comments.push(comment);
    res.json({ ...post, user: users.find(u => u.id === post.user_id) });
  } else {
    res.status(404).json({ error: "Post not found" });
  }
});

module.exports = router;
