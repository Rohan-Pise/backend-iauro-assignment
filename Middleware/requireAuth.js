const jwt = require('jsonwebtoken');
const User = require('../models/users'); 

const requireAuth = async (req, res, next) => {
  try {
    // Get token from cookies
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: No token provided.' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request
    req.user = await User.findById(decoded.id).select('-password'); // Exclude password

    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized: User not found.' });
    }

    next();
  } catch (error) {
    console.error('Authentication Error:', error);
    res.status(401).json({ message: 'Unauthorized: Invalid token.' });
  }
};

module.exports = requireAuth;
