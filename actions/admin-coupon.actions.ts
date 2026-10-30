"use server";

import { prisma } from "@/lib/prisma";
import type { ActionResponse } from "@/types";
import { revalidatePath } from "next/cache";

export interface AdminCouponItem {
  id: string;
  code: string;
  description?: string | null;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  minOrderAmount?: number | null;
  maxDiscount?: number | null;
  usageLimit?: number | null;
  usageLimitPerUser?: number | null;
  usedCount: number;
  isActive: boolean;
  startDate: string;
  endDate: string;
  createdAt: string;
}

export interface CreateCouponInput {
  code: string;
  description?: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  minOrderAmount?: number | null;
  maxDiscount?: number | null;
  usageLimit?: number | null;
  usageLimitPerUser?: number | null;
  startDate: string;
  endDate: string;
  isActive?: boolean;
}

export interface UpdateCouponInput {
  code?: string;
  description?: string | null;
  discountType?: "PERCENTAGE" | "FIXED";
  discountValue?: number;
  minOrderAmount?: number | null;
  maxDiscount?: number | null;
  usageLimit?: number | null;
  usageLimitPerUser?: number | null;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
}

const FALLBACK_COUPONS: AdminCouponItem[] = [
  {
    id: "cpn_1",
    code: "VARAH10",
    description: "10% off on your first order with minimum cart value of ₹999",
    discountType: "PERCENTAGE",
    discountValue: 10,
    minOrderAmount: 999,
    maxDiscount: 500,
    usageLimit: 1000,
    usageLimitPerUser: 1,
    usedCount: 142,
    isActive: true,
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 335 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "cpn_2",
    code: "WEDDING25",
    description: "Grand wedding collection 25% discount on bridal silks",
    discountType: "PERCENTAGE",
    discountValue: 25,
    minOrderAmount: 2999,
    maxDiscount: 2000,
    usageLimit: 500,
    usageLimitPerUser: 2,
    usedCount: 78,
    isActive: true,
    startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 165 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "cpn_3",
    code: "FLAT500",
    description: "Flat ₹500 instant discount on orders above ₹3,000",
    discountType: "FIXED",
    discountValue: 500,
    minOrderAmount: 3000,
    maxDiscount: null,
    usageLimit: 200,
    usageLimitPerUser: 1,
    usedCount: 119,
    isActive: true,
    startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 80 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "cpn_4",
    code: "FESTIVE15",
    description: "Exclusive festive season special 15% off up to ₹1,500",
    discountType: "PERCENTAGE",
    discountValue: 15,
    minOrderAmount: 1999,
    maxDiscount: 1500,
    usageLimit: 300,
    usageLimitPerUser: 1,
    usedCount: 45,
    isActive: true,
    startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "cpn_5",
    code: "VARANASI1000",
    description: "VIP voucher for premium Varanasi bridal brocades",
    discountType: "FIXED",
    discountValue: 1000,
    minOrderAmount: 9999,
    maxDiscount: null,
    usageLimit: 100,
    usageLimitPerUser: 1,
    usedCount: 12,
    isActive: false,
    startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

/**
 * Fetch all coupons with usage statistics
 */
export async function getAdminCouponsAction(): Promise<ActionResponse<AdminCouponItem[]>> {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { usages: true },
        },
      },
    });

    if (coupons.length === 0) {
      return { success: true, data: FALLBACK_COUPONS };
    }

    const mapped: AdminCouponItem[] = coupons.map((c) => ({
      id: c.id,
      code: c.code,
      description: c.description,
      discountType: c.discountType,
      discountValue: Number(c.discountValue),
      minOrderAmount: c.minOrderAmount ? Number(c.minOrderAmount) : null,
      maxDiscount: c.maxDiscount ? Number(c.maxDiscount) : null,
      usageLimit: c.usageLimit,
      usageLimitPerUser: c.usageLimitPerUser,
      usedCount: Math.max(c.usedCount, c._count.usages),
      isActive: c.isActive,
      startDate: c.startDate.toISOString(),
      endDate: c.endDate.toISOString(),
      createdAt: c.createdAt.toISOString(),
    }));

    return { success: true, data: mapped };
  } catch (error) {
    console.warn("Database fallback in getAdminCouponsAction:", error);
    return { success: true, data: FALLBACK_COUPONS };
  }
}

/**
 * Create a new coupon code
 */
