"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { startTransition, useEffect } from "react";
import { mutateCurrency } from "../action";
import { Error } from "@/components/ui/error";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useResetableActionState } from "@/hooks/use-resetable-action-state";
import { Currency } from "@prisma/client";

type CurrencyModalProps = {
  isOpen: boolean;
  currency?: Currency;
  onClose: () => void;
};

export function CurrencyModal({
  isOpen,
  currency,
  onClose,
}: CurrencyModalProps) {
  const [state, formAction, isPending, reset] = useResetableActionState(
    mutateCurrency,
    {
      name: currency?.name ?? null,
      code: currency?.code ?? null,
      error: { name: null, code: null, message: "" },
    }
  );

  useEffect(() => {
    if (state?.success) {
      startTransition(() => {
        const action = state.currency ? "updated" : "added";
        toast.success(`Currency ${action} successfully`);
        reset();
        onClose();
      });
    }
  }, [state?.success, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{currency ? "Edit" : "Add"} currency</DialogTitle>
        </DialogHeader>

        <form
          action={formAction}
          className="space-y-4 w-full max-w-md mt-8"
          noValidate
        >
          <input type="hidden" name="id" value={currency?.id ?? ""} />
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2 lg:col-span-1">
              <Label htmlFor="name">Name</Label>
              <Input
                type="text"
                name="name"
                disabled={isPending}
                defaultValue={(state?.name as string) ?? ""}
              />
              {state?.error?.name && <Error>{state?.error.name[0]}</Error>}
            </div>
            <div className="space-y-2 col-span-2 lg:col-span-1">
              <Label htmlFor="code">Code</Label>
              <Input
                type="text"
                name="code"
                readOnly={Boolean(currency?.id)}
                disabled={isPending}
                defaultValue={(state?.code as string) ?? ""}
              />
              {state?.error?.code && <Error>{state?.error.code[0]}</Error>}
            </div>
          </div>
          {state?.error?.message && <Error>{state?.error.message}</Error>}
          <div className="mt-8">
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
