import { AppHeaderSkeleton } from "@/components/app-header-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function AccountsLoading() {
  return (
    <>
      <AppHeaderSkeleton>
        <div className="ml-auto flex gap-2">
          <Skeleton className="h-8 w-11 md:w-[142px]" />
        </div>
      </AppHeaderSkeleton>
      <div className="@container/main flex-1 py-4 md:py-6">
        <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
          <Skeleton className="h-[137px] w-full" />
          <Skeleton className="h-[137px] w-full" />
          <Skeleton className="h-[137px] w-full" />
          <Skeleton className="h-[137px] w-full" />
        </div>
      </div>
    </>
  );
}
