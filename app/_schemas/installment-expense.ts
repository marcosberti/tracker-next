import { z } from "zod";

const INSTALLMENTS_VALUES = [3, 6, 12];

export const installmentExpenseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  // totalAmount: z.coerce.number().min(1, "Total amount is required"),
  amount: z.coerce.number().min(1, "Amount is required"),
  installments: z.coerce
    .number()
    .min(0, "Total installments is required")
    .refine((val) => INSTALLMENTS_VALUES.includes(val), {
      message: "Total installments must be 3, 6 or 12",
    }),
  firstPaymentMonth: z.string().refine(
    (val) => {
      const dateFormatRegex = /^\d{4}-\d{2}$/;
      return val && dateFormatRegex.test(val);
    },
    {
      message: "First payment month is required",
    }
  ),
  categoryId: z.string().min(1, "Category is required"),
  accountId: z.string().min(1, "Account is required"),
  currencyId: z.string().min(1, "Currency is required"),
});

export type InstallmentExpenseSchema = z.infer<typeof installmentExpenseSchema>;

export function parseInstallmentExpense(formData: FormData) {
  const data = {
    title: formData.get("title"),
    amount: formData.get("amount"),
    installments: formData.get("installments"),
    firstPaymentMonth: formData.get("firstPaymentMonth"),
    categoryId: formData.get("categoryId"),
    accountId: formData.get("accountId"),
    currencyId: formData.get("currencyId"),
  };

  const result = installmentExpenseSchema.safeParse(data);

  return { data, result };
}
