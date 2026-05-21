const express = require('express');
const { z } = require('zod');
const prisma = require('../lib/prisma');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// -------- POST /api/orders --------
// Place a new order — handles multi-vendor commission split
router.post('/', authenticate, async (req, res, next) => {
  try {
    const orderSchema = z.object({
      addressId: z.string(),
      paymentMethod: z.enum(['UPI', 'CARD', 'COD', 'NETBANKING', 'WALLET']),
      items: z.array(z.object({
        productId: z.string(),
        quantity: z.number().int().min(1),
      })).min(1),
      notes: z.string().optional(),
    });

    const data = orderSchema.parse(req.body);

    // Verify address belongs to user
    const address = await prisma.address.findFirst({
      where: { id: data.addressId, userId: req.user.id },
    });
    if (!address) {
      return res.status(400).json({ error: true, message: 'Invalid delivery address' });
    }

    // Fetch product details and validate stock
    const productIds = data.items.map(i => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, status: 'ACTIVE' },
      include: { seller: { select: { id: true, commissionRate: true } } },
    });

    if (products.length !== productIds.length) {
      return res.status(400).json({ error: true, message: 'One or more products are unavailable' });
    }

    // Validate stock and calculate pricing
    const orderItems = [];
    let subtotal = 0;

    for (const item of data.items) {
      const product = products.find(p => p.id === item.productId);
      if (product.stockCount < item.quantity) {
        return res.status(400).json({
          error: true,
          message: `Insufficient stock for "${product.name}". Available: ${product.stockCount}`,
        });
      }

      const lineTotal = product.price * item.quantity;
      const commissionRate = product.seller.commissionRate / 100;
      const platformCommission = lineTotal * commissionRate;
      const sellerPayout = lineTotal - platformCommission;

      orderItems.push({
        productId: product.id,
        sellerId: product.seller.id,
        quantity: item.quantity,
        priceAtPurchase: product.price,
        platformCommission,
        sellerPayout,
      });

      subtotal += lineTotal;
    }

    // Calculate shipping & COD charges
    const shipping = subtotal >= 2999 ? 0 : 99;
    const codCharge = data.paymentMethod === 'COD' ? 50 : 0;
    const total = subtotal + shipping + codCharge;

    // Create order in a transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          userId: req.user.id,
          addressId: data.addressId,
          subtotal,
          shipping,
          codCharge,
          total,
          paymentMethod: data.paymentMethod,
          paymentStatus: data.paymentMethod === 'COD' ? 'PENDING' : 'PENDING',
          notes: data.notes,
          items: {
            create: orderItems,
          },
        },
        include: {
          items: {
            include: { product: { select: { name: true, images: true } } },
          },
        },
      });

      // Deduct stock for each product
      for (const item of data.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stockCount: { decrement: item.quantity } },
        });
      }

      // Update seller stats
      const sellerGroups = {};
      for (const item of orderItems) {
        if (!sellerGroups[item.sellerId]) sellerGroups[item.sellerId] = 0;
        sellerGroups[item.sellerId] += item.sellerPayout;
      }
      for (const [sellerId, payout] of Object.entries(sellerGroups)) {
        await tx.seller.update({
          where: { id: sellerId },
          data: {
            totalSales: { increment: 1 },
            totalRevenue: { increment: payout },
          },
        });
      }

      return newOrder;
    });

    res.status(201).json({
      message: 'Order placed successfully!',
      order: {
        id: order.id,
        total: order.total,
        status: order.status,
        paymentMethod: order.paymentMethod,
        itemCount: order.items.length,
      },
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: true, message: err.errors[0].message });
    }
    next(err);
  }
});

// -------- GET /api/orders --------
// Get user's order history
router.get('/', authenticate, async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId: req.user.id },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit),
        include: {
          items: {
            include: {
              product: { select: { name: true, slug: true, images: true } },
              seller: { select: { shopName: true } },
            },
          },
          address: { select: { city: true, state: true } },
        },
      }),
      prisma.order.count({ where: { userId: req.user.id } }),
    ]);

    res.json({
      orders,
      pagination: { page: parseInt(page), total, totalPages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (err) {
    next(err);
  }
});

// -------- GET /api/orders/:id --------
// Order detail
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const order = await prisma.order.findFirst({
      where: { id: req.params.id, userId: req.user.id },
      include: {
        items: {
          include: {
            product: { select: { name: true, slug: true, images: true, fabric: true } },
            seller: { select: { shopName: true, city: true, state: true } },
          },
        },
        address: true,
      },
    });

    if (!order) {
      return res.status(404).json({ error: true, message: 'Order not found' });
    }

    res.json({ order });
  } catch (err) {
    next(err);
  }
});

// -------- PUT /api/orders/:id/cancel --------
// Cancel an order (only if status is PLACED)
router.put('/:id/cancel', authenticate, async (req, res, next) => {
  try {
    const order = await prisma.order.findFirst({
      where: { id: req.params.id, userId: req.user.id },
      include: { items: true },
    });

    if (!order) {
      return res.status(404).json({ error: true, message: 'Order not found' });
    }

    if (order.status !== 'PLACED') {
      return res.status(400).json({ error: true, message: 'Order can only be cancelled if status is PLACED' });
    }

    // Restore stock and cancel
    await prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: order.id },
        data: { status: 'CANCELLED' },
      });

      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stockCount: { increment: item.quantity } },
        });
        await tx.orderItem.update({
          where: { id: item.id },
          data: { fulfillmentStatus: 'REFUNDED' },
        });
      }
    });

    res.json({ message: 'Order cancelled successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
