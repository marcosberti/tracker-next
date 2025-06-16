import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CurrenciesList } from "./_components/currencies-list";
import { CategoriesList } from "./_components/categories-list";
import { getCurrencies } from "@/app/_db/currencies";
import { getLoggedUser } from "@/app/_db/session";
import { redirect } from "next/navigation";
import { getCategories } from "@/app/_db/categories";
import { AppHeader } from "@/components/app-header";
import { AddCurrency } from "./_components/add-currency";
import { AddCategory } from "./_components/add-category";

async function getData() {
  const user = await getLoggedUser();
  if (!user?.id) {
    return redirect("/login");
  }

  const [currencies, categories] = await Promise.all([
    getCurrencies(user.id, {
      orderBy: {
        name: "asc",
      },
    }),
    getCategories(user.id, {
      orderBy: {
        name: "asc",
      },
    }),
  ]);

  return { currencies, categories };
}

export default async function SettingsPage() {
  const { currencies, categories } = await getData();

  return (
    <>
      <AppHeader>
        <h1>Settings</h1>
        <div className="ml-auto flex gap-2 items-center">
          <AddCurrency />
          <AddCategory />
        </div>
      </AppHeader>

      <div className="@container/main flex flex-1 flex-col gap-4 p-4 md:gap-4 md:p-6">
        <Tabs defaultValue="currencies" className="w-full">
          <TabsList>
            <TabsTrigger value="currencies">Currencies</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>
          <TabsContent value="currencies">
            <CurrenciesList currencies={currencies} />
          </TabsContent>
          <TabsContent value="categories">
            <CategoriesList categories={categories} />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
