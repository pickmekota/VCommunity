const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

let posts = [];
let postId = 1;

router.get('/', (req, res) => res.json(posts));

router.post('/', auth, (req, res) => {
  const { content } = req.body;
  const post = { id: postId++, content, likes: 0 };
  posts.push(post);
  res.status(201).json(post);
});

router.post('/:id/like', auth, (req, res) => {
  const post = posts.find(p => p.id == req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found' });

  post.likes++;
  res.json({ message: 'Liked', post });
});

module.exports = router;
