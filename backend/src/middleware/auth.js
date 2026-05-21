const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');

/**
 * Authentication middleware — verifies JWT token
 * Attaches user to req.user
 */
const authenticate = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ error: true, message: 'No token provided' });
    }

    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, name: true, email: true, phone: true, role: true },
    });

    if (!user) {
      return res.status(401).json({ error: true, message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: true, message: 'Token expired' });
    }
    return res.status(401).json({ error: true, message: 'Invalid token' });
  }
};

/**
 * Optional auth — doesn't fail if no token, but attaches user if valid
 */
const optionalAuth = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (header && header.startsWith('Bearer ')) {
      const token = header.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, name: true, email: true, role: true },
      });
      if (user) req.user = user;
    }
  } catch (err) {
    // Silently continue without user
  }
  next();
};

/**
 * Role-based authorization middleware
 * Usage: authorize('SELLER', 'ADMIN')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: true, message: 'Authentication required' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: true, message: 'Insufficient permissions' });
    }
    next();
  };
};

module.exports = { authenticate, optionalAuth, authorize };
