"use client";
import { Account, Currency } from "@prisma/client";
import { Card } from "@/components/ui/gradient-card";
import { startTransition, useState } from "react";
import { formatCurrency } from "@/lib/formatters";
import { Button } from "@/components/ui/button";
import { IconPencil, IconStarFilled } from "@tabler/icons-react";
import { AccountModal } from "./account-modal";
import Link from "next/link";
import { AccountType } from "../page";

type AccountsListProps = {
  accounts: AccountType[];
};

export function AccountsList({ accounts }: AccountsListProps) {
  const [account, setAccount] = useState<AccountType | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="@container/main flex-1 py-4 md:py-6">
        <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
          {accounts.map((account) => (
            <Card
              key={account.id}
              className="group"
              headerTitle={
                <div className="flex items-center justify-between gap-2">
                  <Link href={`/accounts/${account.id}`}>
                    {formatCurrency(
                      account.balance,
                      account.currency?.code ?? ""
                    )}
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => {
                      setAccount(account);
                      setIsOpen(true);
                    }}
                  >
                    <IconPencil className="size-6" />
                  </Button>
                </div>
              }
              headerDescription={
                <Link href={`/accounts/${account.id}`}>{account.name}</Link>
              }
              badge={
                account.isMain ? <IconStarFilled className="size-4" /> : null
              }
            />
            // </Link>
          ))}
        </div>
      </div>
      {isOpen && (
        <AccountModal
          isOpen={isOpen}
          account={account}
          onClose={() => {
            startTransition(() => {
              setIsOpen(false);
              setAccount(null);
            });
          }}
        />
      )}
    </>
  );
}
