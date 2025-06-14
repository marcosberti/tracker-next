"use client";
import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { IconSquareRoundedPlusFilled } from "@tabler/icons-react";
import { useState } from "react";
import { AccountModal } from "./account-modal";

export function AccountsHeader() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <AppHeader>
      <h1>Accounts</h1>
      <div className="ml-auto">
        <Button variant="default" onClick={() => setIsOpen(true)}>
          <span>Add account</span>
          <IconSquareRoundedPlusFilled className="size-6" />
        </Button>
      </div>
      {isOpen && (
        <AccountModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      )}
    </AppHeader>
  );
}
