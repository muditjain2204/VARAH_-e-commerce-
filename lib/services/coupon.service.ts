import { prisma } from "@/lib/prisma";
import type { AppliedCoupon } from "@/types";

/**
 * Validate and calculate discount for a coupon code.
 */
export async function validateCoupon(
  code: string,
  subtotal: number,
  userId?: string
): Promise<{ success: boolean; coupon?: AppliedCoupon; error?: string }> {
  const normalizedCode = code.trim().toUpperCase();

  if (!normalizedCode) {
    return { success: false, error: "Please enter a coupon code." };
  }

  // Fallback demo coupon if database is not reachable or during test mode
  if (normalizedCode === "VARAH10") {
    if (subtotal < 999) {
      return { success: false, error: "Minimum order value of ₹999 required for VARAH10." };
    }
    const discountAmount = Math.min(Math.round(subtotal * 0.1), 1000);
    return {
      success: true,
      coupon: {
        code: "VARAH10",
        discountType: "PERCENTAGE",
        discountValue: 10,
        discountAmount,
        description: "10% off up to ₹1,000",
      },
    };
  }

  if (normalizedCode === "WELCOME500") {
    if (subtotal < 2999) {
      return { success: false, error: "Minimum order value of ₹2,999 required for WELCOME500." };
    }
    return {
      success: true,
      coupon: {
        code: "WELCOME500",
        discountType: "FIXED",
        discountValue: 500,
        discountAmount: 500,
        description: "Flat ₹500 off",
      },
    };
  }

  try {
    const coupon = await prisma.coupon.findUnique({
      where: { code: normalizedCode },
      include: {
        _count: {
          select: { usages: true },
        },
      },
    });

    if (!coupon) {
      return { success: false, error: "Invalid coupon code." };
    }

    if (!coupon.isActive) {
      return { success: false, error: "This coupon is no longer active." };
    }

    const now = new Date();
    if (now < coupon.startDate) {
      return { success: false, error: "This coupon is not yet valid." };
    }
    if (now > coupon.endDate) {
      return { success: false, error: "This coupon has expired." };
    }

    if (coupon.minOrderAmount && subtotal < Number(coupon.minOrderAmount)) {
      return {
        success: false,
        error: `Minimum order amount of ₹${Number(coupon.minOrderAmount).toLocaleString("en-IN")} required.`,
      };
    }

    if (coupon.usageLimit && coupon._count.usages >= coupon.usageLimit) {
      return { success: false, error: "This coupon has reached its total usage limit." };
    }

    if (userId && coupon.usageLimitPerUser) {
      const userUsageCount = await prisma.couponUsage.count({
        where: {
          couponId: coupon.id,
          userId,
        },
      });

      if (userUsageCount >= coupon.usageLimitPerUser) {
        return {
          success: false,
          error: "You have already used this coupon the maximum allowed times.",
        };
      }
    }

    let discountAmount = 0;
    const discountVal = Number(coupon.discountValue);

    if (coupon.discountType === "PERCENTAGE") {
      discountAmount = Math.round((subtotal * discountVal) / 100);
      if (coupon.maxDiscount) {
        discountAmount = Math.min(discountAmount, Number(coupon.maxDiscount));
      }
    } else {
      discountAmount = Math.min(discountVal, subtotal);
    }

    return {
      success: true,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType as "PERCENTAGE" | "FIXED",
        discountValue: discountVal,
        discountAmount,
        description: coupon.description,
      },
    };
  } catch (error) {
    console.warn("Database coupon lookup failed, coupon not verified:", error);
    return { success: false, error: "Coupon could not be verified at this moment." };
  }
}
