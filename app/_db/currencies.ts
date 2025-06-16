"use server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function getCurrencies(
  userId: string,
  _options: Prisma.CurrencyFindManyArgs = {}
) {
  const options = {
    ..._options,
    where: {
      ..._options.where,
      userId,
    },
  };
  const currencies = await prisma.currency.findMany(options);

  return currencies;
}

export async function getCurrencyById(
  userId: string,
  id: string,
  _options?: Omit<Prisma.CurrencyFindUniqueArgs, "where"> & {
    where?: Prisma.CurrencyFindUniqueArgs["where"];
  }
) {
  const currency = await prisma.currency.findUnique({
    where: { id, userId },
    ..._options,
  });

  if (!currency) {
    throw new Error("Currency not found");
  }

  return currency;
}

export async function createCurrency(
  userId: string,
  data: Omit<Prisma.CurrencyUncheckedCreateInput, "userId">
) {
  return prisma.currency.create({
    data: {
      ...data,
      userId,
    },
  });
}

export async function updateCurrency(
  userId: string,
  id: string,
  data: Omit<Prisma.CurrencyUncheckedUpdateInput, "userId">
) {
  const select = {
    id: true,
  };
  const currency = (await getCurrencyById(userId, id, {
    select,
  })) as unknown as Prisma.CurrencyGetPayload<{
    select: typeof select;
  }>;

  if (!currency) {
    throw new Error("Currency not found");
  }

  return prisma.currency.update({
    where: { id, userId },
    data,
  });
}
