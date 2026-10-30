"use server";

import { createOrder, getOrderById, getUserOrders, type CreateOrderParams } from "@/lib/services/order.service";
import type { ActionResponse } from "@/types";

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
    const result = await createOrder(params);
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
