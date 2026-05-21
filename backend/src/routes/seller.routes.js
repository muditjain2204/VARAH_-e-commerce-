const express = require('express');
const { z } = require('zod');
const slugify = require('slugify');
const prisma = require('../lib/prisma');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// -------- POST /api/seller/register --------
// Apply to become a seller
router.post('/register', authenticate, async (req, res, next) => {
  try {
    const schema = z.object({
      shopName: z.string().min(2),
      description: z.string().optional(),
      gstin: z.string().optional(),
      pan: z.string().min(10).max(10),
      shopAddress: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      pincode: z.string().optional(),
      category: z.string().optional(),
      bankAccountName: z.string().optional(),
      bankAccount: z.string().optional(),
      ifsc: z.string().optional(),
      enrolmentId: z.string().optional(),
      panImage: z.string().optional(),
      gstinImage: z.string().optional(),
      cancelledCheque: z.string().optional(),
    });

    const data = schema.parse(req.body);

    // Check if already a seller
    const existing = await prisma.seller.findUnique({ where: { userId: req.user.id } });
    if (existing) {
      return res.status(409).json({ error: true, message: 'You already have a seller account', seller: existing });
    }

    const seller = await prisma.seller.create({
      data: {
        userId: req.user.id,
        status: 'PENDING',
        ...data,
      },
    });

    // Update user role to SELLER so they can access the dashboard (which will show pending state)
    await prisma.user.update({
      where: { id: req.user.id },
      data: { role: 'SELLER' },
    });

    res.status(201).json({
      message: 'Seller application submitted! Our team will review it within 24-48 hours.',
      seller,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: true, message: err.errors[0].message });
    }
    next(err);
  }
});

// -------- GET /api/seller/dashboard --------
// Seller dashboard stats
router.get('/dashboard', authenticate, authorize('SELLER', 'ADMIN'), async (req, res, next) => {
  try {
    const seller = await prisma.seller.findUnique({
      where: { userId: req.user.id },
    });
    if (!seller) return res.status(404).json({ error: true, message: 'Seller profile not found' });

    // Get stats
    const [productCount, pendingOrders, totalOrders, recentOrders] = await Promise.all([
      prisma.product.count({ where: { sellerId: seller.id } }),
      prisma.orderItem.count({ where: { sellerId: seller.id, fulfillmentStatus: 'PENDING' } }),
      prisma.orderItem.count({ where: { sellerId: seller.id } }),
      prisma.orderItem.findMany({
        where: { sellerId: seller.id },
        orderBy: { order: { createdAt: 'desc' } },
        take: 5,
        include: {
          product: { select: { name: true, images: true } },
          order: { select: { id: true, createdAt: true, status: true } },
        },
      }),
    ]);

    res.json({
      seller: {
        id: seller.id,
        shopName: seller.shopName,
        status: seller.status,
        commissionRate: seller.commissionRate,
        rating: seller.rating,
        totalRevenue: seller.totalRevenue,
        totalSales: seller.totalSales,
      },
      stats: {
        totalProducts: productCount,
        pendingOrders,
        totalOrders,
      },
      recentOrders,
    });
  } catch (err) {
    next(err);
  }
});

// -------- GET /api/seller/products --------
// List seller's own products
router.get('/products', authenticate, authorize('SELLER', 'ADMIN'), async (req, res, next) => {
  try {
    const seller = await prisma.seller.findUnique({ where: { userId: req.user.id } });
    if (!seller) return res.status(404).json({ error: true, message: 'Seller profile not found' });

    const { status, page = 1, limit = 20 } = req.query;
    const where = { sellerId: seller.id };
    if (status) where.status = status;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
      }),
      prisma.product.count({ where }),
    ]);

    res.json({ products, pagination: { page: parseInt(page), total, totalPages: Math.ceil(total / parseInt(limit)) } });
  } catch (err) {
    next(err);
  }
});

