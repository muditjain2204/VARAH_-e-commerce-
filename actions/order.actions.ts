"use server";

import { createOrder, getOrderById, getUserOrders, type CreateOrderParams } from "@/lib/services/order.service";
import type { ActionResponse } from "@/types";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createOrderAction(params: CreateOrderParams): Promise<
  ActionResponse<{
    order: {
      id: string;
      orderNumber: string;
      total: number;
      subtotal: number;
      discount: number;
      shippingCharge: number;
      status: string;
      createdAt: Date;
    };
    razorpayOrder: {
      id: string;
      amount: number | string;
      currency: string;
      receipt?: string;
    } | null;
  }>
> {
  try {
    let resolvedUserId = params.userId;

    // Auto-detect logged-in Clerk customer to ensure orders always link to their account
    try {
      const clerkUser = await currentUser();
      if (clerkUser) {
        const userEmail =
          clerkUser.primaryEmailAddress?.emailAddress?.trim().toLowerCase() ||
          clerkUser.emailAddresses[0]?.emailAddress?.trim().toLowerCase();

        let dbUser = await prisma.user.findFirst({
          where: {
            OR: [
              { clerkId: clerkUser.id },
              ...(userEmail ? [{ email: userEmail }] : []),
            ],
          },
        });

        if (!dbUser && userEmail) {
          dbUser = await prisma.user.create({
            data: {
              email: userEmail,
              firstName: clerkUser.firstName || "Customer",
              lastName: clerkUser.lastName || "",
              phone: params.customer.phone || null,
              clerkId: clerkUser.id,
            },
          });
        }
        if (dbUser) {
          resolvedUserId = dbUser.id;
        }
      }
    } catch (authErr) {
      console.warn("Could not retrieve Clerk user in createOrderAction:", authErr);
    }

    const result = await createOrder({
      ...params,
      userId: resolvedUserId || params.userId,
    });

    // Revalidate paths for real-time visibility in admin and customer portals
    revalidatePath("/admin/orders");
    revalidatePath("/admin");
    revalidatePath("/account/orders");
    revalidatePath("/account");
    revalidatePath(`/order-confirmation/${result.order.id}`);

    return {
      success: true,
      data: result,
    };
  } catch (error: unknown) {
    console.error("createOrderAction error:", error);
    const message = error instanceof Error ? error.message : "Failed to create order";
    return {
      success: false,
      error: message,
    };
  }
}

export async function getOrderAction(orderId: string) {
  try {
    const order = await getOrderById(orderId);
    if (!order) {
      return { success: false, error: "Order not found" };
    }
    return { success: true, data: order };
  } catch (error: unknown) {
    console.error("getOrderAction error:", error);
    return { success: false, error: "Failed to retrieve order" };
  }
}

export async function getUserOrdersAction(userId: string) {
  try {
    const orders = await getUserOrders(userId);
    return { success: true, data: orders };
  } catch (error: unknown) {
    console.error("getUserOrdersAction error:", error);
    return { success: false, error: "Failed to retrieve user orders" };
  }
}
