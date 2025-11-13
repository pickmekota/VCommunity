const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

let users = [{ id: 1, name: 'Viktoria', email: 'viktoria@example.com' }];

router.get('/:id', (req, res) => {
  const user = users.find(u => u.id == req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});

router.put('/:id', auth, (req, res) => {
  const user = users.find(u => u.id == req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const { name, email } = req.body;
  if (name) user.name = name;
  if (email) user.email = email;

  res.json({ message: 'Profile updated', user });
});

module.exports = router;
