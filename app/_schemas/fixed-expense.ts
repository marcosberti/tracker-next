import { z } from "zod";

export const fixedExpenseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  amount: z.coerce.number().min(1, "Amount is required"),
  categoryId: z.string().min(1, "Category is required"),
  accountId: z.string().min(1, "Account is required"),
  currencyId: z.string().min(1, "Currency is required"),
  isActive: z.coerce.boolean().default(true),
});

export type FixedExpenseSchema = z.infer<typeof fixedExpenseSchema>;

export function parseFixedExpense(formData: FormData) {
  const data = {
    title: formData.get("title"),
    amount: formData.get("amount"),
    categoryId: formData.get("categoryId"),
    accountId: formData.get("accountId"),
    currencyId: formData.get("currencyId"),
    isActive: formData.get("isActive"),
  };

  const result = fixedExpenseSchema.safeParse(data);

  return { data, result };
}
