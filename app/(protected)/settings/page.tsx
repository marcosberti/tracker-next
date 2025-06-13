import { SettingsHeader } from "./_components/header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { prisma } from "@/lib/prisma";
import { CurrenciesList } from "./_components/currencies-list";
import { CategoriesList } from "./_components/categories-list";

async function getData() {
  const [currencies, categories] = await Promise.all([
    prisma.currency.findMany({
      orderBy: {
        name: "asc",
      },
    }),
    prisma.category.findMany({
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
      <SettingsHeader />

      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 p-4 md:gap-4 md:p-6">
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
      </div>
    </>
  );
}
