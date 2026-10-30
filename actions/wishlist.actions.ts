"use server";

import { prisma } from "@/lib/prisma";
import type { ActionResponse, WishlistItemData } from "@/types";

/**
 * Fetch wishlist from database for authenticated user.
 */
export async function getUserWishlist(
  userId: string
): Promise<ActionResponse<WishlistItemData[]>> {
  if (!userId) {
    return { success: false, error: "User ID is required." };
  }

  try {
    const wishlist = await prisma.wishlist.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { where: { isPrimary: true }, take: 1 },
              },
            },
          },
        },
      },
    });

    if (!wishlist) {
      return { success: true, data: [] };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const items: WishlistItemData[] = wishlist.items.map((item: any) => ({
      productId: item.productId,
      name: item.product.name,
      slug: item.product.slug,
      price: Number(item.product.salePrice ?? item.product.basePrice),
      originalPrice: item.product.salePrice ? Number(item.product.basePrice) : null,
      image: item.product.images[0]?.url || "/images/placeholder-saree.jpg",
      fabric: item.product.fabric,
      inStock: item.product.isActive,
    }));

    return { success: true, data: items };
  } catch (error) {
    console.warn("Could not fetch user wishlist from database:", error);
    return { success: false, error: "Database offline or wishlist unavailable" };
  }
}

/**
 * Toggle item in user's wishlist in database.
 */
export async function toggleWishlistAction(
  userId: string,
  productId: string
): Promise<ActionResponse<{ inWishlist: boolean }>> {
  if (!userId || !productId) {
    return { success: false, error: "User ID and Product ID are required." };
  }

  try {
    const wishlist = await prisma.wishlist.upsert({
      where: { userId },
      create: { userId },
      update: {},
    });

    const existing = await prisma.wishlistItem.findUnique({
      where: {
        wishlistId_productId: {
          wishlistId: wishlist.id,
          productId,
        },
      },
    });

    if (existing) {
      await prisma.wishlistItem.delete({
        where: { id: existing.id },
      });
      return { success: true, data: { inWishlist: false } };
    } else {
      await prisma.wishlistItem.create({
        data: {
          wishlistId: wishlist.id,
          productId,
        },
      });
      return { success: true, data: { inWishlist: true } };
    }
  } catch (error) {
    console.warn("Could not toggle wishlist item:", error);
    return { success: false, error: "Failed to update wishlist" };
  }
}
