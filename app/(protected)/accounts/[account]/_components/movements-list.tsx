"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { IconCashBanknote } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/formatters";
import { formatDate, formatTime, formatMonthName } from "@/lib/dates";
import {
  IconCircleArrowUpFilled,
  IconCircleArrowDownFilled,
} from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { IconDotsVertical } from "@tabler/icons-react";
import { Pagination } from "@/components/ui/pagination";
import { Account, Currency } from "@prisma/client";
import { getPagination } from "@/lib/pagination";
import { useRouter } from "next/navigation";
import { MOVEMENT_TYPES } from "@/app/_schemas/movement";
import { useState } from "react";
import { MovementModal } from "./movement-modal";
import { ScopedMovement } from "../page";
import { Icon } from "@/components/Icon";

type MovementsListProps = {
  account: Pick<Account, "id" | "name"> & {
    currency: Pick<Currency, "id" | "code">;
  };
  movements: ScopedMovement[];
  month: string;
  totalMovements: number;
  page: number;
};

export function MovementsList({
  account,
  movements,
  month,
  page,
  totalMovements,
}: MovementsListProps) {
  const [movement, setMovement] = useState<ScopedMovement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { totalPages } = getPagination(totalMovements, page);
  const router = useRouter();

  return (
    <>
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="bg-muted sticky top-0 z-10">
            <TableRow>
              <TableHead className="w-[60ch] pl-4">Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right pr-4">Amount</TableHead>
              <TableHead className="text-right pr-4 w-4">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {movements.length ? (
              movements.map((movement, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium pl-4">
                    <div className="flex items-center gap-2">
                      <Tooltip>
                        <TooltipTrigger>
                          <Icon
                            name={movement.category.icon}
                            style={{ fill: movement.category.color }}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{movement.category.name}</p>
                        </TooltipContent>
                      </Tooltip>
                      <div className="flex flex-col">
                        <span>{movement.title}</span>
                        {movement.description && (
                          <small className="text-xs text-muted-foreground">
                            {movement.description}
                          </small>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="text-muted-foreground px-1.5"
                    >
                      {movement.type === MOVEMENT_TYPES.INCOME ? (
                        <>
                          <IconCircleArrowUpFilled className="fill-green-500 dark:fill-green-400" />
                          {movement.type}
                        </>
                      ) : (
                        <>
                          <IconCircleArrowDownFilled className="fill-red-500 dark:fill-red-400" />
                          {movement.type}
                        </>
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{formatDate(movement.date)}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatTime(movement.date)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right pr-4">
                    <span className="font-semibold">
                      {formatCurrency(movement.amount, movement.currency.code)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
                          size="icon"
                        >
                          <IconDotsVertical />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-32">
                        <DropdownMenuItem
                          onClick={() => {
                            setIsOpen(true);
                            setMovement(movement);
                          }}
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">
                  No movements found in{" "}
                  <span className="font-semibold">
                    {formatMonthName(`${month}-01T00:00:00`)}
                  </span>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(page) => {
          router.push(`/accounts/${account.id}?page=${page}`);
        }}
      />
      {isOpen && (
        <MovementModal
          isOpen={isOpen}
          account={account}
          movement={movement}
          onClose={() => {
            setIsOpen(false);
            setMovement(null);
          }}
        />
      )}
    </>
  );
}
