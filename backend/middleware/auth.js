const jwt = require('jsonwebtoken');

// This function will run before our secure API routes
module.exports = function(req, res, next) {
  // Get the token from the request header
  const token = req.header('x-auth-token');

  // Check if there's no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // If there is a token, verify it
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add the user's ID from the token payload to the request object
    // Now our protected routes will know *which* user is making the request
    req.user = decoded.user;
    next(); // Continue to the route
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};