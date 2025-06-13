"use server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getLoggedUser } from "./session";
import { Prisma } from "@prisma/client";

export async function getCategories(
  _options: Prisma.CategoryFindManyArgs = {}
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
  const categories = await prisma.category.findMany(options);
  return categories;
}
