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
