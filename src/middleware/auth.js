const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { ApiError } = require('../utils/apiError');
const config = require('../config');

exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new ApiError(401, 'Not authorized to access this route');
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, config.jwtSecret);

      // Get user from token
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        throw new ApiError(401, 'User not found');
      }

      next();
    } catch (error) {
      throw new ApiError(401, 'Not authorized to access this route');
    }
  } catch (error) {
    next(error);
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(403, `User role '${req.user.role}' is not authorized to access this route`)
      );
    }
    next();
  };
};
