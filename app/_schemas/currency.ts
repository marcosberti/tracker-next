import { z } from "zod";

export const currencySchema = z.object({
  name: z
    .string({ invalid_type_error: "Invalid Name" })
    .min(1, "Name is required"),
  code: z
    .string({ invalid_type_error: "Invalid Code" })
    .min(1, "Code is required"),
});

export type CurrencySchema = z.infer<typeof currencySchema>;
