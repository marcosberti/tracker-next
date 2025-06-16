import { z } from "zod";

export const MOVEMENT_TYPES = {
  INCOME: "income",
  EXPENSE: "expense",
} as const;
export const MOVEMENT_TYPES_OPTIONS = [
  MOVEMENT_TYPES.INCOME,
  MOVEMENT_TYPES.EXPENSE,
] as const;

export const movementSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  date: z.coerce.date({ message: "Date is required" }),
  amount: z.number().min(0, { message: "Amount is required" }),
  currencyId: z.string().min(1, { message: "Currency is required" }),
  type: z.enum(MOVEMENT_TYPES_OPTIONS, { message: "Type is required" }),
  accountId: z.string().min(1, { message: "Account is required" }),
  categoryId: z.string().min(1, { message: "Category is required" }),
  description: z.string().optional(),
  fixedExpenseId: z.string().optional(),
  installmentExpenseId: z.string().optional(),
});

export function parseMovement(formData: FormData) {
  const data = {
    title: formData.get("title"),
    date: formData.get("date"),
    amount: Number(formData.get("amount")) as number | null,
    currencyId: formData.get("currencyId"),
    type: formData.get("type"),
    accountId: formData.get("accountId"),
    categoryId: formData.get("categoryId"),
    description: formData.get("description"),
    fixedExpenseId: formData.get("fixedExpenseId"),
    installmentExpenseId: formData.get("installmentExpenseId"),
  };

  const result = movementSchema.safeParse(data);

  return {
    data,
    result,
  };
}
