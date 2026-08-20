import { z } from "zod";

export const menuItemSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(200),
  description: z.string().trim().min(1, "Description is required").max(1000),
  priceCents: z.number().int().positive("Price must be greater than 0"),
  category: z.string().trim().min(1, "Category is required").max(100),
  available: z.boolean(),
  imageUrl: z
    .string()
    .trim()
    .max(2000)
    .refine((v) => v === "" || v.startsWith("http://") || v.startsWith("https://") || v.startsWith("/"), {
      message: "Enter a full image URL (https://...) or a path like /menu/photo.jpg",
    })
    .optional()
    .transform((v) => (v ? v : null)),
});

export type MenuItemInput = z.infer<typeof menuItemSchema>;
