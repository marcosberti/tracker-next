"use server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";
import { getLoggedUser } from "./session";

export async function getCurrencies(
  _options: Prisma.CurrencyFindManyArgs = {}
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
  const currencies = await prisma.currency.findMany(options);

  return currencies;
}
