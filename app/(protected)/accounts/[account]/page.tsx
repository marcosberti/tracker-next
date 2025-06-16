"use server";
import { redirect } from "next/navigation";
import { formatCurrency } from "@/lib/formatters";
import { Card } from "@/components/ui/gradient-card";
import { Prisma } from "@prisma/client";
import { getMonthStart, getMonthEnd } from "@/lib/dates";
import { MonthFilter } from "./_components/month-filter";
import { MovementsList } from "./_components/movements-list";
import { ITEMS_PER_PAGE } from "@/lib/pagination";
import { MOVEMENT_TYPES } from "@/app/_schemas/movement";
import { getLoggedUser } from "@/app/_db/session";
import { getAccountById } from "@/app/_db/accounts";
import {
  getMovements,
  getMovementsCount,
  getMovementsTotals,
} from "@/app/_db/movements";
import { AppHeader } from "@/components/app-header";
import { AddMovement } from "./_components/add-movement";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { AddExpense } from "./_components/add-expense";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getInstallmentExpenses } from "@/app/_db/installment-expenses";
import { getFixedExpenses } from "@/app/_db/fixed-expenses";
import { ExpensesList } from "./_components/expenses-list";

const ACCOUNT_SELECT = {
  id: true,
  name: true,
  currency: {
    select: {
      id: true,
      code: true,
    },
  },
};

export type Account = Prisma.AccountGetPayload<{
  select: typeof ACCOUNT_SELECT;
}>;

const COMMON_SELECT = {
  accountId: true,
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
};

const MOVEMENT_SELECT = {
  id: true,
  title: true,
  amount: true,
  type: true,
  date: true,
  description: true,
  fixedExpenseId: true,
  installmentExpenseId: true,
  ...COMMON_SELECT,
};

const FIXED_EXPENSE_SELECT = {
  id: true,
  title: true,
  amount: true,
  isActive: true,
  ...COMMON_SELECT,
};

const INSTALLMENT_EXPENSE_SELECT = {
  id: true,
  title: true,
  amount: true,
  installments: true,
  paidInstallments: true,
  isPaid: true,
  ...COMMON_SELECT,
};

export type Movement = Prisma.MovementGetPayload<{
  select: typeof MOVEMENT_SELECT;
}>;

export type FixedExpense = Prisma.FixedExpenseGetPayload<{
  select: typeof FIXED_EXPENSE_SELECT;
}> & {
  isAlreadyPaid: boolean;
};

export type InstallmentExpense = Prisma.InstallmentExpenseGetPayload<{
  select: typeof INSTALLMENT_EXPENSE_SELECT;
}> & {
  isAlreadyPaid: boolean;
};

async function getData(accountId: string, monthParam: string, page: number) {
  const user = await getLoggedUser();

  if (!user?.id) {
    return redirect("/login");
  }

  const account = (await getAccountById(user.id, accountId, {
    select: ACCOUNT_SELECT,
  })) as unknown as Account;

  if (!account) {
    return redirect("/accounts");
  }

  const [year, month] = monthParam.split("-");

  const start = getMonthStart(year, month);
  const end = getMonthEnd(year, month);

  const [
    movements,
    paidExpenses,
    totalMovements,
    totals,
    _installmentExpenses,
    _fixedExpenses,
  ] = await Promise.all([
    getMovements(user.id, accountId, {
      select: MOVEMENT_SELECT,
      where: {
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
    }) as unknown as Movement[],
    getMovements(user.id, accountId, {
      select: MOVEMENT_SELECT,
      where: {
        AND: [
          {
            date: {
              gte: start,
              lte: end,
            },
          },
          {
            OR: [
              {
                fixedExpenseId: {
                  not: null,
                },
              },
              {
                installmentExpenseId: {
                  not: null,
                },
              },
            ],
          },
        ],
      },
      orderBy: {
        date: "desc",
      },
    }) as unknown as Movement[],
    getMovementsCount(user.id, accountId, {
      where: {
        date: {
          gte: start,
          lte: end,
        },
      },
    }),
    getMovementsTotals(user.id, accountId, {
      by: ["type"],
      where: {
        date: {
          gte: start,
          lte: end,
        },
      },
    }),
    getInstallmentExpenses(user.id, accountId, {
      select: INSTALLMENT_EXPENSE_SELECT,
    }),
    getFixedExpenses(user.id, accountId, {
      select: FIXED_EXPENSE_SELECT,
    }),
  ]);

  const totalIncome =
    totals.find((t) => t.type === MOVEMENT_TYPES.INCOME)?._sum.amount ?? 0;
  const totalExpenses =
    totals.find((t) => t.type === MOVEMENT_TYPES.EXPENSE)?._sum.amount ?? 0;

  const paidFixedExpenses = new Set();
  const paidInstallmentExpenses = new Set();
  paidExpenses.forEach((expense) => {
    if (expense.fixedExpenseId) {
      paidFixedExpenses.add(expense.fixedExpenseId);
    }
    if (expense.installmentExpenseId) {
      paidInstallmentExpenses.add(expense.installmentExpenseId);
    }
  });
  const installmentExpenses = _installmentExpenses.map((i) => ({
    ...i,
    isAlreadyPaid: paidInstallmentExpenses.has(i.id),
  })) as unknown as InstallmentExpense[];
  const fixedExpenses = _fixedExpenses.map((e) => ({
    ...e,
    isAlreadyPaid: paidFixedExpenses.has(e.id),
  })) as unknown as FixedExpense[];

  return {
    account,
    movements,
    paidExpenses,
    totalIncome,
    totalExpenses,
    totalMovements,
    installmentExpenses,
    fixedExpenses,
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
  const data = await getData(accountId, month, page);

  const {
    account,
    totalIncome,
    totalExpenses,
    movements,
    totalMovements,
    installmentExpenses,
    fixedExpenses,
  } = data;

  return (
    <>
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
        <div className="ml-auto flex gap-2">
          <AddExpense account={account} />
          <AddMovement account={account} />
        </div>
      </AppHeader>

      <div className="p-4">
        <Tabs defaultValue="movements">
          <TabsList>
            <TabsTrigger value="movements">Movements</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
          </TabsList>
          <TabsContent value="movements">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-end gap-2">
                <MonthFilter month={month} />
              </div>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <Card
                  headerTitle={formatCurrency(
                    totalIncome,
                    account.currency.code
                  )}
                  headerDescription="Total Income"
                />
                <Card
                  headerTitle={formatCurrency(
                    totalExpenses,
                    account.currency.code
                  )}
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
          </TabsContent>
          <TabsContent value="expenses">
            <ExpensesList
              installmentExpenses={installmentExpenses}
              fixedExpenses={fixedExpenses}
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
