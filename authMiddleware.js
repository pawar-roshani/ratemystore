// authMiddleware.js
const jwt = require('jsonwebtoken');
const SECRET = 'your_jwt_secret';

exports.verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ error: 'No token provided' });
  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

exports.restrictTo = (role) => (req, res, next) => {
  if (req.user.role !== role) return res.status(403).json({ error: 'Access denied' });
  next();
};
