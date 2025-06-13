import { cn } from "@/lib/utils";

export function Error({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("text-destructive text-xs", className)}>{children}</p>
  );
}
