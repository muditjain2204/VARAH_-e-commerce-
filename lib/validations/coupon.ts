import { z } from "zod";

export const couponSchema = z.object({
  code: z
    .string()
    .min(3, "Coupon code must be at least 3 characters")
    .max(20, "Coupon code must be under 20 characters")
    .transform((val) => val.toUpperCase()),
  description: z.string().optional(),
  discountType: z.enum(["PERCENTAGE", "FIXED"]),
  discountValue: z
    .number()
    .positive("Discount value must be positive"),
  minOrderAmount: z.number().positive().optional().nullable(),
  maxDiscount: z.number().positive().optional().nullable(),
  usageLimit: z.number().int().positive().optional().nullable(),
  usageLimitPerUser: z.number().int().positive().default(1),
  isActive: z.boolean().default(true),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
}).refine(
  (data) => data.endDate > data.startDate,
  {
    message: "End date must be after start date",
    path: ["endDate"],
  }
).refine(
  (data) => {
    if (data.discountType === "PERCENTAGE" && data.discountValue > 100) {
      return false;
    }
    return true;
  },
  {
    message: "Percentage discount cannot exceed 100%",
    path: ["discountValue"],
  }
);

export const applyCouponSchema = z.object({
  code: z.string().min(1, "Coupon code is required"),
});

export type CouponFormValues = z.infer<typeof couponSchema>;
export type ApplyCouponValues = z.infer<typeof applyCouponSchema>;
