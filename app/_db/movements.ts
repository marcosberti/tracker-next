import { Account, Movement, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { updateBalance } from "./accounts";
import { MOVEMENT_TYPES } from "../_schemas/movement";

export async function createMovement(
  userId: string,
  data: Omit<Prisma.MovementUncheckedCreateInput, "userId">
) {
  const amount =
    data.type === MOVEMENT_TYPES.INCOME ? data.amount : data.amount * -1;
  return prisma.$transaction(async (tx) => {
    await tx.movement.create({
      data: {
        ...data,
        userId,
      },
    });
    return await updateBalance(userId, data.accountId, amount, tx);
  });
}

export async function updateMovement(
  userId: string,
  id: Movement["id"],
  data: Omit<
    Prisma.MovementUncheckedUpdateInput,
    "createdAt" | "updatedAt" | "accountId" | "type" | "currencyId" | "date"
  > & {
    amount: number;
  }
) {
  const oldMovement = await prisma.movement.findUnique({
    where: {
      id,
      userId,
    },
  });

  if (!oldMovement) {
    throw new Error("Movement not found");
  }

  const oldAmount =
    oldMovement.type === MOVEMENT_TYPES.INCOME
      ? oldMovement.amount * -1
      : oldMovement.amount;
  const amount =
    oldMovement.type === MOVEMENT_TYPES.INCOME ? data.amount : data.amount * -1;

  return prisma.$transaction(async (tx) => {
    await tx.movement.update({
      where: {
        id,
        userId,
      },
      data: {
        ...data,
      },
    });

    return await updateBalance(
      userId,
      oldMovement.accountId,
      oldAmount + amount,
      tx
    );
  });
}

export async function getMovements(
  userId: string,
  accountId: string,
  _options: Prisma.MovementFindManyArgs
) {
  const options = {
    ..._options,
    where: {
      ..._options.where,
      userId,
      accountId,
    },
  };

  return prisma.movement.findMany(options);
}

export async function getMovementsCount(
  userId: string,
  accountId: string,
  _options: Prisma.MovementCountArgs
) {
  const options = {
    ..._options,
    where: {
      ..._options.where,
      userId,
      accountId,
    },
  };

  return prisma.movement.count(options);
}

export async function getMovementsTotals(
  userId: string,
  accountId: string,
  {
    by,
    where: _where,
  }: {
    by: Prisma.MovementScalarFieldEnum[];
    where: Prisma.MovementGroupByArgs["where"];
  }
) {
  const options = {
    by,
    where: {
      ..._where,
      userId,
      accountId,
    },
    _sum: {
      amount: true as const,
    },
  };

  return prisma.movement.groupBy(options);
}
