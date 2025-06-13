// import {
//   Card,
//   CardAction,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/gradient-card";
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";

export default function SectionCards() {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
      <Card
        headerDescription="Current Balance"
        headerTitle="$1,250.00"
        badge={
          <>
            <IconTrendingUp />
            +12.5%
          </>
        }
        footer={
          <>
            Trending up this month <IconTrendingUp className="size-4" />
          </>
        }
      />
      <Card
        headerDescription="Total Income"
        headerTitle="$1,250.00"
        badge={
          <>
            <IconTrendingUp />
            +12.5%
          </>
        }
        footer={
          <>
            Trending up this month <IconTrendingUp className="size-4" />
          </>
        }
      />
      <Card
        headerDescription="Total Expenses"
        headerTitle="$1,250.00"
        badge={
          <>
            <IconTrendingUp />
            +12.5%
          </>
        }
        footer={
          <>
            Trending up this month <IconTrendingUp className="size-4" />
          </>
        }
      />
    </div>
  );
}
