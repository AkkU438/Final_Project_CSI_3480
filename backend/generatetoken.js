/**
 * Utility script to generate a JWT token for testing purposes.
 * 
 * WARNING: This file contains hardcoded secrets and should NOT be used in production.
 * This is only for development/testing purposes.
 * 
 * To use this script:
 * 1. Make sure you have a .env file with JWT_SECRET set
 * 2. Update the user ID below to match a real user in your database
 * 3. Run: node generatetoken.js
 * 
 * For production, tokens should only be generated through the /api/auth/login endpoint.
 */

require('dotenv').config();
const jwt = require("jsonwebtoken");

// WARNING: Replace this with a real user ID from your database
const userId = "692dd91cb39f7acf666690a2";

if (!process.env.JWT_SECRET) {
  console.error('ERROR: JWT_SECRET not found in .env file');
  process.exit(1);
}

const token = jwt.sign(
    { user: { id: userId } }, 
    process.env.JWT_SECRET, 
    { expiresIn: "30d" }
);

console.log('Generated token:');
console.log(token);
console.log('\nWARNING: This token should only be used for testing!');