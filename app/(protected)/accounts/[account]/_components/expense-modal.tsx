"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Account } from "../page";
import { FixedExpense, InstallmentExpense } from "@prisma/client";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { startTransition, useActionState, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useCategories } from "@/hooks/use-categories";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { mutateExpense } from "../actions";
import { Error } from "@/components/ui/error";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type ExpenseModalProps = {
  isOpen: boolean;
  account: Account;
  expense?: FixedExpense | InstallmentExpense;
  onClose: () => void;
};

export function ExpenseModal({
  isOpen,
  account,
  expense,
  onClose,
}: ExpenseModalProps) {
  const { data: session } = useSession();
  const { isFetching: isFetchingCategories, categories } = useCategories(
    session!.user!.id as string
  );
  const [state, formAction, isPending] = useActionState(mutateExpense, {
    title: "",
    amount: "",
    installments: "",
    firstPaymentMonth: "",
    categoryId: null,
    accountId: account.id,
    currencyId: account.currency.id,
    success: false,
    error: null,
  });
  const [expenseType, setExpenseType] = useState<
    "fixed" | "installment" | undefined
  >();
  const [amount, setAmount] = useState<number | "">("");
  const [installments, setInstallments] = useState<number | null>(null);

  useEffect(() => {
    if (state?.success) {
      startTransition(() => {
        toast.success("Expense added successfully");
        onClose();
      });
    }
  }, [state]);

  useEffect(() => {
    if (!state?.success && state?.error?.message) {
      toast.success(state?.error?.message);
    }
  }, [state]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New expense</DialogTitle>
        </DialogHeader>
        {isFetchingCategories ? (
          <div className="flex items-center justify-center">
            <Loader2 className="size-10 animate-spin" />
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              startTransition(() => {
                e.preventDefault();
                formAction(new FormData(e.target as HTMLFormElement));
              });
            }}
            className="space-y-4 w-full max-w-md mt-8"
            noValidate
          >
            <input type="hidden" name="id" value={expense?.id ?? ""} />

            <div className="space-y-2">
              <Label htmlFor="type">Expense type</Label>
              <Select
                name="type"
                placeholder="Select a expense type"
                options={[
                  { value: "fixed", label: "Fixed" },
                  { value: "installment", label: "Installment" },
                ]}
                value={expenseType as string}
                onValueChange={(value) => {
                  setExpenseType(value as "fixed" | "installment");
                  if (value !== "installment") {
                    setInstallments(null);
                  }
                }}
              />
              {state?.error?.type && <Error>{state?.error.type[0]}</Error>}
            </div>

            {expenseType && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="categoryId">Category</Label>
                  <Select
                    name="categoryId"
                    placeholder="Select a category"
                    defaultValue={(state?.categoryId as string) ?? undefined}
                    options={categories.map((category) => ({
                      value: category.id,
                      label: category.name,
                    }))}
                  />
                  {state?.error?.categoryId && (
                    <Error>{state?.error.categoryId[0]}</Error>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 col-span-2 lg:col-span-1">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      type="text"
                      name="title"
                      defaultValue={(state?.title as string) ?? ""}
                    />
                    {state?.error?.title && (
                      <Error>{state?.error.title[0]}</Error>
                    )}
                  </div>
                  <div className="space-y-2 col-span-2 lg:col-span-1">
                    <Label htmlFor="accountId">Account</Label>
                    <Select
                      readOnly
                      name="accountId"
                      placeholder="Select an account"
                      options={[{ value: account.id, label: account.name }]}
                      value={account.id}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 col-span-2 lg:col-span-1">
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      type="number"
                      name="amount"
                      min={0}
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                    />
                    {state?.error?.amount && (
                      <Error>{state?.error.amount[0]}</Error>
                    )}
                  </div>
                  <div className="space-y-2 col-span-2 lg:col-span-1">
                    <Label htmlFor="currencyId">Currency</Label>
                    <Select
                      readOnly
                      name="currencyId"
                      placeholder="Select a currency"
                      value={account.currency.id}
                      options={[
                        {
                          value: account.currency.id,
                          label: account.currency.code,
                        },
                      ]}
                    />
                    {state?.error?.currencyId && (
                      <Error>{state?.error.currencyId[0]}</Error>
                    )}
                  </div>
                </div>
              </>
            )}

            {expenseType === "fixed" && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isActive"
                  name="isActive"
                  defaultChecked={state?.isActive ?? false}
                />
                <Label htmlFor="isActive">is active</Label>
              </div>
            )}

            {expenseType === "installment" && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 col-span-2 lg:col-span-1">
                    <Label htmlFor="installments">Installments</Label>
                    <Select
                      name="installments"
                      options={[
                        { value: "3", label: "3" },
                        { value: "6", label: "6" },
                        { value: "12", label: "12" },
                        { value: "18", label: "18" },
                      ]}
                      value={installments ? String(installments) : undefined}
                      onValueChange={(value) => setInstallments(Number(value))}
                    />
                    {state?.error?.installments && (
                      <Error>{state?.error.installments[0]}</Error>
                    )}
                  </div>
                  <div className="space-y-2 col-span-2 lg:col-span-1">
                    <Label htmlFor="firstPaymentMonth">
                      First payment month
                    </Label>
                    <Input
                      type="month"
                      name="firstPaymentMonth"
                      defaultValue={state?.firstPaymentMonth ?? ""}
                    />
                    {state?.error?.firstPaymentMonth && (
                      <Error>{state?.error.firstPaymentMonth[0]}</Error>
                    )}
                  </div>
                </div>
                <div className="space-y-2 col-span-2 lg:col-span-1">
                  <Label htmlFor="amount">Total Amount</Label>
                  <Input
                    type="number"
                    name="totalAmount"
                    min={0}
                    value={amount && installments ? amount * installments : ""}
                    disabled
                  />
                </div>
              </>
            )}
            <div className="mt-8">
              <Button type="submit" className="w-full" disabled={isPending}>
                {expense ? "Update" : "Add"} expense
                {isPending && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
