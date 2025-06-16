import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function getFixedExpenses(
  userId: string,
  accountId: string,
  _options: Prisma.FixedExpenseFindManyArgs
) {
  return prisma.fixedExpense.findMany({
    ..._options,
    where: { userId, accountId, ...(_options?.where ?? {}) },
  });
}

export async function createFixedExpense(
  userId: string,
  data: Omit<Prisma.FixedExpenseUncheckedCreateInput, "userId">
) {
  return prisma.fixedExpense.create({
    data: {
      ...data,
      userId,
    },
  });
}

export async function updateFixedExpense(
  userId: string,
  id: string,
  data: Pick<
    Prisma.FixedExpenseUncheckedUpdateInput,
    "title" | "amount" | "categoryId" | "isActive"
  > & {
    accountId: string;
  }
) {
  const fixed = await prisma.fixedExpense.findUnique({
    where: { id, userId },
    select: {
      id: true,
      amount: true,
    },
  });

  if (!fixed) {
    throw new Error("Fixed expense not found");
  }

  const { title, amount, categoryId, accountId, isActive } = data;
  return prisma.fixedExpense.update({
    where: { id, userId, accountId },
    data: {
      title,
      amount,
      categoryId,
      isActive,
    },
  });
}
