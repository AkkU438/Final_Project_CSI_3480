const mongoose = require('mongoose');

// This defines what a "User" looks like in our database
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true, // No two users can have the same username
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters']
  },
  password: {
    type: String, // This will be the *hashed* password
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Ensure the username index exists for faster lookups
UserSchema.index({ username: 1 });

module.exports = mongoose.model('User', UserSchema);