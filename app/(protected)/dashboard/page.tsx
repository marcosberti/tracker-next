import SectionCards from "./_components/section-cards";
import MonthlyChart from "./_components/monthly-chart";
import CategoriesChart from "./_components/categories-chart";
import NetBalanceChart from "./_components/net-balance-chart";
import { AppHeader } from "@/components/app-header";

export default async function Dashboard() {
  return (
    <>
      <AppHeader>Dashboard</AppHeader>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-4 md:py-6">
            <SectionCards />
            <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 lg:grid-cols-6">
              <MonthlyChart />
              <CategoriesChart />
              <NetBalanceChart />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
