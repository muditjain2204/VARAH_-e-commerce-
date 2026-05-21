const express = require('express');
const prisma = require('../lib/prisma');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// -------- GET /api/products --------
// Public — list products with filters, search, pagination, sorting
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const {
      category, subcategory, fabric, occasion, work,
      search, minPrice, maxPrice, sort, tags,
      page = 1, limit = 20,
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    // Build where clause
    const where = { status: 'ACTIVE' };

    if (category) where.category = category;
    if (subcategory) where.subcategory = subcategory;
    if (fabric) where.fabric = { contains: fabric, mode: 'insensitive' };
    if (occasion) where.occasion = { contains: occasion, mode: 'insensitive' };
    if (work) where.work = { contains: work, mode: 'insensitive' };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { fabric: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    if (tags) {
      where.tags = { hasSome: tags.split(',') };
    }

    // Build sort
    let orderBy = { createdAt: 'desc' };
    switch (sort) {
      case 'price_low': orderBy = { price: 'asc' }; break;
      case 'price_high': orderBy = { price: 'desc' }; break;
      case 'rating': orderBy = { rating: 'desc' }; break;
      case 'popular': orderBy = { viewCount: 'desc' }; break;
      case 'newest': orderBy = { createdAt: 'desc' }; break;
      case 'discount': orderBy = { discount: 'desc' }; break;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take,
        select: {
          id: true, name: true, slug: true, price: true, originalPrice: true,
          discount: true, images: true, category: true, subcategory: true,
          fabric: true, work: true, occasion: true, color: true,
          rating: true, reviewCount: true, tags: true, stockCount: true,
          seller: {
            select: { id: true, shopName: true, rating: true, status: true },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    res.json({
      products,
      pagination: {
        page: parseInt(page),
        limit: take,
        total,
        totalPages: Math.ceil(total / take),
      },
    });
  } catch (err) {
    next(err);
  }
});

// -------- GET /api/products/categories --------
// Public — get all categories with product counts
router.get('/categories', async (req, res, next) => {
  try {
    const categories = await prisma.product.groupBy({
      by: ['category'],
      where: { status: 'ACTIVE' },
      _count: { id: true },
    });

    const formatted = categories.map(c => ({
      name: c.category,
      count: c._count.id,
    }));

    res.json({ categories: formatted });
  } catch (err) {
    next(err);
  }
});

// -------- GET /api/products/:slug --------
// Public — single product detail
router.get('/:slug', optionalAuth, async (req, res, next) => {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: req.params.slug },
      include: {
        seller: {
          select: {
            id: true, shopName: true, description: true, rating: true,
            totalSales: true, city: true, state: true, status: true,
            _count: { select: { products: true } },
          },
        },
        reviews: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true, rating: true, title: true, comment: true, images: true, createdAt: true,
            user: { select: { id: true, name: true, avatar: true } },
          },
        },
        _count: { select: { reviews: true } },
      },
    });

    if (!product || product.status !== 'ACTIVE') {
      return res.status(404).json({ error: true, message: 'Product not found' });
    }

    // Increment view count (fire and forget)
    prisma.product.update({
      where: { id: product.id },
      data: { viewCount: { increment: 1 } },
    }).catch(() => {});

    // Check if wishlisted by current user
    let isWishlisted = false;
    if (req.user) {
      const wishItem = await prisma.wishlistItem.findUnique({
        where: { userId_productId: { userId: req.user.id, productId: product.id } },
      });
      isWishlisted = !!wishItem;
    }

    res.json({ product: { ...product, isWishlisted } });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
