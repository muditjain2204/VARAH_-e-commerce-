"use server";

import { validateCoupon } from "@/lib/services/coupon.service";
import type { ActionResponse, AppliedCoupon } from "@/types";

export async function applyCouponAction(
  code: string,
  subtotal: number,
  userId?: string
): Promise<ActionResponse<AppliedCoupon>> {
  try {
    const result = await validateCoupon(code, subtotal, userId);
    if (!result.success || !result.coupon) {
      return {
        success: false,
        error: result.error || "Failed to apply coupon",
      };
    }

    return {
      success: true,
      data: result.coupon,
    };
  } catch (error) {
    console.error("applyCouponAction error:", error);
    return {
      success: false,
      error: "Something went wrong while applying the coupon.",
    };
  }
}
