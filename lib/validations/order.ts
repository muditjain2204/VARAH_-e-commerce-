import { z } from "zod";

export const createOrderSchema = z.object({
  addressId: z.string().min(1, "Shipping address is required"),
  couponCode: z.string().optional(),
  notes: z.string().max(500).optional(),
});

export const updateOrderStatusSchema = z.object({
  orderId: z.string().min(1),
  status: z.enum([
    "PENDING",
    "CONFIRMED",
    "PROCESSING",
    "SHIPPED",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
    "CANCELLED",
    "RETURNED",
    "REFUNDED",
  ]),
  cancelReason: z.string().optional(),
});

export type CreateOrderValues = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusValues = z.infer<typeof updateOrderStatusSchema>;
