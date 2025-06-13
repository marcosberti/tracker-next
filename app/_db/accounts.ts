import { prisma } from "@/lib/prisma";
import { Account, Prisma } from "@prisma/client";
import { getLoggedUser } from "./session";
import { redirect } from "next/navigation";

type AccountsWithInclude<T extends Prisma.AccountFindManyArgs> =
  Prisma.AccountGetPayload<{
    select: T["select"];
  }>;

export async function getAccounts<T extends Prisma.AccountFindManyArgs>(
  _options: T
) {
  const user = await getLoggedUser();

  if (!user?.id) {
    return redirect("/login");
  }

  const options = {
    ..._options,
    where: {
      ..._options.where,
      userId: user.id,
    },
  };

  const accounts = await prisma.account.findMany(options);

  return accounts as unknown as AccountsWithInclude<T>[];
}

export async function getAccountById(id: string) {
  const user = await getLoggedUser();

  if (!user?.id) {
    return redirect("/login");
  }

  const account = await prisma.account.findUnique({
    where: {
      id,
      userId: user.id,
    },
  });
  return account;
}

export async function createAccount(
  data: Omit<Prisma.AccountUncheckedCreateInput, "userId">
) {
  const user = await getLoggedUser();

  if (!user?.id) {
    return redirect("/login");
  }

  const account = await prisma.account.create({
    data: {
      ...data,
      userId: user.id,
    },
  });
  return account;
}

export async function updateAccount(
  id: Account["id"],
  data: Omit<Prisma.AccountUncheckedUpdateInput, "userId">
) {
  const user = await getLoggedUser();

  if (!user?.id) {
    return redirect("/login");
  }

  const account = await prisma.account.update({
    where: {
      id,
      userId: user.id,
    },
    data: {
      ...data,
    },
  });

  return account;
}
