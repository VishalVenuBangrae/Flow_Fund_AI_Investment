const jwt = require('jsonwebtoken');
const pool = require('../config/db');

module.exports = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    // Check if session exists (not logged out)
    const [sessions] = await pool.query(
      'SELECT * FROM user_sessions WHERE jwt_token = ? AND expires_at > NOW()',
      [token]
    );
    if (sessions.length === 0) return res.status(401).json({ error: 'Session expired or invalid' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
