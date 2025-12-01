const mongoose = require('mongoose');

// This defines what a "Password Entry" looks like
const PasswordEntrySchema = new mongoose.Schema({
  // This links the entry to a specific user
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Connects to the 'User' model
    required: true
  },
  website: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String, // This will be the *encrypted* password
    required: true
  },
  // We need to store the "Initialization Vector" (iv) to decrypt the password
  iv: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('PasswordEntry', PasswordEntrySchema);