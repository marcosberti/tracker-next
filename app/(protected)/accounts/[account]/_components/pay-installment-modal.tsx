import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { InstallmentExpense } from "../page";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Error } from "@/components/ui/error";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { startTransition, useActionState, useEffect } from "react";
import { toast } from "sonner";
import { payInstallment } from "../actions";
import { Textarea } from "@/components/ui/textarea";

type PayInstallmentModalProps = {
  isOpen: boolean;
  installment: InstallmentExpense;
  onClose: () => void;
};

export function PayInstallmentModal({
  isOpen,
  installment,
  onClose,
}: PayInstallmentModalProps) {
  const [state, formAction, isPending] = useActionState(payInstallment, {
    accountId: installment.accountId,
    currencyId: installment.currency.id,
    date: new Date().toISOString().slice(0, 10),
    error: null,
    success: false,
    title: installment?.title ?? "",
    amount: installment?.amount ?? null,
    type: "expense",
    categoryId: installment?.category.id ?? "",
    installmentExpenseId: installment.id,
    description: "",
    fixedExpenseId: "",
  });

  useEffect(() => {
    if (state?.success) {
      startTransition(() => {
        toast.success("Installment paid successfully");
        onClose();
      });
    }
  }, [state?.success, onClose]);

  useEffect(() => {
    if (!state?.success && state?.error?.message) {
      toast.error(state.error.message);
    }
  }, [state]);

  console.log(">>>e", state);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pay {installment.title}</DialogTitle>
          <DialogDescription>
            Installment {installment.paidInstallments + 1} of{" "}
            {installment.installments}
          </DialogDescription>
        </DialogHeader>
        <form
          className="space-y-4 w-full max-w-md mt-8"
          noValidate
          onSubmit={(e) => {
            startTransition(() => {
              e.preventDefault();
              formAction(new FormData(e.currentTarget));
            });
          }}
        >
          <input
            type="hidden"
            name="installmentExpenseId"
            value={installment.id}
          />
          <input type="hidden" name="fixedExpenseId" value="" />
          <input type="hidden" name="type" value="expense" />
          <input type="hidden" name="accountId" value={installment.accountId} />
          <input
            type="hidden"
            name="categoryId"
            value={installment.category.id}
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2 lg:col-span-1">
              <Label htmlFor="date">Title</Label>
              <Input
                type="text"
                name="title"
                id="title"
                defaultValue={(state?.title as string) ?? ""}
              />
              {state?.error?.title && <Error>{state?.error.title[0]}</Error>}
            </div>
            <div className="space-y-2 col-span-2 lg:col-span-1">
              <Label htmlFor="date">Date</Label>
              <Input
                type="date"
                name="date"
                defaultValue={(state?.date as string) ?? ""}
              />
              {state?.error?.date && <Error>{state?.error.date[0]}</Error>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2 lg:col-span-1">
              <Label htmlFor="amount">Amount</Label>
              <Input
                type="number"
                name="amount"
                id="amount"
                min={0}
                defaultValue={state?.amount ?? ""}
              />
              {state?.error?.amount && <Error>{state?.error.amount[0]}</Error>}
            </div>
            <div className="space-y-2 col-span-2 lg:col-span-1">
              <Label htmlFor="date">Currency</Label>
              <Select
                readOnly
                name="currencyId"
                placeholder="Select a currency"
                value={installment.currency.id}
                options={[
                  {
                    value: installment.currency.id,
                    label: installment.currency.code,
                  },
                ]}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              name="description"
              rows={3}
              placeholder="Enter a description"
              className="resize-none"
              maxLength={255}
              defaultValue={(state?.description as string) ?? ""}
            />
            {state?.error?.description && (
              <Error>{state?.error.description[0]}</Error>
            )}
          </div>

          <div className="mt-8">
            <Button type="submit" className="w-full" disabled={isPending}>
              Pay installment
              {isPending && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
