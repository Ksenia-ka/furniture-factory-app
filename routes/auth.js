const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

const SECRET = process.env.JWT_SECRET || 'secret_key_123';

// Demo users
const demoUsers = [
  {
    id: 1,
    email: 'admin@factory.com',
    password_hash: '$2a$10$YourHashedPasswordHere',
    full_name: 'Директор',
    role: 'admin'
  }
];

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    // Demo login
    if (email === 'admin@factory.com' && password === '123456') {
      const user = {
        id: 1,
        email: 'admin@factory.com',
        full_name: 'Директор',
        role: 'admin'
      };

      const token = jwt.sign(user, SECRET, { expiresIn: '7d' });

      return res.json({
        success: true,
        token,
        user
      });
    }

    return res.status(401).json({ message: 'Invalid email or password' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Login error' });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { email, password, full_name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      id: Date.now(),
      email,
      full_name: full_name || 'User',
      role: 'employee'
    };

    const token = jwt.sign(user, SECRET, { expiresIn: '7d' });

    return res.status(201).json({
      success: true,
      token,
      user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Registration error' });
  }
});

router.get('/me', authMiddleware, (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

module.exports = router;
