import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string({ invalid_type_error: "Name is required" })
    .min(1, "Name is required"),
  icon: z
    .string({ invalid_type_error: "Icon is required" })
    .min(1, "Icon is required"),
  color: z
    .string({ invalid_type_error: "Color is required" })
    .min(1, "Color is required"),
});

export type CategorySchema = z.infer<typeof categorySchema>;
