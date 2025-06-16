import { AppHeaderSkeleton } from "@/components/app-header-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsLoading() {
  return (
    <>
      <AppHeaderSkeleton>
        <div className="ml-auto flex gap-2">
          <Skeleton className="h-8 w-11 md:w-[142px]" />
          <Skeleton className="h-8 w-11 md:w-[142px]" />
        </div>
      </AppHeaderSkeleton>
      <div className="@container/main flex flex-1 flex-col gap-4 p-4 md:gap-4 md:p-6">
        <Skeleton className="h-9 w-[175px]" />
        <div className="grid gap-4 mb-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-[112px] w-full" />
          <Skeleton className="h-[112px] w-full" />
          <Skeleton className="h-[112px] w-full" />
          <Skeleton className="h-[112px] w-full" />
        </div>
      </div>
    </>
  );
}
