"use server";
import { parseFormData } from "@/app/_schemas/account";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getLoggedUser } from "@/app/_db/session";
import { createAccount, updateAccount } from "@/app/_db/accounts";

export async function mutateAccount(initialState: any, formData: FormData) {
  const user = await getLoggedUser();

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
    const id = formData.get("id");

    if (id) {
      const { name, isMain } = result.data;
      await updateAccount(user.id, id as string, { name, isMain });
    } else {
      await createAccount(user.id, result.data);
    }

    revalidatePath("/accounts");
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
        name: null,
        balance: null,
        currencyId: null,
        isMain: null,
        message: "Failed to add account",
      },
    };
  }
}
