
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const authMiddleware = require('../middleware/auth.middleware');

// Initialize router
const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register new user
 * @access  Public
 */
router.post('/register', async (req, res) => {
  try {
    // Destructure request body
    const { name, email, password } = req.body;

    // Input validation
    if (!name || !email || !password) return res.status(400).json({ success: false, message: 'All fields are required' });
    if (password.length < 6) return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ success: false, message: 'User email already registered' });

    // Create new user
    user = new User({
      name,
      email,
      password
    });

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save user to database
    await user.save();

    // Generate JWT token
    const payload = {
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: process.env.JWT_EXPIRE || '24h' },
      (err, token) => {
        if (err) throw err;
        res.status(201).json({
          success: true,
          message: 'User registered successfully',
          user: {
            id: user._id,
            name: user.name,
            email: user.email
          },
          token
        });
      }
    );
  } catch (error) {
    console.error(error.stack);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and return JWT token
 * @access  Public
 */
router.post('/login', async (req, res) => {
  try {
    // Destructure request body
    const { email, password } = req.body;

    // Validation
    if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password are required' });

    // Find user by email
    let user = await User.findOne({ email });
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    // Generate JWT token
    const payload = {
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: process.env.JWT_EXPIRE || '24h' },
      (err, token) => {
        if (err) throw err;
        res.json({
          success: true,
          user: {
            id: user._id,
            name: user.name,
            email: user.email
          },
          token
        });
      }
    );
  } catch (error) {
    console.error(error.stack);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @route   GET /api/auth/verify
 * @desc    Verify JWT token validity
 * @access  Private (requires auth middleware)
 */
router.get('/verify', authMiddleware, async (req, res) => {
  try {
    // Access to user data is already verified by the authMiddleware
    // User object is available as req.user
    return res.json({
      success: true,
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
      }
    });
  } catch (error) {
    console.error(error.stack);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
