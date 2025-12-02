const crypto = require('crypto');

// The algorithm we'll use
const ALGORITHM = 'aes-256-cbc';

// This is the line that reads your key from the .env file
// It expects the key to be a 64-CHARACTER HEX STRING.
if (!process.env.ENCRYPTION_KEY) {
  throw new Error('ENCRYPTION_KEY is not set in environment variables');
}

if (process.env.ENCRYPTION_KEY.length !== 64) {
  throw new Error('ENCRYPTION_KEY must be exactly 64 characters (32 bytes in hex)');
}

const KEY = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');

/**
 * Encrypts plain text into a hash object { iv, password }
 * @param {string} text - The plain text to encrypt
 * @returns {{iv: string, password: string}}
 */
function encrypt(text) {
  // 1. Generate a new, random 16-byte Initialization Vector (IV)
  // This IV is crucial for security and must be unique for each encryption
  const iv = crypto.randomBytes(16);
  
  // 2. Create the cipher instance
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
  
  // 3. Encrypt the text
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  // 4. Return both the IV and the encrypted password
  // We need to save the IV so we can decrypt it later
  return {
    iv: iv.toString('hex'),
    password: encrypted
  };
}

/**
 * Decrypts a hash object { iv, password } into plain text
 * @param {{iv: string, password: string}} hash - The hash object from the database
 * @returns {string} - The decrypted plain text
 */
function decrypt(hash) {
  // 1. Re-create the cipher using the *stored* IV
  const iv = Buffer.from(hash.iv, 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
  
  // 2. Decrypt the text
  let decrypted = decipher.update(hash.password, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

module.exports = { encrypt, decrypt };