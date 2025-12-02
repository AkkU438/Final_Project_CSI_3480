const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// --- ROUTE: POST /api/auth/register ---
// --- Purpose: Create a new user ---
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res.status(400).json({ msg: 'Please provide both username and password' });
  }

  if (username.length < 3) {
    return res.status(400).json({ msg: 'Username must be at least 3 characters' });
  }

  if (password.length < 6) {
    return res.status(400).json({ msg: 'Password must be at least 6 characters' });
  }

  try {
    // 1. Check if user already exists
    let user = await User.findOne({ username: username.trim() });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // 2. Create new user instance
    user = new User({
      username: username.trim(),
      password // Will be hashed before saving
    });

    // 3. Hash the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // 4. Save user to database
    await user.save();
    console.log(`✅ New user registered: ${user.username} (ID: ${user._id})`);

    // 5. Create and return a JSON Web Token (JWT)
    const payload = {
      user: {
        id: user.id // The user's unique ID from the database
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '365d' }, // Token lasts for 1 year
      (err, token) => {
        if (err) {
          console.error('JWT signing error:', err);
          return res.status(500).json({ msg: 'Error generating token' });
        }
        res.json({ token }); // Send the token back to the client
      }
    );
  } catch (err) {
    console.error('Registration error:', err.message);
    
    // Handle duplicate key error (MongoDB unique constraint)
    if (err.code === 11000) {
      return res.status(400).json({ msg: 'User already exists' });
    }
    
    // Handle validation errors
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ msg: messages.join(', ') });
    }
    
    res.status(500).json({ msg: 'Server error during registration' });
  }
});

// --- ROUTE: POST /api/auth/login ---
// --- Purpose: Log in a user ---
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res.status(400).json({ msg: 'Please provide both username and password' });
  }

  try {
    // 1. Check if user exists in database
    const user = await User.findOne({ username: username.trim() });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // 2. Compare the provided password with the stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    console.log(`✅ User logged in: ${user.username} (ID: ${user._id})`);

    // 3. If they match, create and return a JWT
    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '365d' },
      (err, token) => {
        if (err) {
          console.error('JWT signing error:', err);
          return res.status(500).json({ msg: 'Error generating token' });
        }
        res.json({ token }); // Send the token back to the client
      }
    );
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ msg: 'Server error during login' });
  }
});

module.exports = router;