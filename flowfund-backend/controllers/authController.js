const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// REGISTER
exports.register = async (req, res) => {
  const { email, password, first_name, last_name } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  try {
    const [existing] = await pool.query('SELECT user_id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) return res.status(409).json({ error: 'Email already registered' });

    const password_hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (email, password_hash, role_id) VALUES (?, ?, 2)',
      [email, password_hash]
    );
    const userId = result.insertId;

    await pool.query(
      'INSERT INTO user_profiles (user_id, first_name, last_name) VALUES (?, ?, ?)',
      [userId, first_name || '', last_name || '']
    );

    res.status(201).json({ message: 'User registered successfully', user_id: userId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  try {
    const [users] = await pool.query(
      'SELECT u.*, r.role_name FROM users u JOIN roles r ON u.role_id = r.role_id WHERE u.email = ?',
      [email]
    );
    if (users.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

    const user = users[0];
    if (!user.is_active) return res.status(403).json({ error: 'Account is inactive' });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { user_id: user.user_id, email: user.email, role: user.role_name },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000);
    await pool.query(
      'INSERT INTO user_sessions (user_id, jwt_token, ip_address, expires_at) VALUES (?, ?, ?, ?)',
      [user.user_id, token, req.ip, expiresAt]
    );

    res.json({ message: 'Login successful', token, role: user.role_name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// LOGOUT
exports.logout = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(400).json({ error: 'No token provided' });

  try {
    await pool.query('DELETE FROM user_sessions WHERE jwt_token = ?', [token]);
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET PROFILE (protected)
exports.getProfile = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT u.user_id, u.email, r.role_name, p.first_name, p.last_name, u.created_at
       FROM users u
       JOIN roles r ON u.role_id = r.role_id
       LEFT JOIN user_profiles p ON u.user_id = p.user_id
       WHERE u.user_id = ?`,
      [req.user.user_id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
