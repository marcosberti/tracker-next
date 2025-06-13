import { auth } from "@/lib/auth";

export async function getLoggedUser() {
  const session = await auth();
  return session?.user;
}
