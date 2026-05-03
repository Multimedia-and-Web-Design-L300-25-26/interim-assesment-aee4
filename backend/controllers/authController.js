const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

function getCookieOptions() {
  const isProduction = process.env.NODE_ENV === 'production';

  return {
    httpOnly: true,
    maxAge: SEVEN_DAYS_MS,
    sameSite: isProduction ? 'none' : 'lax',
    secure: isProduction,
  };
}

async function register(req, res) {
  try {
    const { name, email, password } = req.body || {};

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: 'Name, email, and password are required.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists.' });
    }

    const user = new User({ name, email, password });
    await user.save();

    return res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    console.error("REGISTER ERROR:", error.message, error.stack);
    return res.status(500).json({ message: 'Server error.', error: error.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: 'JWT_SECRET is not set.' });
    }

    const token = jwt.sign({ _id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.cookie('token', token, getCookieOptions());

    return res.status(200).json({ name: user.name, email: user.email });
  } catch (error) {
    return res.status(500).json({ message: 'Server error.' });
  }
}

function logout(req, res) {
  res.clearCookie('token', getCookieOptions());
  return res.status(200).json({ message: 'Logged out successfully.' });
}

module.exports = { register, login, logout };
