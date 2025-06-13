"use client";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter } from "next/navigation";

export function MonthFilter({ month }: { month: string }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Input
      className="w-[200px]"
      type="month"
      value={month}
      onChange={(e) => {
        const newMonth = e.target.value;
        router.push(`${pathname}?month=${newMonth}`);
      }}
    />
  );
}
