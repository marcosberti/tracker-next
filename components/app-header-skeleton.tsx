import { Separator } from "./ui/separator";
import { Skeleton } from "./ui/skeleton";

export function AppHeaderSkeleton({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-14 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear ">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <Skeleton className="size-7" />
        <Skeleton className="size-7" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <Skeleton className="h-7 w-[10ch]" />
        {children}
      </div>
    </div>
  );
}
