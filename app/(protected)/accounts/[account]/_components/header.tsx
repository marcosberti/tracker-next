"use client";
import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  IconCashBanknote,
  IconSquareRoundedPlusFilled,
} from "@tabler/icons-react";
import type { Account } from "../page";
import { MovementModal } from "./movement-modal";
import { useState } from "react";

type AccountHeaderProps = {
  account: Account;
};

export function AccountHeader({ account }: AccountHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <AppHeader>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/accounts">Accounts</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              <h1>{account.name}</h1>
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="ml-auto flex items-center gap-2">
        <Button variant="ghost">
          <span>Pay expenses</span>
          <IconCashBanknote className="size-6" />
        </Button>
        <Button variant="default" onClick={() => setIsOpen(true)}>
          <span>New transaction</span>
          <IconSquareRoundedPlusFilled className="size-6" />
        </Button>
      </div>
      {isOpen && (
        <MovementModal
          isOpen={isOpen}
          account={account}
          onClose={() => setIsOpen(false)}
        />
      )}
    </AppHeader>
  );
}
