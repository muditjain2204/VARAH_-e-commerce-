"use server";

import { verifyPaymentAndConfirmOrder } from "@/lib/services/order.service";
import type { ActionResponse } from "@/types";

export async function verifyPaymentAction(params: {
  orderId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}): Promise<ActionResponse<boolean>> {
  try {
    await verifyPaymentAndConfirmOrder(params);
    return {
      success: true,
      data: true,
    };
  } catch (error: unknown) {
    console.error("verifyPaymentAction error:", error);
    const message = error instanceof Error ? error.message : "Payment verification failed";
    return {
      success: false,
      error: message,
    };
  }
}
