"use server";

import { prisma } from "@/lib/prisma";
import type { ActionResponse, CartItemData } from "@/types";

/**
 * Fetch cart from database for authenticated user.
 */
export async function getUserCart(userId: string): Promise<ActionResponse<CartItemData[]>> {
  if (!userId) {
    return { success: false, error: "User ID is required." };
  }

  try {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { where: { isPrimary: true }, take: 1 },
              },
            },
            variant: true,
          },
        },
      },
    });

    if (!cart) {
      return { success: true, data: [] };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const items: CartItemData[] = cart.items.map((item: any) => ({
      id: item.id,
      productId: item.productId,
      name: item.product.name,
      slug: item.product.slug,
      price: Number(item.product.salePrice ?? item.product.basePrice),
      originalPrice: item.product.salePrice ? Number(item.product.basePrice) : null,
      image: item.product.images[0]?.url || "/images/placeholder-saree.jpg",
      variantId: item.variantId,
      color: item.variant?.color,
      fabric: item.product.fabric,
      quantity: item.quantity,
    }));

    return { success: true, data: items };
  } catch (error) {
    console.warn("Could not fetch user cart from database:", error);
    return { success: false, error: "Database offline or cart unavailable" };
  }
}

/**
 * Sync client cart items into user's database cart.
 */
export async function syncCartAction(
  userId: string,
  items: CartItemData[]
): Promise<ActionResponse<boolean>> {
  if (!userId) {
    return { success: false, error: "User ID is required." };
  }

  try {
    // Find or create cart for user
    const cart = await prisma.cart.upsert({
      where: { userId },
      create: { userId },
      update: {},
    });

    // Replace items
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    if (items.length > 0) {
      await prisma.cartItem.createMany({
        data: items.map((item) => ({
          cartId: cart.id,
          productId: item.productId,
          variantId: item.variantId || null,
          quantity: item.quantity,
        })),
      });
    }

    return { success: true, data: true };
  } catch (error) {
    console.warn("Could not sync cart to database:", error);
    return { success: false, error: "Failed to sync cart" };
  }
}
