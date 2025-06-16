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

export async function getCategoryById(
  userId: string,
  id: string,
  _options?: Omit<Prisma.CategoryFindUniqueArgs, "where"> & {
    where?: Prisma.CategoryFindUniqueArgs["where"];
  }
) {
  const category = await prisma.category.findUnique({
    where: { id, userId },
    ..._options,
  });

  if (!category) {
    throw new Error("Category not found");
  }

  return category;
}

export async function createCategory(
  userId: string,
  data: Omit<Prisma.CategoryUncheckedCreateInput, "userId">
) {
  return prisma.category.create({
    data: {
      ...data,
      userId,
    },
  });
}

export async function updateCategory(
  userId: string,
  id: string,
  data: Omit<Prisma.CategoryUncheckedUpdateInput, "userId">
) {
  const select = {
    id: true,
  };
  const category = (await getCategoryById(userId, id, {
    select,
  })) as unknown as Prisma.CategoryGetPayload<{
    select: typeof select;
  }>;

  if (!category) {
    throw new Error("Category not found");
  }

  return prisma.category.update({
    where: { id, userId },
    data,
  });
}