// -------- POST /api/seller/products --------
// Create a new product listing
router.post('/products', authenticate, authorize('SELLER', 'ADMIN'), async (req, res, next) => {
  try {
    const productSchema = z.object({
      name: z.string().min(3),
      description: z.string().min(10),
      price: z.number().positive(),
      originalPrice: z.number().positive().optional(),
      discount: z.number().int().min(0).max(99).optional(),
      stockCount: z.number().int().min(0).default(0),
      category: z.string(),
      subcategory: z.string().optional(),
      fabric: z.string().optional(),
      work: z.string().optional(),
      occasion: z.string().optional(),
      color: z.string().optional(),
      weight: z.string().optional(),
      length: z.string().optional(),
      blousePiece: z.string().optional(),
      components: z.string().optional(),
      size: z.string().optional(),
      washCare: z.string().optional(),
      images: z.array(z.string()).default([]),
      tags: z.array(z.string()).default([]),
    });

    const data = productSchema.parse(req.body);

    const seller = await prisma.seller.findUnique({ where: { userId: req.user.id } });
    if (!seller) return res.status(404).json({ error: true, message: 'Seller profile not found' });

    if (seller.status !== 'VERIFIED') {
      return res.status(403).json({ error: true, message: 'Your seller account must be verified before listing products' });
    }

    // Generate unique slug
    let slug = slugify(data.name, { lower: true, strict: true });
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now()}`;

    const product = await prisma.product.create({
      data: {
        sellerId: seller.id,
        slug,
        status: 'ACTIVE', // Automatically approve for MVP demonstration
        ...data,
      },
    });

    res.status(201).json({
      message: 'Product submitted for review. It will be visible once approved by our team.',
      product,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: true, message: err.errors[0].message });
    }
    next(err);
  }
});

// -------- PUT /api/seller/products/:id --------
// Update own product
router.put('/products/:id', authenticate, authorize('SELLER', 'ADMIN'), async (req, res, next) => {
  try {
    const seller = await prisma.seller.findUnique({ where: { userId: req.user.id } });
    if (!seller) return res.status(404).json({ error: true, message: 'Seller not found' });

    const product = await prisma.product.findFirst({
      where: { id: req.params.id, sellerId: seller.id },
    });
    if (!product) return res.status(404).json({ error: true, message: 'Product not found' });

    const { name, description, price, originalPrice, discount, stockCount,
      fabric, work, occasion, color, images, tags } = req.body;

    const updated = await prisma.product.update({
      where: { id: product.id },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(price !== undefined && { price }),
        ...(originalPrice !== undefined && { originalPrice }),
        ...(discount !== undefined && { discount }),
        ...(stockCount !== undefined && { stockCount }),
        ...(fabric && { fabric }),
        ...(work && { work }),
        ...(occasion && { occasion }),
        ...(color && { color }),
        ...(images && { images }),
        ...(tags && { tags }),
      },
    });

    res.json({ message: 'Product updated', product: updated });
  } catch (err) {
    next(err);
  }
});

// -------- GET /api/seller/orders --------
// Orders containing this seller's products
router.get('/orders', authenticate, authorize('SELLER', 'ADMIN'), async (req, res, next) => {
  try {
    const seller = await prisma.seller.findUnique({ where: { userId: req.user.id } });
    if (!seller) return res.status(404).json({ error: true, message: 'Seller not found' });

    const { status, page = 1, limit = 20 } = req.query;
    const where = { sellerId: seller.id };
    if (status) where.fulfillmentStatus = status;

    const [items, total] = await Promise.all([
      prisma.orderItem.findMany({
        where,
        orderBy: { order: { createdAt: 'desc' } },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
        include: {
          product: { select: { name: true, images: true, slug: true } },
          order: {
            select: {
              id: true, status: true, paymentMethod: true, createdAt: true,
              address: { select: { city: true, state: true, pincode: true } },
              user: { select: { name: true } },
            },
          },
        },
      }),
      prisma.orderItem.count({ where }),
    ]);

    res.json({ orders: items, pagination: { page: parseInt(page), total, totalPages: Math.ceil(total / parseInt(limit)) } });
  } catch (err) {
    next(err);
  }
});

// -------- PUT /api/seller/orders/:id/ship --------
// Mark order item as shipped
router.put('/orders/:id/ship', authenticate, authorize('SELLER', 'ADMIN'), async (req, res, next) => {
  try {
    const { trackingId, trackingUrl } = req.body;
    const seller = await prisma.seller.findUnique({ where: { userId: req.user.id } });

    const item = await prisma.orderItem.findFirst({
      where: { id: req.params.id, sellerId: seller.id },
    });
    if (!item) return res.status(404).json({ error: true, message: 'Order item not found' });

    const updated = await prisma.orderItem.update({
      where: { id: item.id },
      data: {
        fulfillmentStatus: 'SHIPPED',
        trackingId: trackingId || null,
        trackingUrl: trackingUrl || null,
        shippedAt: new Date(),
      },
    });

    res.json({ message: 'Marked as shipped', item: updated });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
