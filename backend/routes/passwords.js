const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth'); // Our custom auth check
const PasswordEntry = require('../models/PasswordEntry');
const { encrypt, decrypt } = require('../utils/cipher'); // Our encrypt/decrypt functions

// --- ROUTE: GET /api/passwords ---
// --- Purpose: Get all passwords for the logged-in user ---
// Note: 'authMiddleware' is run first. If the token is invalid, it will fail.
router.get('/', authMiddleware, async (req, res) => {
  try {
    // req.user.id was added by the authMiddleware
    const entries = await PasswordEntry.find({ user: req.user.id });

    // Decrypt the passwords before sending them to the client
    const decryptedEntries = entries.map(entry => {
      const decryptedPassword = decrypt({
        iv: entry.iv,
        password: entry.password
      });
      
      // Return a new object with the decrypted password
      return {
        _id: entry._id,
        website: entry.website,
        password: decryptedPassword,
        user: entry.user
      };
    });

    res.json(decryptedEntries);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// --- ROUTE: POST /api/passwords ---
// --- Purpose: Add a new password for the logged-in user ---
router.post('/', authMiddleware, async (req, res) => {
  const { website, password } = req.body;

  try {
    // 1. Encrypt the password
    const { iv, password: encryptedPassword } = encrypt(password);

    // 2. Create the new password entry
    const newEntry = new PasswordEntry({
      user: req.user.id,
      website,
      password: encryptedPassword,
      iv: iv
    });

    // 3. Save to database
    const entry = await newEntry.save();
    
    // 4. Decrypt it again just to send it back to the client
    const decryptedPassword = decrypt({ iv: entry.iv, password: entry.password });

    res.json({
        _id: entry._id,
        website: entry.website,
        password: decryptedPassword,
        user: entry.user
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// --- ROUTE: DELETE /api/passwords/:id ---
// --- Purpose: Delete a password ---
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    let entry = await PasswordEntry.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({ msg: 'Password entry not found' });
    }

    // Security check: Make sure the user *owns* this entry
    if (entry.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await PasswordEntry.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Password entry removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// --- ROUTE: PUT /api/passwords/:id ---
// --- Purpose: Update an existing password ---
router.put('/:id', authMiddleware, async (req, res) => {
  const { website, password } = req.body;

  // 1. Check if ID, website, and password are provided
  if (!website || !password) {
    return res.status(400).json({ msg: 'Please provide website and password' });
  }

  try {
    let entry = await PasswordEntry.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({ msg: 'Password entry not found' });
    }

    // 2. Security check: Make sure the user *owns* this entry
    if (entry.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    // 3. Encrypt the new password
    const { iv, password: encryptedPassword } = encrypt(password);

    // 4. Update the fields
    entry.website = website;
    entry.password = encryptedPassword;
    entry.iv = iv;

    // 5. Save the updated entry to the database
    await entry.save();

    // 6. Send back the freshly decrypted entry (for UI update)
    res.json({
      _id: entry._id,
      website: entry.website,
      password: password, // Send the plain-text password back
      user: entry.user
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// (You can also add a PUT route for editing, following the same logic!)

module.exports = router;