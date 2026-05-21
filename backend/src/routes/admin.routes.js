const express = require('express');
const prisma = require('../lib/prisma');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// All admin routes require ADMIN role
router.use(authenticate, authorize('ADMIN'));

// -------- GET /api/admin/stats --------
// Platform overview
router.get('/stats', async (req, res, next) => {
  try {
    const [users, sellers, products, orders, revenue] = await Promise.all([
      prisma.user.count(),
      prisma.seller.count(),
      prisma.product.count({ where: { status: 'ACTIVE' } }),
      prisma.order.count(),
      prisma.order.aggregate({ _sum: { total: true } }),
    ]);

    const pendingSellers = await prisma.seller.count({ where: { status: 'PENDING' } });
    const pendingProducts = await prisma.product.count({ where: { status: 'PENDING' } });

    res.json({
      stats: {
        totalUsers: users,
        totalSellers: sellers,
        activeProducts: products,
        totalOrders: orders,
        totalRevenue: revenue._sum.total || 0,
        pendingSellers,
        pendingProducts,
      },
    });
  } catch (err) {
    next(err);
  }
});

// -------- GET /api/admin/sellers --------
// List all sellers with filters
router.get('/sellers', async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const where = {};
    if (status) where.status = status;

    const [sellers, total] = await Promise.all([
      prisma.seller.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
        include: {
          user: { select: { name: true, email: true, phone: true } },
          _count: { select: { products: true, orderItems: true } },
        },
      }),
      prisma.seller.count({ where }),
    ]);

    res.json({ sellers, pagination: { page: parseInt(page), total, totalPages: Math.ceil(total / parseInt(limit)) } });
  } catch (err) {
    next(err);
  }
});

// -------- PUT /api/admin/sellers/:id/verify --------
// Approve or reject seller
router.put('/sellers/:id/verify', async (req, res, next) => {
  try {
    const { action } = req.body; // 'approve' | 'reject' | 'suspend'

    let status;
    switch (action) {
      case 'approve': status = 'VERIFIED'; break;
      case 'reject': status = 'SUSPENDED'; break;
      case 'suspend': status = 'SUSPENDED'; break;
      default:
        return res.status(400).json({ error: true, message: 'Invalid action. Use: approve, reject, or suspend' });
    }

    const seller = await prisma.seller.update({
      where: { id: req.params.id },
      data: { status },
      include: { user: { select: { name: true, email: true } } },
    });

    res.json({ message: `Seller ${action}d successfully`, seller });
  } catch (err) {
    next(err);
  }
});

// -------- GET /api/admin/products/pending --------
// Products awaiting moderation
router.get('/products/pending', async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: { status: 'PENDING' },
        orderBy: { createdAt: 'asc' }, // FIFO
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
        include: {
          seller: {
            select: { shopName: true, rating: true, status: true },
          },
        },
      }),
      prisma.product.count({ where: { status: 'PENDING' } }),
    ]);

    res.json({ products, pagination: { page: parseInt(page), total, totalPages: Math.ceil(total / parseInt(limit)) } });
  } catch (err) {
    next(err);
  }
});

// -------- PUT /api/admin/products/:id/approve --------
// Approve or reject product
router.put('/products/:id/approve', async (req, res, next) => {
  try {
    const { action, reason } = req.body; // 'approve' | 'reject'

    let status;
    if (action === 'approve') status = 'ACTIVE';
    else if (action === 'reject') status = 'REJECTED';
    else return res.status(400).json({ error: true, message: 'Invalid action' });

    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: { status },
    });

    res.json({ message: `Product ${action}d`, product });
  } catch (err) {
    next(err);
  }
});

// -------- GET /api/admin/orders --------
// All orders with filters
router.get('/orders', async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const where = {};
    if (status) where.status = status;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
        include: {
          user: { select: { name: true, email: true } },
          items: { include: { seller: { select: { shopName: true } } } },
          address: { select: { city: true, state: true } },
        },
      }),
      prisma.order.count({ where }),
    ]);

    res.json({ orders, pagination: { page: parseInt(page), total, totalPages: Math.ceil(total / parseInt(limit)) } });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
