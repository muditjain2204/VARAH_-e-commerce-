import { prisma } from "@/lib/prisma";
import { type ProductFilters, type PaginatedResponse, type ProductCard } from "@/types";
import { ITEMS_PER_PAGE } from "@/constants";
import { Prisma } from "@prisma/client";

const CATEGORY_SLUG_ALIASES: Record<string, string> = {
  kanjeevaram: "kanjivaram",
  "banarasi-saree": "banarasi",
  "banarasi-sarees": "banarasi",
  "kanjeevaram-sarees": "kanjivaram",
  "kanjivaram-sarees": "kanjivaram",
  "georgette-sarees": "georgette",
  "chiffon-sarees": "chiffon",
  "cotton-sarees": "cotton",
  "silk-sarees": "silk",
  "net-sarees": "net",
  "designer-sarees": "designer",
  "bridal-sarees": "bridal",
  "half-saree": "half-sarees",
  "organza-sarees": "organza",
  "chanderi-sarees": "chanderi",
};

/**
 * Build Prisma where clause from filters.
 */
function buildWhereClause(filters: ProductFilters): Prisma.ProductWhereInput {
  const where: Prisma.ProductWhereInput = {
    isActive: true,
    deletedAt: null,
  };

  if (filters.categorySlug) {
    const normalizedSlug =
      CATEGORY_SLUG_ALIASES[filters.categorySlug.toLowerCase()] ||
      filters.categorySlug;
    where.category = { slug: normalizedSlug };
  }

  if (filters.fabric) {
    where.fabric = filters.fabric;
  }

  if (filters.occasion) {
    where.occasion = filters.occasion;
  }

  if (filters.color) {
    where.color = filters.color;
  }

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    where.basePrice = {};
    if (filters.minPrice !== undefined) {
      where.basePrice.gte = filters.minPrice;
    }
    if (filters.maxPrice !== undefined && filters.maxPrice !== Infinity) {
      where.basePrice.lte = filters.maxPrice;
    }
  }

  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: "insensitive" } },
      { description: { contains: filters.search, mode: "insensitive" } },
      { fabric: { contains: filters.search, mode: "insensitive" } },
      { occasion: { contains: filters.search, mode: "insensitive" } },
      { category: { name: { contains: filters.search, mode: "insensitive" } } },
    ];
  }

  if (filters.isFeatured) where.isFeatured = true;
  if (filters.isTrending) where.isTrending = true;
  if (filters.isNewArrival) {
    // Sarees older than 2 weeks (14 days) are automatically unlisted from New Arrivals
    // and remain only in their respective category.
    const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
    where.isNewArrival = true;
    where.createdAt = { gte: twoWeeksAgo };
  }
  if (filters.isBestSeller) where.isBestSeller = true;

  return where;
}

/**
 * Build Prisma orderBy from sort option.
 */
function buildOrderBy(
  sort?: string
): Prisma.ProductOrderByWithRelationInput | Prisma.ProductOrderByWithRelationInput[] {
  switch (sort) {
    case "price_asc":
      return { basePrice: "asc" };
    case "price_desc":
      return { basePrice: "desc" };
    case "popular":
      return { totalSold: "desc" };
    case "rating":
      return { averageRating: "desc" };
    case "newest":
    default:
      return { createdAt: "desc" };
  }
}

/**
 * Get paginated products with filters.
 */
export async function getProducts(
  filters: ProductFilters = {}
): Promise<PaginatedResponse<ProductCard>> {
  const page = filters.page || 1;
  const limit = filters.limit || ITEMS_PER_PAGE;
  const skip = (page - 1) * limit;

  try {
    const where = buildWhereClause(filters);
    const orderBy = buildOrderBy(filters.sort);

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          images: {
            where: { isPrimary: true },
            take: 1,
          },
          category: {
            select: {
              name: true,
              slug: true,
            },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: products as ProductCard[],
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore: page < totalPages,
      },
    };
  } catch (error) {
    console.warn("Database error in getProducts (is Postgres running?):", error);
    return {
      data: [],
      pagination: {
        page,
        limit,
        total: 0,
        totalPages: 0,
        hasMore: false,
      },
    };
  }
}

/**
 * Get a single product by slug with full details.
 */
export async function getProductBySlug(slug: string) {
  try {
    return await prisma.product.findUnique({
      where: { slug, isActive: true, deletedAt: null },
      include: {
        category: true,
        images: {
          orderBy: { sortOrder: "asc" },
        },
        variants: {
          where: { isActive: true },
          include: {
            inventory: true,
          },
        },
        reviews: {
          where: { isApproved: true },
          orderBy: { createdAt: "desc" },
          take: 10,
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
          },
        },
      },
    });
  } catch (error) {
    console.warn(`Database error in getProductBySlug (${slug}):`, error);
    return null;
  }
}

/**
 * Get related products (same category, excluding current product).
 */
export async function getRelatedProducts(
  categoryId: string,
  productId: string,
  limit = 4
) {
  try {
    return await prisma.product.findMany({
      where: {
        categoryId,
        id: { not: productId },
        isActive: true,
        deletedAt: null,
      },
      take: limit,
      orderBy: { totalSold: "desc" },
      include: {
        images: {
          where: { isPrimary: true },
          take: 1,
        },
        category: {
          select: { name: true, slug: true },
        },
      },
    });
  } catch (error) {
    console.warn("Database error in getRelatedProducts:", error);
    return [];
  }
}

