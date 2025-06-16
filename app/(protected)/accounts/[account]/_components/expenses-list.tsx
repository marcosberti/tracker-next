"use client";
import { Badge } from "@/components/ui/badge";
import { FixedExpense, InstallmentExpense } from "../page";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/formatters";
import { Icon } from "@/components/Icon";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { IconCashBanknote } from "@tabler/icons-react";
import { useState } from "react";
import { PayInstallmentModal } from "./pay-installment-modal";

type ExpenseListProps = {
  installmentExpenses: InstallmentExpense[];
  fixedExpenses: FixedExpense[];
};

export function ExpensesList({
  installmentExpenses,
  fixedExpenses,
}: ExpenseListProps) {
  const [expenseModal, setExpenseModal] = useState<
    "installment" | "fixed" | null
  >(null);
  const [expense, setExpense] = useState<
    InstallmentExpense | FixedExpense | null
  >(null);

  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="@container overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="bg-muted sticky top-0 z-10">
              <TableRow>
                <TableHead className="w-[40ch] pl-4">Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Paid</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right pr-4 w-8">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {installmentExpenses.map((installment) => (
                <TableRow key={installment.id}>
                  <TableCell className="font-medium pl-4">
                    <div className="flex items-center gap-2">
                      <Tooltip>
                        <TooltipTrigger>
                          <Icon
                            name={installment.category.icon}
                            style={{ fill: installment.category.color }}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{installment.category.name}</p>
                        </TooltipContent>
                      </Tooltip>
                      <div className="flex flex-col">
                        <small className="text-muted-foreground ">
                          Installment
                        </small>
                        <span>{installment.title}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-muted-foreground hidden lg:block">
                      installment {installment.paidInstallments + 1} of{" "}
                      {installment.installments}
                    </span>
                    <span className="text-xs text-muted-foreground lg:hidden">
                      {installment.paidInstallments + 1} /{" "}
                      {installment.installments}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-muted-foreground">
                      {installment.isAlreadyPaid
                        ? "Already paid this month"
                        : "Pending payment"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end flex-col items-end @lg:flex-row @lg:gap-1 @lg:items-center">
                      <span className="font-semibold">
                        {formatCurrency(
                          installment.amount,
                          installment.currency.code,
                          false
                        )}
                      </span>
                      <small className="text-muted-foreground">
                        {installment.currency.code}
                      </small>
                    </div>
                  </TableCell>
                  <TableCell className="pr-4">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={installment.isAlreadyPaid}
                      onClick={() => {
                        if (installment.isAlreadyPaid) return;
                        setExpenseModal("installment");
                        setExpense(installment);
                      }}
                    >
                      <span className="hidden lg:block">Pay</span>
                      <IconCashBanknote className="size-6 lg:hidden" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {fixedExpenses.map((fixed) => (
                <TableRow key={fixed.id}>
                  <TableCell className="font-medium pl-4">
                    <div className="flex items-center gap-2">
                      <Tooltip>
                        <TooltipTrigger>
                          <Icon
                            name={fixed.category.icon}
                            style={{ fill: fixed.category.color }}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{fixed.category.name}</p>
                        </TooltipContent>
                      </Tooltip>
                      <div className="flex flex-col">
                        <small className="text-muted-foreground">Fixed</small>
                        <span>{fixed.title}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={fixed.isActive ? "default" : "outline"}
                      className="px-1.5"
                    >
                      {fixed.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-muted-foreground">
                      {fixed.isAlreadyPaid
                        ? "Already paid this month"
                        : "Pending payment"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end flex-col items-end @lg:flex-row @lg:gap-1 @lg:items-center">
                      <span className="font-semibold">
                        {formatCurrency(
                          fixed.amount,
                          fixed.currency.code,
                          false
                        )}
                      </span>
                      <small className="text-muted-foreground">
                        {fixed.currency.code}
                      </small>
                    </div>
                  </TableCell>
                  <TableCell className="pr-4">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={fixed.isAlreadyPaid}
                      onClick={() => {
                        if (fixed.isAlreadyPaid) return;
                        setExpenseModal("fixed");
                        setExpense(fixed);
                      }}
                    >
                      <span className="hidden lg:block">Pay</span>
                      <IconCashBanknote className="size-6 lg:hidden" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      {expenseModal === "installment" && (
        <PayInstallmentModal
          isOpen={expenseModal === "installment"}
          installment={expense as InstallmentExpense}
          onClose={() => {
            setExpenseModal(null);
            setExpense(null);
          }}
        />
      )}
    </>
  );
}
