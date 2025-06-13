"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Currency } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { IconPencil } from "@tabler/icons-react";
import { startTransition, useState } from "react";
import { CurrencyModal } from "./currency-modal";

type CurrenciesListProps = {
  currencies: Currency[];
};

export function CurrenciesList({ currencies }: CurrenciesListProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currency, setCurrency] = useState<Currency | null>(null);

  if (currencies.length === 0) {
    return (
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-center">No currencies</CardTitle>
          <CardDescription className="text-center">
            You haven't added any currencies yet. Click the "Add currency"
            button above to get started.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 mb-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      {currencies.map((currency) => (
        <Card
          key={currency.id}
          className="group col-span-1 md:col-span-1 lg:col-span-1"
        >
          <CardHeader>
            <CardTitle>
              <div className="flex items-center justify-between gap-2">
                <span>{currency.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => {
                    setCurrency(currency);
                    setIsOpen(true);
                  }}
                >
                  <IconPencil className="size-6" />
                </Button>
              </div>
            </CardTitle>
            <CardDescription>{currency.code}</CardDescription>
          </CardHeader>
        </Card>
      ))}
      {isOpen && (
        <CurrencyModal
          isOpen={isOpen}
          currency={currency as Currency}
          onClose={() => {
            startTransition(() => {
              setIsOpen(false);
              setCurrency(null);
            });
          }}
        />
      )}
    </div>
  );
}
