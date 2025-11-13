const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

let trainingResults = [];

router.post('/', auth, (req, res) => {
  const { userId, score, date } = req.body;
  const result = { id: trainingResults.length + 1, userId, score, date: date || new Date() };
  trainingResults.push(result);
  res.status(201).json(result);
});

router.get('/:userId', auth, (req, res) => {
  const userHistory = trainingResults.filter(r => r.userId == req.params.userId);
  res.json(userHistory);
});

module.exports = router;
