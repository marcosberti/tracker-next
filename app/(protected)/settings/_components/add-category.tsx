"use client";
import { Button } from "@/components/ui/button";
import { CategoryModal } from "./category-modal";
import { useState } from "react";
import {
  IconCategoryPlus,
  IconSquareRoundedPlusFilled,
} from "@tabler/icons-react";

export function AddCategory() {
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  return (
    <>
      <Button size="sm" variant="default" onClick={() => setModalOpen(true)}>
        <span className="hidden lg:block">Add category</span>
        <IconSquareRoundedPlusFilled className="size-6 hidden lg:block" />
        <IconCategoryPlus className="size-6 lg:hidden" />
      </Button>
      {modalOpen && (
        <CategoryModal
          isOpen
          onClose={() => {
            setModalOpen(false);
          }}
        />
      )}
    </>
  );
}
