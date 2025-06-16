import { prisma } from "@/lib/prisma";
import { Account, Prisma } from "@prisma/client";

export async function getAccounts(
  userId: string,
  _options: Prisma.AccountFindManyArgs
) {
  const options = {
    ..._options,
    where: {
      ..._options.where,
      userId,
    },
  };

  const accounts = await prisma.account.findMany(options);

  return accounts;
}

export async function getAccountById(
  userId: string,
  id: string,
  _options?: Omit<Prisma.AccountFindUniqueArgs, "where"> & {
    where?: Prisma.AccountFindUniqueArgs["where"];
  }
) {
  const options = {
    ...(_options ?? {}),
    where: {
      ...(_options?.where ?? {}),
      id,
      userId,
    },
  };

  const account = await prisma.account.findUnique(options);
  return account;
}

export async function createAccount(
  userId: string,
  data: Omit<Prisma.AccountUncheckedCreateInput, "userId">
) {
  return prisma.account.create({
    data: {
      ...data,
      userId,
    },
  });
}

export async function updateAccount(
  userId: string,
  id: Account["id"],
  data: Omit<Prisma.AccountUncheckedUpdateInput, "userId">
) {
  const select = {
    id: true,
  };
  const account = (await getAccountById(userId, id, {
    select,
  })) as unknown as Prisma.AccountGetPayload<{
    select: typeof select;
  }>;

  if (!account) {
    throw new Error("Account not found");
  }

  return prisma.account.update({
    where: {
      id,
      userId,
    },
    data: {
      ...data,
    },
  });
}

export async function updateBalance(
  userId: string,
  id: string,
  amount: number,
  tx?: Prisma.TransactionClient
) {
  const account = await (tx ?? prisma).account.findUnique({
    where: {
      id,
      userId,
    },
  });

  if (!account) {
    throw new Error("Account not found");
  }

  const balance = account!.balance + amount;

  return (tx ?? prisma).account.update({
    where: {
      id,
      userId,
    },
    data: {
      balance,
    },
  });
}
