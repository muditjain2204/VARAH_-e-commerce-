const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const prisma = require('../lib/prisma');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Validation schemas
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(10).max(15).optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// -------- POST /api/auth/register --------
router.post('/register', async (req, res, next) => {
  try {
    const data = registerSchema.parse(req.body);

    // Check if email already exists
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      return res.status(409).json({ error: true, message: 'Email already registered' });
    }

    // Check phone uniqueness if provided
    if (data.phone) {
      const phoneExists = await prisma.user.findUnique({ where: { phone: data.phone } });
      if (phoneExists) {
        return res.status(409).json({ error: true, message: 'Phone number already registered' });
      }
    }

    // Hash password
    const passwordHash = await bcrypt.hash(data.password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        passwordHash,
        role: 'CUSTOMER',
      },
      select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true },
    });

    const token = generateToken(user.id);

    res.status(201).json({
      message: 'Registration successful',
      user,
      token,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: true, message: err.errors[0].message, errors: err.errors });
    }
    next(err);
  }
});

// -------- POST /api/auth/login --------
router.post('/login', async (req, res, next) => {
  try {
    const data = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) {
      return res.status(401).json({ error: true, message: 'Invalid email or password' });
    }

    const passwordValid = await bcrypt.compare(data.password, user.passwordHash);
    if (!passwordValid) {
      return res.status(401).json({ error: true, message: 'Invalid email or password' });
    }

    const token = generateToken(user.id);

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: true, message: err.errors[0].message });
    }
    next(err);
  }
});

// -------- GET /api/auth/me --------
router.get('/me', authenticate, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true, name: true, email: true, phone: true, role: true, avatar: true, createdAt: true,
        seller: { select: { id: true, shopName: true, status: true } },
        _count: { select: { orders: true, wishlist: true } },
      },
    });

    res.json({ user });
  } catch (err) {
    next(err);
  }
});

// -------- PUT /api/auth/profile --------
router.put('/profile', authenticate, async (req, res, next) => {
  try {
    const { name, phone, avatar } = req.body;

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(name && { name }),
        ...(phone && { phone }),
        ...(avatar && { avatar }),
      },
      select: { id: true, name: true, email: true, phone: true, role: true, avatar: true },
    });

    res.json({ message: 'Profile updated', user });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
