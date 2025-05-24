// authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/connection');

const SECRET = 'your_jwt_secret';

exports.signup = async (req, res) => {
  const { name, email, password, address, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query(
      'INSERT INTO users (name, email, password, address, role) VALUES ($1, $2, $3, $4, $5)',
      [name, email, hashedPassword, address, role || 'user']
    );
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Signup failed' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, role: user.role }, SECRET, { expiresIn: '1d' });
    res.json({ token, role: user.role });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
};

