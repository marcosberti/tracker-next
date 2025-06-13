"use client";
import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { IconSquareRoundedPlusFilled } from "@tabler/icons-react";
import { useState } from "react";
import { CurrencyModal } from "./currency-modal";
import { CategoryModal } from "./category-modal";

export function SettingsHeader() {
  const [modalOpen, setModalOpen] = useState<"currency" | "category" | null>(
    null
  );

  return (
    <AppHeader>
      <h1>Settings</h1>
      <div className="ml-auto flex gap-2">
        <Button variant="default" onClick={() => setModalOpen("currency")}>
          <span>Add currency</span>
          <IconSquareRoundedPlusFilled className="size-6" />
        </Button>
        <Button variant="default" onClick={() => setModalOpen("category")}>
          <span>Add category</span>
          <IconSquareRoundedPlusFilled className="size-6" />
        </Button>
      </div>
      {modalOpen === "currency" && (
        <CurrencyModal
          isOpen={modalOpen === "currency"}
          onClose={() => {
            setModalOpen(null);
          }}
        />
      )}
      {modalOpen === "category" && (
        <CategoryModal
          isOpen={modalOpen === "category"}
          onClose={() => {
            setModalOpen(null);
          }}
        />
      )}
    </AppHeader>
  );
}
