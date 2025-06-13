import { startTransition, useEffect } from "react";
import { mutateAccount } from "../actions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Error } from "@/components/ui/error";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useResetableActionState } from "@/hooks/use-resetable-action-state";
import { toast } from "sonner";
import { AccountType } from "../page";
import { useCurrencies } from "@/hooks/use-currencies";

type CreateModalProps = {
  isOpen: boolean;
  onClose: () => void;
  account?: AccountType | null;
};
export function AccountModal({ isOpen, account, onClose }: CreateModalProps) {
  const { isFetching, currencies } = useCurrencies();

  const [state, formAction, isPending, reset] = useResetableActionState(
    mutateAccount,
    {
      name: account?.name ?? null,
      balance: account?.balance ?? 0,
      currencyId: account?.currency?.id ?? null,
      isMain: account?.isMain ?? false,
      success: false,
      error: {
        name: null,
        balance: null,
        currencyId: null,
        isMain: null,
        message: "",
      },
    }
  );

  useEffect(() => {
    if (state?.success) {
      startTransition(() => {
        const action = account ? "updated" : "added";
        toast.success(`Account ${action} successfully`);
        reset();
        onClose();
      });
    }
  }, [state?.success, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{account ? "Update" : "Add"} account</DialogTitle>
        </DialogHeader>
        {isFetching ? (
          <div className="flex items-center justify-center">
            <Loader2 className="size-4 animate-spin" />
          </div>
        ) : (
          <form
            action={formAction}
            className="space-y-4 w-full max-w-md mt-8"
            noValidate
          >
            <input type="hidden" name="id" value={account?.id ?? ""} />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2 lg:col-span-1">
                <Label htmlFor="name">Name</Label>
                <Input
                  type="text"
                  name="name"
                  defaultValue={(state?.name as string) ?? ""}
                />
                {state?.error?.name && <Error>{state?.error.name[0]}</Error>}
              </div>
              <div className="space-y-2 col-span-2 lg:col-span-1 w-full">
                <Label htmlFor="currencyId">Currency</Label>
                <Select
                  name="currencyId"
                  disabled={!currencies.length}
                  defaultValue={(state?.currencyId as string) ?? undefined}
                  placeholder="Select a currency"
                  options={currencies.map((currency) => ({
                    value: currency.id,
                    label: currency.name,
                  }))}
                />
                {state?.error?.currencyId && (
                  <Error>{state?.error.currencyId[0]}</Error>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="balance">Initial alance</Label>
              <Input
                type="number"
                name="balance"
                min={0}
                defaultValue={state?.balance ?? ""}
              />
              {state?.error?.balance && (
                <Error>{state?.error.balance[0]}</Error>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isMain"
                name="isMain"
                checked={state?.isMain ?? false}
              />
              <Label htmlFor="isMain">Main account</Label>
            </div>
            <div className="mt-8">
              <Button type="submit" className="w-full" disabled={isPending}>
                {account ? "Update" : "Add"} account
                {isPending && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
