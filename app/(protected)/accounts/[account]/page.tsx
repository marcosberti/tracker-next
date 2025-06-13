"use server";
import { redirect } from "next/navigation";
import { formatCurrency } from "@/lib/formatters";
import { Card } from "@/components/ui/gradient-card";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Category, Currency, Movement, User } from "@prisma/client";
import { getMonthStart, getMonthEnd } from "@/lib/dates";
import { MonthFilter } from "./_components/month-filter";
import { MovementsList } from "./_components/movements-list";
import { ITEMS_PER_PAGE } from "@/lib/pagination";
import { AccountHeader } from "./_components/header";
import { MOVEMENT_TYPES } from "@/app/_schemas/movement";

export type ScopedMovement = Pick<
  Movement,
  "id" | "title" | "amount" | "type" | "date" | "description"
> & {
  category: Pick<Category, "id" | "name" | "icon" | "color">;
  currency: Pick<Currency, "id" | "code">;
};

async function getData(accountId: string, monthParam: string, page: number) {
  throw new Error("Not implemented -> fetch account");
  const session = await auth();
  if (!session) {
    return redirect("/login");
  }
  const user = session.user as User;
  const account = await prisma.account.findUnique({
    select: {
      id: true,
      name: true,
      currency: {
        select: {
          id: true,
          code: true,
        },
      },
    },
    where: { id: accountId, userId: user.id },
  });

  if (!account) {
    return redirect("/accounts");
  }

  const [year, month] = monthParam.split("-");

  const start = getMonthStart(year, month);
  const end = getMonthEnd(year, month);

  const [movements, totalMovements, totals] = await Promise.all([
    prisma.movement.findMany({
      select: {
        id: true,
        title: true,
        amount: true,
        type: true,
        date: true,
        description: true,
        category: {
          select: {
            id: true,
            name: true,
            icon: true,
            color: true,
          },
        },
        currency: {
          select: {
            id: true,
            code: true,
          },
        },
      },
      where: {
        accountId,
        userId: user.id,
        date: {
          gte: start,
          lte: end,
        },
      },
      orderBy: {
        date: "desc",
      },
      take: ITEMS_PER_PAGE,
      skip: (page - 1) * ITEMS_PER_PAGE,
    }),
    prisma.movement.count({
      where: {
        accountId,
        userId: user.id,
        date: {
          gte: start,
          lte: end,
        },
      },
    }),
    prisma.movement.groupBy({
      by: ["type"],
      where: {
        accountId,
        userId: user.id,
        date: {
          gte: start,
          lte: end,
        },
      },
      _sum: {
        amount: true,
      },
    }),
  ]);

  const totalIncome =
    totals.find((t) => t.type === MOVEMENT_TYPES.INCOME)?._sum.amount ?? 0;
  const totalExpenses =
    totals.find((t) => t.type === MOVEMENT_TYPES.EXPENSE)?._sum.amount ?? 0;

  return {
    account,
    movements,
    totalIncome,
    totalExpenses,
    totalMovements,
  };
}

export default async function AccountPage({
  params: paramsPromise,
  searchParams: searchParamsPromise,
}: {
  params: Promise<{ account: string }>;
  searchParams: Promise<{ month: string; page: number }>;
}) {
  const { account: accountId } = await paramsPromise;
  const searchParams = await searchParamsPromise;
  const month = searchParams.month ?? new Date().toISOString().slice(0, 7);
  const page = searchParams.page ? Number(searchParams.page) : 1;
  const { account, totalIncome, totalExpenses, movements, totalMovements } =
    await getData(accountId, month, page);

  return (
    <>
      <AccountHeader account={account} />
      <div className="flex flex-col gap-4 p-4">
        <div className="flex items-center justify-end gap-2">
          <MonthFilter month={month} />
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card
            headerTitle={formatCurrency(totalIncome, account.currency.code)}
            headerDescription="Total Income"
          />
          <Card
            headerTitle={formatCurrency(totalExpenses, account.currency.code)}
            headerDescription="Total Expenses"
          />
        </div>
        <MovementsList
          account={account}
          movements={movements}
          month={month}
          page={page}
          totalMovements={totalMovements}
        />
      </div>
    </>
  );
}
