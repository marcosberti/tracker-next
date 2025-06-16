"use client";
import { Button } from "@/components/ui/button";
import { IconSquareRoundedPlusFilled } from "@tabler/icons-react";
import { useState } from "react";
import { MovementModal } from "./movement-modal";
import { Account } from "../page";

export function AddMovement({ account }: { account: Account }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button size="sm" variant="default" onClick={() => setIsOpen(true)}>
        <span className="hidden lg:block">New movement</span>
        <IconSquareRoundedPlusFilled className="size-6" />
      </Button>
      {isOpen && (
        <MovementModal
          isOpen={isOpen}
          account={account}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
