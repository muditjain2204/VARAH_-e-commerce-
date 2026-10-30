import { z } from "zod";

export const productSchema = z.object({
  name: z
    .string()
    .min(3, "Product name must be at least 3 characters")
    .max(200, "Product name must be under 200 characters"),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters"),
  shortDescription: z
    .string()
    .max(500, "Short description must be under 500 characters")
    .optional(),
  categoryId: z.string().min(1, "Category is required"),
  basePrice: z
    .number()
    .positive("Price must be greater than 0")
    .max(1000000, "Price seems too high"),
  salePrice: z
    .number()
    .positive("Sale price must be greater than 0")
    .optional()
    .nullable(),
  sku: z
    .string()
    .min(3, "SKU must be at least 3 characters")
    .max(50, "SKU must be under 50 characters"),
  fabric: z.string().optional(),
  occasion: z.string().optional(),
  color: z.string().optional(),
  weight: z.number().positive().optional().nullable(),
  length: z.number().positive().optional().nullable(),
  blousePiece: z.boolean().default(false),
  washCare: z.string().optional(),
  isFeatured: z.boolean().default(false),
  isTrending: z.boolean().default(false),
  isNewArrival: z.boolean().default(false),
  isBestSeller: z.boolean().default(false),
  isActive: z.boolean().default(true),
  metaTitle: z.string().max(70).optional(),
  metaDescription: z.string().max(320).optional(),
  metaKeywords: z.string().optional(),
});

export const productVariantSchema = z.object({
  name: z.string().min(1, "Variant name is required"),
  sku: z.string().min(3, "SKU is required"),
  price: z.number().positive().optional().nullable(),
  color: z.string().optional(),
  size: z.string().optional(),
  quantity: z.number().int().min(0, "Quantity cannot be negative").default(0),
  lowStockThreshold: z.number().int().min(0).default(5),
});

export const categorySchema = z.object({
  name: z
    .string()
    .min(2, "Category name must be at least 2 characters")
    .max(100, "Category name must be under 100 characters"),
  description: z.string().optional(),
  parentId: z.string().optional().nullable(),
  image: z.string().url("Invalid image URL").optional().nullable(),
  sortOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

export type ProductFormValues = z.infer<typeof productSchema>;
export type ProductVariantFormValues = z.infer<typeof productVariantSchema>;
export type CategoryFormValues = z.infer<typeof categorySchema>;
