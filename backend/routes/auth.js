const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// --- ROUTE: POST /api/auth/register ---
// --- Purpose: Create a new user ---
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    // 1. Check if user already exists
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // 2. Create new user instance
    user = new User({
      username,
      password 
    });

    // 3. Hash the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // 4. Save user to database
    await user.save();

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
        if (err) throw err;
        res.json({ token }); // Send the token back to the client
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// --- ROUTE: POST /api/auth/login ---
// --- Purpose: Log in a user ---
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // 1. Check if user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // 2. Compare the provided password with the stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

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
        if (err) throw err;
        res.json({ token }); // Send the token back to the client
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;