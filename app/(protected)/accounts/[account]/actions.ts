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

      revalidatePath(`/accounts/${account.id}`);
      return {
        ...data,
        success: true,
        error: null,
      };
    } else {
      await createMovement(user.id, result.data);

      revalidatePath(`/accounts/${account.id}`);
      return {
        ...data,
        success: true,
        error: null,
      };
    }
  } catch (error) {
    console.error(">>>", error);
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
