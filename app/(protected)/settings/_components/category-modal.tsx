"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";
import { mutateCategory } from "../action";
import { Error } from "@/components/ui/error";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Category } from "@prisma/client";
import { ICONS_MAP } from "@/lib/icons";

type CategoryModalProps = {
  isOpen: boolean;
  category?: Category;
  onClose: () => void;
};

export function CategoryModal({
  isOpen,
  category,
  onClose,
}: CategoryModalProps) {
  const [selectedIcon, setSelectedIcon] = useState<string | null>(
    category?.icon ?? null
  );
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(mutateCategory, {
    name: category?.name ?? null,
    icon: category?.icon ?? null,
    color: category?.color ?? null,
    success: false,
    error: { name: null, icon: null, color: null, message: "" },
  });

  useEffect(() => {
    if (state?.success) {
      startTransition(() => {
        const action = category ? "updated" : "added";
        toast.success(`Category ${action} successfully`);
        onClose();
      });
    }
  }, [state?.success, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{category ? "Edit" : "Add"} category</DialogTitle>
        </DialogHeader>

        <form
          action={formAction}
          ref={formRef}
          className="space-y-4 w-full max-w-md mt-8"
          noValidate
        >
          <input type="hidden" name="id" value={category?.id ?? ""} />
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
              <Label htmlFor="color">Color</Label>
              <Input
                type="color"
                name="color"
                disabled={isPending}
                defaultValue={(state?.color as string) ?? ""}
              />
              {state?.error?.color && <Error>{state?.error.color[0]}</Error>}
            </div>
          </div>
          <div className="grid grid-cols-6 gap-4">
            {Object.entries(ICONS_MAP).map(([iconName, Icon]) => (
              <Label key={iconName}>
                <input
                  type="radio"
                  name="icon"
                  value={iconName}
                  className="hidden"
                  defaultChecked={selectedIcon === iconName}
                />
                <Button
                  variant={selectedIcon === iconName ? "default" : "ghost"}
                  size="icon"
                  type="button"
                  onClick={() => {
                    const element = formRef.current?.querySelector(
                      `input[name="icon"][value="${iconName}"]`
                    ) as HTMLInputElement;
                    element.click();
                    setSelectedIcon(iconName);
                  }}
                >
                  <Icon className="size-6" />
                </Button>
              </Label>
            ))}
          </div>
          {state?.error?.icon && <Error>{state?.error.icon[0]}</Error>}
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
