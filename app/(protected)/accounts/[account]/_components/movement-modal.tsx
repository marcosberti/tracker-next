"use client";
import { startTransition, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Error } from "@/components/ui/error";
import { Account, Currency } from "@prisma/client";
import { Select } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useResetableActionState } from "@/hooks/use-resetable-action-state";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { mutateMovement } from "../actions";
import { MOVEMENT_TYPES_OPTIONS } from "@/app/_schemas/movement";
import { useCurrencies } from "@/hooks/use-currencies";
import { useCategories } from "@/hooks/use-categories";
import { Movement } from "../page";
import { useSession } from "next-auth/react";

type CreateModalProps = {
  isOpen: boolean;
  movement?: Movement | null;
  account: Pick<Account, "id" | "name"> & {
    currency: Pick<Currency, "id" | "code">;
  };
  onClose: () => void;
};

export function MovementModal({
  isOpen,
  movement,
  account,
  onClose,
}: CreateModalProps) {
  const isEditing = Boolean(movement);
  const { data: session } = useSession();
  const { isFetching: isFetchingCurrencies, currencies } = useCurrencies(
    session!.user!.id as string
  );
  const { isFetching: isFetchingCategories, categories } = useCategories(
    session!.user!.id as string
  );
  const [state, formAction, isPending, reset] = useResetableActionState(
    mutateMovement,
    {
      accountId: account.id,
      currencyId: movement?.currency.id ?? account.currency.id,
      date: movement?.date
        ? new Date(movement.date).toISOString().slice(0, 10)
        : new Date().toISOString().slice(0, 10),
      error: null,
      success: false,
      title: movement?.title ?? "",
      amount: movement?.amount ?? null,
      type: movement?.type ?? "",
      categoryId: movement?.category.id ?? "",
      description: movement?.description ?? "",
    }
  );

  useEffect(() => {
    if (state?.success) {
      startTransition(() => {
        const action = isEditing ? "updated" : "added";
        toast.success(`Movement ${action} successfully`);
        reset();
        onClose();
      });
    }
  }, [state?.success, onClose, isEditing]);

  useEffect(() => {
    if (!state?.success && state?.error?.message) {
      toast.error(state.error.message);
    }
  }, [state]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Update" : "Add"} movement</DialogTitle>
        </DialogHeader>

        {isFetchingCurrencies || isFetchingCategories ? (
          <div className="flex items-center justify-center">
            <Loader2 className="size-10 animate-spin" />
          </div>
        ) : (
          <form
            action={formAction}
            className="space-y-4 w-full max-w-md mt-8"
            noValidate
          >
            <input type="hidden" name="id" value={movement?.id ?? ""} />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2 lg:col-span-1">
                <Label htmlFor="title">Title</Label>
                <Input
                  type="text"
                  name="title"
                  defaultValue={(state?.title as string) ?? ""}
                />
                {state?.error?.title && <Error>{state?.error.title[0]}</Error>}
              </div>
              <div className="space-y-2 col-span-2 lg:col-span-1 w-full">
                <Label htmlFor="date">Date</Label>
                <Input
                  type="date"
                  name="date"
                  disabled={isEditing}
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
                  min={0}
                  defaultValue={state?.amount ?? ""}
                />
                {state?.error?.amount && (
                  <Error>{state?.error.amount[0]}</Error>
                )}
              </div>
              <div className="space-y-2 col-span-2 lg:col-span-1">
                <Label htmlFor="currencyId">Currency</Label>
                <Select
                  name="currencyId"
                  placeholder="Select a currency"
                  disabled={!currencies.length || isEditing}
                  defaultValue={(state?.currencyId as string) ?? undefined}
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2 lg:col-span-1">
                <Label htmlFor="type">Type</Label>
                <Select
                  name="type"
                  placeholder="Select a type"
                  disabled={isEditing}
                  defaultValue={(state?.type as string) ?? undefined}
                  options={MOVEMENT_TYPES_OPTIONS.map((type) => ({
                    value: type,
                    label: type.charAt(0).toUpperCase() + type.slice(1),
                  }))}
                />
                {state?.error?.type && <Error>{state?.error.type[0]}</Error>}
              </div>
              <div className="space-y-2 col-span-2 lg:col-span-1">
                <Label htmlFor="accountId">Account</Label>
                <Select
                  name="accountId"
                  placeholder="Select an account"
                  disabled={isEditing}
                  defaultValue={(state?.accountId as string) ?? undefined}
                  options={[
                    {
                      value: account.id,
                      label: account.name,
                    },
                  ]}
                />
                {state?.error?.accountId && (
                  <Error>{state?.error.accountId[0]}</Error>
                )}
              </div>
            </div>

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
                {movement ? "Update" : "Add"} movement
                {isPending && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
