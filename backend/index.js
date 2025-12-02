// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
// Configure CORS based on environment variable
const corsOptions = {
  origin: process.env.CORS_ORIGIN_WHITELIST 
    ? process.env.CORS_ORIGIN_WHITELIST.split(',').map(origin => origin.trim())
    : true, // Allow all origins if not specified
  credentials: true
};
app.use(cors(corsOptions)); 
// Allow the server to understand JSON data from requests
app.use(express.json()); 

// --- Database Connection ---
// We'll get this string from MongoDB Atlas
if (!process.env.MONGO_URI) {
  console.error('ERROR: MONGO_URI is not set in environment variables');
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected Successfully!');
    console.log(`📊 Database: ${mongoose.connection.name}`);
  })
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  });

// Handle connection events
mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB error:', err);
});

// --- API Routes ---
// Any request to /api/auth will be handled by the auth.js file
app.use('/api/auth', require('./routes/auth')); 
// Any request to /api/passwords will be handled by the passwords.js file
app.use('/api/passwords', require('./routes/passwords'));

// --- Start the Server ---
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});