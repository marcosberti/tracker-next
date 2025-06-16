"use client";
import { Button } from "@/components/ui/button";
import { CurrencyModal } from "./currency-modal";
import { useState } from "react";
import {
  IconCashBanknotePlus,
  IconSquareRoundedPlusFilled,
} from "@tabler/icons-react";

export function AddCurrency() {
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  return (
    <>
      <Button size="sm" variant="default" onClick={() => setModalOpen(true)}>
        <span className="hidden lg:block">Add currency</span>
        <IconSquareRoundedPlusFilled className="size-6 hidden lg:block" />
        <IconCashBanknotePlus className="size-6 lg:hidden" />
      </Button>
      {modalOpen && (
        <CurrencyModal
          isOpen
          onClose={() => {
            setModalOpen(false);
          }}
        />
      )}
    </>
  );
}
