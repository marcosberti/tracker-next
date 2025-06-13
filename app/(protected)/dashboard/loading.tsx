import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-4 md:py-6">
          <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
            <Skeleton className="h-[156px] w-full rounded-xl" />
            <Skeleton className="h-[156px] w-full rounded-xl" />
            <Skeleton className="h-[156px] w-full rounded-xl" />
          </div>
          <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 lg:grid-cols-6">
            <Skeleton className="@container/card col-span-1 lg:col-span-4 h-[440px] w-full rounded-xl" />
            <Skeleton className="@container/card col-span-1 lg:col-span-2 h-[440px] w-full rounded-xl" />
            <Skeleton className="@container/card col-span-1 lg:col-span-6 h-[440px] w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
