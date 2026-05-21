const express = require('express');
const prisma = require('../lib/prisma');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// -------- GET /api/wishlist --------
router.get('/', authenticate, async (req, res, next) => {
  try {
    const items = await prisma.wishlistItem.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        product: {
          select: {
            id: true, name: true, slug: true, price: true, originalPrice: true,
            discount: true, images: true, category: true, fabric: true, work: true,
            rating: true, reviewCount: true, tags: true, stockCount: true,
            seller: { select: { shopName: true, rating: true } },
          },
        },
      },
    });

    res.json({
      wishlist: items.map(i => ({ ...i.product, wishlistItemId: i.id })),
      count: items.length,
    });
  } catch (err) {
    next(err);
  }
});

// -------- POST /api/wishlist/:productId --------
router.post('/:productId', authenticate, async (req, res, next) => {
  try {
    const { productId } = req.params;

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) return res.status(404).json({ error: true, message: 'Product not found' });

    // Toggle: if exists, remove; otherwise add
    const existing = await prisma.wishlistItem.findUnique({
      where: { userId_productId: { userId: req.user.id, productId } },
    });

    if (existing) {
      await prisma.wishlistItem.delete({ where: { id: existing.id } });
      return res.json({ message: 'Removed from wishlist', wishlisted: false });
    }

    await prisma.wishlistItem.create({
      data: { userId: req.user.id, productId },
    });

    res.status(201).json({ message: 'Added to wishlist', wishlisted: true });
  } catch (err) {
    next(err);
  }
});

// -------- DELETE /api/wishlist/:productId --------
router.delete('/:productId', authenticate, async (req, res, next) => {
  try {
    await prisma.wishlistItem.deleteMany({
      where: { userId: req.user.id, productId: req.params.productId },
    });
    res.json({ message: 'Removed from wishlist' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
