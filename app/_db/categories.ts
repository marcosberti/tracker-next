"use server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function getCategories(
  userId: string,
  _options: Prisma.CategoryFindManyArgs = {}
) {
  const options = {
    ..._options,
    where: {
      ..._options.where,
      userId,
    },
  };
  const categories = await prisma.category.findMany(options);
  return categories;
}
