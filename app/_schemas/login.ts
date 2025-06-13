import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string({ invalid_type_error: "Invalid Email" })
    .email("Invalid Email")
    .min(1, "Email is required"),
  password: z
    .string({ invalid_type_error: "Invalid Password" })
    .min(8, "Password must be at least 8 characters long"),
});

export type LoginSchema = z.infer<typeof loginSchema>;
