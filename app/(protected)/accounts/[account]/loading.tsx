import { AppHeaderSkeleton } from "@/components/app-header-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function AccountLoading() {
  return (
    <>
      <AppHeaderSkeleton>
        <div className="ml-auto flex gap-2">
          <Skeleton className="h-8 w-11 md:w-[142px]" />
          <Skeleton className="h-8 w-11 md:w-[142px]" />
        </div>
      </AppHeaderSkeleton>
      <div className="flex flex-col gap-4 p-4">
        <div className="flex items-center justify-end gap-2">
          <Skeleton className="h-9 w-full md:w-[200px]" />
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Skeleton className="h-[136px] w-full" />
          <Skeleton className="h-[136px] w-full" />
        </div>
        <Skeleton className="h-[300px] w-full" />
      </div>
    </>
  );
}
