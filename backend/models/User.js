const mongoose = require('mongoose');

// This defines what a "User" looks like in our database
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true, // No two users can have the same username
    trim: true
  },
  password: {
    type: String, // This will be the *hashed* password
    required: true
  }
});

module.exports = mongoose.model('User', UserSchema);