/**
 * Get featured products for homepage sections.
 */
export async function getFeaturedProducts(limit = 4) {
  try {
    const res = await prisma.product.findMany({
      where: { isFeatured: true, isActive: true, deletedAt: null },
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        category: { select: { name: true, slug: true } },
      },
    });
    return res;
  } catch (error) {
    console.warn("Database error in getFeaturedProducts:", error);
    return [];
  }
}

export async function getTrendingProducts(limit = 4) {
  try {
    const res = await prisma.product.findMany({
      where: { isTrending: true, isActive: true, deletedAt: null },
      take: limit,
      orderBy: { totalSold: "desc" },
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        category: { select: { name: true, slug: true } },
      },
    });
    return res;
  } catch (error) {
    console.warn("Database error in getTrendingProducts:", error);
    return [];
  }
}

export async function getNewArrivals(limit = 4) {
  const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

  try {
    // Automatically unlist sarees older than 2 weeks (14 days) from New Arrivals
    // so they only remain in their respective category.
    await prisma.product
      .updateMany({
        where: {
          isNewArrival: true,
          createdAt: { lt: twoWeeksAgo },
        },
        data: {
          isNewArrival: false,
        },
      })
      .catch(() => {});

    const res = await prisma.product.findMany({
      where: {
        isNewArrival: true,
        isActive: true,
        deletedAt: null,
        createdAt: { gte: twoWeeksAgo },
      },
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        category: { select: { name: true, slug: true } },
      },
    });
    return res;
  } catch (error) {
    console.warn("Database error in getNewArrivals:", error);
    return [];
  }
}

export async function getBestSellers(limit = 4) {
  try {
    const res = await prisma.product.findMany({
      where: { isBestSeller: true, isActive: true, deletedAt: null },
      take: limit,
      orderBy: { totalSold: "desc" },
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        category: { select: { name: true, slug: true } },
      },
    });
    return res;
  } catch (error) {
    console.warn("Database error in getBestSellers:", error);
    return [];
  }
}

/**
 * Get all active categories.
 */
export async function getCategories() {
  try {
    return await prisma.category.findMany({
      where: { isActive: true, deletedAt: null },
      orderBy: { sortOrder: "asc" },
      include: {
        _count: {
          select: { products: { where: { isActive: true } } },
        },
      },
    });
  } catch (error) {
    console.warn("Database error in getCategories:", error);
    return [];
  }
}

/**
 * Get category by slug (supports slug aliases like kanjeevaram -> kanjivaram).
 */
export async function getCategoryBySlug(slug: string) {
  const normalizedSlug = CATEGORY_SLUG_ALIASES[slug.toLowerCase()] || slug;

  try {
    return await prisma.category.findUnique({
      where: { slug: normalizedSlug, isActive: true, deletedAt: null },
      include: {
        _count: {
          select: { products: { where: { isActive: true } } },
        },
      },
    });
  } catch (error) {
    console.warn(`Database error in getCategoryBySlug (${slug}):`, error);
    return null;
  }
}

/**
 * Search products (basic full-text).
 */
export async function searchProducts(query: string, limit = 8) {
  if (!query || query.length < 2) return [];

  try {
    return await prisma.product.findMany({
      where: {
        isActive: true,
        deletedAt: null,
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { fabric: { contains: query, mode: "insensitive" } },
          { occasion: { contains: query, mode: "insensitive" } },
          { color: { contains: query, mode: "insensitive" } },
          { category: { name: { contains: query, mode: "insensitive" } } },
        ],
      },
      take: limit,
      orderBy: { totalSold: "desc" },
      select: {
        id: true,
        name: true,
        slug: true,
        basePrice: true,
        salePrice: true,
        images: {
          where: { isPrimary: true },
          take: 1,
          select: { url: true },
        },
        category: {
          select: { name: true },
        },
      },
    });
  } catch (error) {
    console.warn("Database error in searchProducts:", error);
    return [];
  }
}

/**
 * Get distinct filter values for sidebar.
 */
export async function getFilterOptions() {
  try {
    const [fabrics, occasions, colors] = await Promise.all([
      prisma.product.findMany({
        where: { isActive: true, deletedAt: null, fabric: { not: null } },
        select: { fabric: true },
        distinct: ["fabric"],
      }),
      prisma.product.findMany({
        where: { isActive: true, deletedAt: null, occasion: { not: null } },
        select: { occasion: true },
        distinct: ["occasion"],
      }),
      prisma.product.findMany({
        where: { isActive: true, deletedAt: null, color: { not: null } },
        select: { color: true },
        distinct: ["color"],
      }),
    ]);

    return {
      fabrics: fabrics.map((f) => f.fabric).filter(Boolean) as string[],
      occasions: occasions.map((o) => o.occasion).filter(Boolean) as string[],
      colors: colors.map((c) => c.color).filter(Boolean) as string[],
    };
  } catch (error) {
    console.warn("Database error in getFilterOptions:", error);
    return {
      fabrics: [],
      occasions: [],
      colors: [],
    };
  }
}
