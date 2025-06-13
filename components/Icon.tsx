import { ICONS_MAP } from "@/lib/icons";
import { cn } from "@/lib/utils";

export function Icon({
  name,
  className,
  ...props
}: {
  name: string;
  className?: string;
  [key: string]: any;
}) {
  const Icon = ICONS_MAP[name as keyof typeof ICONS_MAP];
  return <Icon className={cn("size-6", className)} {...props} />;
}
