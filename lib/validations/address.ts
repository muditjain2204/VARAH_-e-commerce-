import { z } from "zod";

export const addressSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  addressLine1: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(200),
  addressLine2: z.string().max(200).optional(),
  city: z.string().min(2, "City is required").max(100),
  state: z.string().min(2, "State is required").max(100),
  pincode: z
    .string()
    .regex(/^\d{6}$/, "Enter a valid 6-digit pincode"),
  landmark: z.string().max(200).optional(),
  isDefault: z.boolean().default(false),
  label: z.string().max(50).optional(),
});

export type AddressFormValues = z.infer<typeof addressSchema>;
