import { z } from "zod";

export const checkoutRequestSchema = z
  .object({
    customerName: z.string().trim().min(1, "Name is required").max(200),
    customerEmail: z.string().trim().email("Enter a valid email"),
    customerPhone: z.string().trim().min(7, "Enter a valid phone number").max(30),
    deliveryMethod: z.enum(["DELIVERY", "PICKUP"]),
    deliveryAddress: z.string().trim().max(500).optional(),
    deliveryNotes: z.string().trim().max(500).optional(),
    items: z
      .array(
        z.object({
          menuItemId: z.string().min(1),
          quantity: z.number().int().positive().max(50),
        })
      )
      .min(1, "Your cart is empty"),
  })
  .refine(
    (data) => data.deliveryMethod !== "DELIVERY" || !!data.deliveryAddress?.length,
    { message: "Delivery address is required", path: ["deliveryAddress"] }
  );

export type CheckoutRequest = z.infer<typeof checkoutRequestSchema>;
