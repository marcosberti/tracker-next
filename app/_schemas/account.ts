import { z } from "zod";

export const accountSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  balance: z.coerce.number().min(0).optional(),
  currencyId: z.string().min(1, { message: "Currency is required" }),
  isMain: z.coerce.boolean().optional(),
});

export type AccountSchema = z.infer<typeof accountSchema>;

export function parseFormData(formData: FormData) {
  const data = {
    name: formData.get("name"),
    balance: Number(formData.get("balance")),
    currencyId: formData.get("currencyId"),
    isMain: formData.get("isMain") === "on",
  };

  const result = accountSchema.safeParse(data);

  return { result, data };
}