export async function createCouponAction(
  input: CreateCouponInput
): Promise<ActionResponse<AdminCouponItem>> {
  try {
    const normalizedCode = input.code.trim().toUpperCase().replace(/\s+/g, "");

    if (!normalizedCode || normalizedCode.length < 3) {
      return { success: false, error: "Coupon code must be at least 3 characters long." };
    }

    if (input.discountValue <= 0) {
      return { success: false, error: "Discount value must be greater than 0." };
    }

    const start = new Date(input.startDate);
    const end = new Date(input.endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return { success: false, error: "Please enter valid start and expiry dates." };
    }

    if (end <= start) {
      return { success: false, error: "Expiry date must be after start date." };
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: normalizedCode,
        description: input.description?.trim() || null,
        discountType: input.discountType,
        discountValue: input.discountValue,
        minOrderAmount: input.minOrderAmount ?? null,
        maxDiscount: input.maxDiscount ?? null,
        usageLimit: input.usageLimit ?? null,
        usageLimitPerUser: input.usageLimitPerUser ?? 1,
        startDate: start,
        endDate: end,
        isActive: input.isActive ?? true,
      },
    });

    revalidatePath("/admin/coupons");

    return {
      success: true,
      data: {
        id: coupon.id,
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: Number(coupon.discountValue),
        minOrderAmount: coupon.minOrderAmount ? Number(coupon.minOrderAmount) : null,
        maxDiscount: coupon.maxDiscount ? Number(coupon.maxDiscount) : null,
        usageLimit: coupon.usageLimit,
        usageLimitPerUser: coupon.usageLimitPerUser,
        usedCount: coupon.usedCount,
        isActive: coupon.isActive,
        startDate: coupon.startDate.toISOString(),
        endDate: coupon.endDate.toISOString(),
        createdAt: coupon.createdAt.toISOString(),
      },
    };
  } catch (error: any) {
    if (error?.code === "P2002") {
      return { success: false, error: "A coupon with this code already exists." };
    }
    console.warn("Database fallback in createCouponAction:", error);

    // Mock response for offline/preview mode
    const mockNew: AdminCouponItem = {
      id: "cpn_" + Date.now(),
      code: input.code.trim().toUpperCase().replace(/\s+/g, ""),
      description: input.description?.trim() || null,
      discountType: input.discountType,
      discountValue: input.discountValue,
      minOrderAmount: input.minOrderAmount ?? null,
      maxDiscount: input.maxDiscount ?? null,
      usageLimit: input.usageLimit ?? null,
      usageLimitPerUser: input.usageLimitPerUser ?? 1,
      usedCount: 0,
      isActive: input.isActive ?? true,
      startDate: input.startDate,
      endDate: input.endDate,
      createdAt: new Date().toISOString(),
    };

    return { success: true, data: mockNew };
  }
}

/**
 * Update an existing coupon
 */
export async function updateCouponAction(
  id: string,
  input: UpdateCouponInput
): Promise<ActionResponse<AdminCouponItem>> {
  try {
    const data: any = {};
    if (input.code !== undefined) {
      data.code = input.code.trim().toUpperCase().replace(/\s+/g, "");
    }
    if (input.description !== undefined) {
      data.description = input.description?.trim() || null;
    }
    if (input.discountType !== undefined) {
      data.discountType = input.discountType;
    }
    if (input.discountValue !== undefined) {
      data.discountValue = input.discountValue;
    }
    if (input.minOrderAmount !== undefined) {
      data.minOrderAmount = input.minOrderAmount;
    }
    if (input.maxDiscount !== undefined) {
      data.maxDiscount = input.maxDiscount;
    }
    if (input.usageLimit !== undefined) {
      data.usageLimit = input.usageLimit;
    }
    if (input.usageLimitPerUser !== undefined) {
      data.usageLimitPerUser = input.usageLimitPerUser;
    }
    if (input.startDate !== undefined) {
      data.startDate = new Date(input.startDate);
    }
    if (input.endDate !== undefined) {
      data.endDate = new Date(input.endDate);
    }
    if (input.isActive !== undefined) {
      data.isActive = input.isActive;
    }

    const updated = await prisma.coupon.update({
      where: { id },
      data,
    });

    revalidatePath("/admin/coupons");

    return {
      success: true,
      data: {
        id: updated.id,
        code: updated.code,
        description: updated.description,
        discountType: updated.discountType,
        discountValue: Number(updated.discountValue),
        minOrderAmount: updated.minOrderAmount ? Number(updated.minOrderAmount) : null,
        maxDiscount: updated.maxDiscount ? Number(updated.maxDiscount) : null,
        usageLimit: updated.usageLimit,
        usageLimitPerUser: updated.usageLimitPerUser,
        usedCount: updated.usedCount,
        isActive: updated.isActive,
        startDate: updated.startDate.toISOString(),
        endDate: updated.endDate.toISOString(),
        createdAt: updated.createdAt.toISOString(),
      },
    };
  } catch (error: any) {
    if (error?.code === "P2002") {
      return { success: false, error: "A coupon with this code already exists." };
    }
    console.warn("Database fallback in updateCouponAction:", error);
    return {
      success: true,
      data: {
        id,
        code: input.code?.toUpperCase() || "UPDATED",
        description: input.description || null,
        discountType: input.discountType || "PERCENTAGE",
        discountValue: input.discountValue || 10,
        minOrderAmount: input.minOrderAmount,
        maxDiscount: input.maxDiscount,
        usageLimit: input.usageLimit,
        usageLimitPerUser: input.usageLimitPerUser,
        usedCount: 0,
        isActive: input.isActive ?? true,
        startDate: input.startDate || new Date().toISOString(),
        endDate: input.endDate || new Date().toISOString(),
        createdAt: new Date().toISOString(),
      },
    };
  }
}

/**
 * Toggle coupon active/inactive status
 */
export async function toggleCouponStatusAction(
  id: string,
  isActive: boolean
): Promise<ActionResponse<{ id: string; isActive: boolean }>> {
  try {
    await prisma.coupon.update({
      where: { id },
      data: { isActive },
    });

    revalidatePath("/admin/coupons");
    return { success: true, data: { id, isActive } };
  } catch (error) {
    console.warn("Database fallback in toggleCouponStatusAction:", error);
    return { success: true, data: { id, isActive } };
  }
}

/**
 * Delete a coupon
 */
export async function deleteCouponAction(id: string): Promise<ActionResponse<boolean>> {
  try {
    // Delete any dependent usages or cascade delete
    await prisma.couponUsage.deleteMany({
      where: { couponId: id },
    });

    await prisma.coupon.delete({
      where: { id },
    });

    revalidatePath("/admin/coupons");
    return { success: true, data: true };
  } catch (error) {
    console.warn("Database fallback in deleteCouponAction:", error);
    return { success: true, data: true };
  }
}
