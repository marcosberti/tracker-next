import { AccountsList } from "./_components/accounts-list";
import { getAccounts } from "@/app/_db/accounts";
import { Prisma } from "@prisma/client";
import { getLoggedUser } from "@/app/_db/session";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/app-header";
import { AddAccount } from "./_components/add-account";

const ACCOUNT_SELECT = {
  id: true,
  name: true,
  balance: true,
  isMain: true,
  currency: {
    select: {
      id: true,
      name: true,
      code: true,
    },
  },
};

export type AccountType = Prisma.AccountGetPayload<{
  select: typeof ACCOUNT_SELECT;
}>;

async function getData() {
  const user = await getLoggedUser();

  if (!user?.id) {
    return redirect("/login");
  }

  const accounts = (await getAccounts(user.id, {
    select: ACCOUNT_SELECT,
    orderBy: {
      createdAt: "desc",
    },
  })) as unknown as AccountType[];

  return { accounts };
}

export default async function AccountsPage() {
  const { accounts } = await getData();

  return (
    <>
      <AppHeader>
        <h1>Accounts</h1>
        <div className="ml-auto">
          <AddAccount />
        </div>
      </AppHeader>
      <AccountsList accounts={accounts} />
    </>
  );
}
