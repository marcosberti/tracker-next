"use client";
import { Button } from "@/components/ui/button";
import { IconCashBanknote } from "@tabler/icons-react";
import { useState } from "react";
import { ExpenseModal } from "./expense-modal";
import { Account } from "../page";

export function AddExpense({ account }: { account: Account }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button size="sm" variant="ghost" onClick={() => setIsOpen(true)}>
        <span className="hidden lg:block">New expense</span>
        <IconCashBanknote className="size-6" />
      </Button>
      {isOpen && (
        <ExpenseModal
          isOpen={isOpen}
          account={account}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
