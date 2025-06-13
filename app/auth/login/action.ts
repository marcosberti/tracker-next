"use server";
import { redirect } from "next/navigation";
import { signIn } from "@/lib/auth";
import { loginSchema } from "@/app/_schemas/login";

export async function login(prevState: any, formData: FormData) {
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const result = loginSchema.safeParse(data);

  if (!result.success) {
    return {
      email: data.email,
      password: data.password,
      error: result.error.flatten().fieldErrors,
    };
  }

  try {
    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });
    if (res?.error) {
      return {
        email: data.email,
        password: data.password,
        error: { password: ["Invalid credentials"] },
      };
    }
  } catch (error) {
    return {
      email: data.email,
      password: data.password,
      error: { password: ["Something went wrong. Please try again."] },
    };
  }

  redirect("/dashboard");
}
