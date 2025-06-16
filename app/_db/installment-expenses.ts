"use server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function getInstallmentExpenses(
  userId: string,
  accountId: string,
  _options: Prisma.InstallmentExpenseFindManyArgs
) {
  return prisma.installmentExpense.findMany({
    ..._options,
    where: {
      userId,
      accountId,
      isPaid: false,
      ...(_options?.where ?? {}),
    },
  });
}

export async function createInstallmentExpense(
  userId: string,
  data: Omit<
    Prisma.InstallmentExpenseUncheckedCreateInput,
    "userId" | "totalAmount"
  >
) {
  const totalAmount = Number((data.installments * data.amount).toFixed(2));
  return prisma.installmentExpense.create({
    data: {
      ...data,
      totalAmount,
      userId,
    },
  });
}

export async function updateInstallmentExpense(
  userId: string,
  id: string,
  data: Pick<
    Prisma.InstallmentExpenseUncheckedUpdateInput,
    "title" | "amount" | "categoryId"
  > & {
    accountId: string;
  }
) {
  const installment = await prisma.installmentExpense.findUnique({
    where: { id, userId },
    select: {
      id: true,
      installments: true,
      totalAmount: true,
    },
  });
  if (!installment) {
    throw new Error("Installment not found");
  }

  const totalAmount = data.amount
    ? Number((installment.installments * (data.amount as number)).toFixed(2))
    : installment.totalAmount;

  const { title, amount, categoryId, accountId } = data;
  return prisma.installmentExpense.update({
    where: { id, userId, accountId },
    data: {
      title,
      amount,
      categoryId,
      totalAmount,
    },
  });
}

export async function updatePaidInstallment(
  userId: string,
  accountId: string,
  id: string,
  tx: Prisma.TransactionClient
) {
  const installment = await tx.installmentExpense.findUnique({
    where: { id, userId, accountId },
    select: {
      id: true,
      installments: true,
      paidInstallments: true,
    },
  });

  if (!installment) {
    throw new Error("Installment not found");
  }

  const paidInstallments = installment.paidInstallments + 1;
  return tx.installmentExpense.update({
    where: { id, userId, accountId },
    data: {
      paidInstallments,
      isPaid: paidInstallments >= installment.installments,
    },
  });
}
