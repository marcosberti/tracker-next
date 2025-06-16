"use server";
import { redirect } from "next/navigation";
import { parseMovement } from "@/app/_schemas/movement";
import { revalidatePath } from "next/cache";
import {
  createMovement,
  updateMovement,
  payInstallment as payInstallmentDb,
} from "@/app/_db/movements";
import { getLoggedUser } from "@/app/_db/session";
import { getAccountById } from "@/app/_db/accounts";
import { parseInstallmentExpense } from "@/app/_schemas/installment-expense";
import { parseFixedExpense } from "@/app/_schemas/fixed-expense";
import {
  createInstallmentExpense,
  updateInstallmentExpense,
} from "@/app/_db/installment-expenses";
import {
  createFixedExpense,
  updateFixedExpense,
} from "@/app/_db/fixed-expenses";

export async function mutateMovement(initialState: any, formData: FormData) {
  const user = await getLoggedUser();

  if (!user?.id) {
    return redirect("/login");
  }

  const { data, result } = parseMovement(formData);

  if (!result.success) {
    return {
      ...data,
      success: false,
      error: {
        ...result.error.flatten().fieldErrors,
        message: "Invalid form data",
      },
    };
  }

  try {
    const account = await getAccountById(user.id, result.data.accountId);

    if (!account) {
      return redirect("/accounts");
    }

    const id = formData.get("id");

    if (id) {
      const { title, amount, categoryId, description } = result.data;
      await updateMovement(user.id, id as string, {
        title,
        amount,
        categoryId,
        description,
      });
    } else {
      const movementData = {
        ...result.data,
        fixedExpenseId: result.data.fixedExpenseId ?? null,
        installmentExpenseId: result.data.installmentExpenseId ?? null,
      };
      await createMovement(user.id, movementData);
    }

    revalidatePath(`/accounts/${account.id}`);
    return {
      ...data,
      success: true,
      error: null,
    };
  } catch (error) {
    return {
      ...data,
      success: false,
      error: {
        title: null,
        date: null,
        amount: null,
        currencyId: null,
        type: null,
        accountId: null,
        categoryId: null,
        description: null,
        message: "Failed to add movement",
      },
    };
  }
}

async function mutateFixedExpense(userId: string, formData: FormData) {
  const { data, result } = parseFixedExpense(formData);

  if (!result.success) {
    return {
      ...data,
      type: "fixed",
      success: false,
      error: result.error.flatten().fieldErrors,
    };
  }

  try {
    const account = await getAccountById(userId, result.data.accountId);
    if (!account) {
      return redirect("/accounts");
    }

    const id = formData.get("id") as string;

    if (id) {
      const { currencyId: _, ...fixedData } = result.data;
      await updateFixedExpense(userId, id, fixedData);
    } else {
      await createFixedExpense(userId, result.data);
    }

    revalidatePath(`/accounts/${account.id}`);
    return {
      ...data,
      success: true,
      error: null,
    };
  } catch (error) {
    return {
      ...data,
      type: "fixed",
      success: false,
      error: {
        title: null,
        amount: null,
        isActive: null,
        categoryId: null,
        accountId: null,
        currencyId: null,
        message: "Failed to add expense",
      },
    };
  }
}

async function mutateInstallmentExpense(userId: string, formData: FormData) {
  const { data, result } = parseInstallmentExpense(formData);

  if (!result.success) {
    return {
      ...data,
      type: "installment",
      success: false,
      error: result.error.flatten().fieldErrors,
    };
  }

  try {
    const account = await getAccountById(userId, result.data.accountId);
    if (!account) {
      return redirect("/accounts");
    }
    const id = formData.get("id") as string;

    if (id) {
      const installmentData = {
        title: result.data.title,
        amount: result.data.amount,
        categoryId: result.data.categoryId,
        accountId: account.id,
      };
      await updateInstallmentExpense(userId, id, installmentData);
    } else {
      const installmentData = {
        ...result.data,
        firstPaymentMonth: new Date(
          `${result.data.firstPaymentMonth}-01T00:00:00`
        ),
      };
      await createInstallmentExpense(userId, installmentData);
    }
    revalidatePath(`/accounts/${account.id}`);
    return {
      ...data,
      type: "installment",
      success: true,
      error: null,
    };
  } catch (error) {
    return {
      ...data,
      type: "installment",
      success: false,
      error: {
        title: null,
        amount: null,
        installments: null,
        firstPaymentMonth: null,
        categoryId: null,
        accountId: null,
        currencyId: null,
        message: "Failed to add expense",
      },
    };
  }
}

export async function mutateExpense(initialState: any, formData: FormData) {
  const user = await getLoggedUser();

  if (!user?.id) {
    return redirect("/login");
  }

  const type = formData.get("type") as
    | "fixed"
    | "installment"
    | undefined
    | null;
  if (!type) {
    return {
      ...[...formData.entries()].reduce((acc: any, [k, v]) => {
        acc[k] = v;
        return acc;
      }, {}),
      success: false,
      error: {
        type: ["Expense type is required"],
      },
    };
  }

  return type === "fixed"
    ? mutateFixedExpense(user.id, formData)
    : mutateInstallmentExpense(user.id, formData);
}

export async function payInstallment(initialState: any, formData: FormData) {
  const user = await getLoggedUser();

  if (!user?.id) {
    return redirect("/login");
  }

  const { data, result } = parseMovement(formData);

  if (!result.success) {
    return {
      ...data,
      success: false,
      error: {
        ...result.error.flatten().fieldErrors,
        message: "Invalid form data",
      },
    };
  }

  if (!data.installmentExpenseId || !result.data.installmentExpenseId) {
    return {
      ...data,
      success: false,
      error: {
        installmentExpenseId: ["Installment expense is required"],
        message: "Invalid form data",
      },
    };
  }

  try {
    const movementData = {
      ...result.data,
      fixedExpenseId: null,
      installmentExpenseId: result.data.installmentExpenseId as string,
    };
    await payInstallmentDb(user.id, movementData);
    revalidatePath(`/accounts/${data.accountId}`);
    return {
      ...data,
      success: true,
      error: null,
    };
  } catch (error) {
    return {
      ...data,
      success: false,
      error: {
        message: "Failed to pay installment",
      },
    };
  }
}
