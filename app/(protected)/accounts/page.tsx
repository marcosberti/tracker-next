import { AccountsHeader } from "./_components/header";
import { AccountsList } from "./_components/accounts-list";
import { getAccounts } from "@/app/_db/accounts";
import { Prisma } from "@prisma/client";

const defaultOptions = {
  orderBy: {
    createdAt: Prisma.SortOrder.desc,
  },
  select: {
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
  },
};
type Options = typeof defaultOptions extends infer T
  ? T extends {
      orderBy: infer OrderBy;
      select: infer Select;
    }
    ? {
        orderBy: OrderBy;
        select: Select;
      }
    : never
  : never;

export type AccountType = Awaited<ReturnType<typeof getAccounts<Options>>>[0];

async function getData() {
  const accounts = await getAccounts<Options>(defaultOptions);
  return { accounts };
}

export default async function AccountsPage() {
  const { accounts } = await getData();

  return (
    <>
      <AccountsHeader />
      <AccountsList accounts={accounts} />
    </>
  );
}
