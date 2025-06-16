"use client";
import { Button } from "@/components/ui/button";
import { IconSquareRoundedPlusFilled } from "@tabler/icons-react";
import { useState } from "react";
import { AccountModal } from "./account-modal";

export function AddAccount() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button size="sm" variant="default" onClick={() => setIsOpen(true)}>
        <span className="hidden lg:block">Add account</span>
        <IconSquareRoundedPlusFilled className="size-6" />
      </Button>
      {isOpen && (
        <AccountModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      )}
    </>
  );
}
