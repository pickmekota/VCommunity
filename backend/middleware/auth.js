const jwt = require('jsonwebtoken');
module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token' });
  const token = authHeader.split(' ')[1];
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    req.user = data; // { id }
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
