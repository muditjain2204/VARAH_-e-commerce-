import type { Prisma } from "@prisma/client";

// ============================================
// Product types
// ============================================

export type ProductWithDetails = Prisma.ProductGetPayload<{
  include: {
    category: true;
    images: true;
    variants: {
      include: {
        inventory: true;
      };
    };
    reviews: {
      include: {
        user: {
          select: {
            firstName: true;
            lastName: true;
            avatar: true;
          };
        };
      };
    };
  };
}>;

export type ProductCard = Prisma.ProductGetPayload<{
  include: {
    images: {
      where: { isPrimary: true };
      take: 1;
    };
    category: {
      select: {
        name: true;
        slug: true;
      };
    };
  };
}>;

// ============================================
// Cart & Wishlist types
// ============================================

export interface CartItemData {
  id: string; // unique item id (e.g. variantId or productId)
  productId: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number | null;
  image: string;
  variantId?: string | null;
  color?: string | null;
  fabric?: string | null;
  quantity: number;
  maxStock?: number;
}

export interface WishlistItemData {
  productId: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number | null;
  image: string;
  fabric?: string | null;
  inStock?: boolean;
}

export interface AppliedCoupon {
  code: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  discountAmount: number;
  description?: string | null;
}

export type CartWithItems = Prisma.CartGetPayload<{
  include: {
    items: {
      include: {
        product: {
          include: {
            images: {
              where: { isPrimary: true };
              take: 1;
            };
          };
        };
        variant: true;
      };
    };
  };
}>;

// ============================================
// Order types
// ============================================

export type OrderWithDetails = Prisma.OrderGetPayload<{
  include: {
    items: true;
    payment: true;
    shipping: true;
    address: true;
    user: {
      select: {
        firstName: true;
        lastName: true;
        email: true;
        phone: true;
      };
    };
  };
}>;

// ============================================
// Filter & Search types
// ============================================

export interface ProductFilters {
  categorySlug?: string;
  fabric?: string;
  occasion?: string;
  color?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "newest" | "price_asc" | "price_desc" | "popular" | "rating";
  search?: string;
  page?: number;
  limit?: number;
  isFeatured?: boolean;
  isTrending?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

// ============================================
// API Response types
// ============================================

export interface ActionResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// ============================================
// Search types
// ============================================

export interface SearchResult {
  id: string;
  name: string;
  slug: string;
  image?: string;
  price: number;
  category: string;
}

// ============================================
// Analytics types (Admin)
// ============================================

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  recentOrders: OrderWithDetails[];
  topProducts: {
    id: string;
    name: string;
    totalSold: number;
    revenue: number;
  }[];
  ordersByStatus: {
    status: string;
    count: number;
  }[];
  revenueByMonth: {
    month: string;
    revenue: number;
  }[];
}
