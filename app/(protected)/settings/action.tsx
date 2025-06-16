"use server";
import { parseFormData as parseCurrencyFormData } from "@/app/_schemas/currency";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { parseFormData as parseCategoryFormData } from "@/app/_schemas/category";
import { getLoggedUser } from "@/app/_db/session";
import { updateCurrency, createCurrency } from "@/app/_db/currencies";
import { createCategory, updateCategory } from "@/app/_db/categories";

export async function revalidateSettings() {
  revalidatePath("/settings");
}

export async function mutateCurrency(prevState: any, formData: FormData) {
  const user = await getLoggedUser();

  if (!user?.id) {
    return redirect("/login");
  }

  const { data, result } = parseCurrencyFormData(formData);

  if (!result.success) {
    return {
      ...data,
      success: false,
      error: { ...result.error.flatten().fieldErrors, message: null },
    };
  }

  try {
    const id = formData.get("id");
    if (id) {
      await updateCurrency(user.id, id as string, result.data);
    } else {
      await createCurrency(user.id, result.data);
    }

    revalidatePath("/settings");
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
        code: null,
        message: "Failed to add currency",
      },
    };
  }
}

export async function mutateCategory(prevState: any, formData: FormData) {
  const user = await getLoggedUser();

  if (!user?.id) {
    return redirect("/login");
  }

  const { data, result } = parseCategoryFormData(formData);

  if (!result.success) {
    return {
      ...data,
      success: false,
      error: { ...result.error.flatten().fieldErrors, message: null },
    };
  }

  try {
    const id = formData.get("id");
    if (id) {
      await updateCategory(user.id, id as string, result.data);
    } else {
      await createCategory(user.id, result.data);
    }

    revalidatePath("/settings");
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
        icon: null,
        color: null,
        message: "Failed to add currency",
      },
    };
  }
}
