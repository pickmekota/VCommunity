const express = require('express');
const router = express.Router();

let lfgProfiles = [];

router.get('/', (req, res) => {
  const { role, rank } = req.query;
  let results = lfgProfiles;

  if (role) results = results.filter(p => p.role === role);
  if (rank) results = results.filter(p => p.rank === rank);

  res.json(results);
});

router.post('/', (req, res) => {
  const { username, role, rank } = req.body;
  const profile = { id: lfgProfiles.length + 1, username, role, rank };
  lfgProfiles.push(profile);
  res.status(201).json(profile);
});

module.exports = router;
