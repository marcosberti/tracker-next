import { Account, Movement, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getLoggedUser } from "./session";
import { redirect } from "next/navigation";

export async function createMovement(
  account: Account,
  data: Omit<Prisma.MovementUncheckedCreateInput, "userId">
) {
  const user = await getLoggedUser();
  if (!user?.id) {
    return redirect("/login");
  }

  const [movement] = await prisma.$transaction([
    prisma.movement.create({
      data: {
        ...data,
        userId: user.id,
      },
    }),
    prisma.account.update({
      where: {
        id: account.id,
        userId: user.id,
      },
      data: {
        balance:
          account.balance +
          (data.type === "income" ? data.amount : data.amount * -1),
      },
    }),
  ]);

  return movement;
}

export async function updateMovement(
  id: Movement["id"],
  account: Account,
  data: Omit<Prisma.MovementUncheckedUpdateInput, "createdAt" | "updatedAt"> & {
    amount: number;
  }
) {
  const user = await getLoggedUser();
  if (!user?.id) {
    return redirect("/login");
  }

  const oldMovement = await prisma.movement.findUnique({
    where: {
      id,
      userId: user.id,
    },
  });

  if (!oldMovement) {
    return {
      success: false,
      error: "Movement not found",
    };
  }

  const balance =
    account.balance +
    (oldMovement.type === "income"
      ? oldMovement.amount * -1
      : oldMovement.amount);

  const [movement] = await prisma.$transaction([
    prisma.movement.update({
      where: {
        id,
        userId: user.id,
      },
      data: {
        ...data,
      },
    }),
    prisma.account.update({
      where: {
        id: account.id,
        userId: user.id,
      },
      data: {
        balance:
          balance + (data.type === "income" ? data.amount : data.amount * -1),
      },
    }),
  ]);

  return movement;
}
