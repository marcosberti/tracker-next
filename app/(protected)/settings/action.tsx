"use server";
import { currencySchema } from "@/app/_schemas/currency";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { User } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { categorySchema } from "@/app/_schemas/category";

export async function revalidateSettings() {
  revalidatePath("/settings");
}

export async function mutateCurrency(prevState: any, formData: FormData) {
  const session = await auth();

  if (!session?.user) {
    return redirect("/login");
  }

  const user = session.user as User;

  const data = {
    name: formData.get("name"),
    code: formData.get("code"),
  };

  const result = currencySchema.safeParse(data);

  if (!result.success) {
    return {
      name: data.name,
      code: data.code,
      error: { ...result.error.flatten().fieldErrors, message: null },
    };
  }

  try {
    const id = formData.get("id");
    const currency = await prisma.currency.upsert({
      where: {
        id: id as string,
        userId: user.id,
      },
      create: {
        userId: user.id,
        name: result.data.name,
        code: result.data.code,
      },
      update: {
        name: result.data.name,
      },
    });

    revalidatePath("/settings");
    return {
      currency,
      success: true,
      error: null,
    };
  } catch (error) {
    return {
      name: data.name,
      code: data.code,
      error: {
        name: null,
        code: null,
        message: "Failed to add currency",
      },
    };
  }
}

export async function mutateCategory(prevState: any, formData: FormData) {
  const session = await auth();

  if (!session?.user) {
    return redirect("/login");
  }

  const user = session.user as User;

  const data = {
    name: formData.get("name"),
    icon: formData.get("icon"),
    color: formData.get("color"),
  };

  const result = categorySchema.safeParse(data);

  if (!result.success) {
    return {
      name: data.name,
      icon: data.icon,
      color: data.color,
      error: { ...result.error.flatten().fieldErrors, message: null },
    };
  }

  try {
    const id = formData.get("id");
    const category = await prisma.category.upsert({
      where: {
        id: id as string,
        userId: user.id,
      },
      create: {
        userId: user.id,
        name: result.data.name,
        icon: result.data.icon,
        color: result.data.color,
      },
      update: {
        name: result.data.name,
        icon: result.data.icon,
        color: result.data.color,
      },
    });

    revalidatePath("/settings");
    return {
      category,
      success: true,
      error: null,
    };
  } catch (error) {
    return {
      name: data.name,
      icon: data.icon,
      color: data.color,
      error: {
        name: null,
        icon: null,
        color: null,
        message: "Failed to add currency",
      },
    };
  }
}
