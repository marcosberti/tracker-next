"use server";
import { redirect } from "next/navigation";
import { parseFormData } from "@/app/_schemas/movement";
import { revalidatePath } from "next/cache";
import { createMovement, updateMovement } from "@/app/_db/movements";
import { getLoggedUser } from "@/app/_db/session";
import { getAccountById } from "@/app/_db/accounts";

export async function mutateMovement(initialState: any, formData: FormData) {
  let user = await getLoggedUser();

  if (!user?.id) {
    return redirect("/login");
  }

  const { data, result } = parseFormData(formData);

  if (!result.success) {
    return {
      ...data,
      success: false,
      error: result.error.flatten().fieldErrors,
    };
  }

  try {
    const account = await getAccountById(result.data.accountId);

    if (!account) {
      return redirect("/accounts");
    }

    const id = formData.get("id");
    const movementData = {
      ...result.data,
    };

    if (id) {
      await updateMovement(id as string, account, movementData);

      revalidatePath(`/accounts/${account.id}`);
      return {
        ...data,
        success: true,
        error: null,
        message: "Movement updated successfully",
      };
    } else {
      await createMovement(account, movementData);

      revalidatePath(`/accounts/${account.id}`);
      return {
        ...data,
        success: true,
        error: null,
        message: "Movement added successfully",
      };
    }
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
