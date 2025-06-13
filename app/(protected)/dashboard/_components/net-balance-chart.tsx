"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { formatCurrency } from "@/lib/formatters";

const monthlyData = [
  { month: "Jan", income: 1000, expenses: 500 },
  { month: "Feb", income: 1500, expenses: 700 },
  { month: "Mar", income: 1200, expenses: 600 },
  { month: "Apr", income: 1800, expenses: 900 },
  { month: "May", income: 2000, expenses: 1000 },
  { month: "Jun", income: 1900, expenses: 950 },
  { month: "Jul", income: 2100, expenses: 1100 },
  { month: "Aug", income: 2200, expenses: 1200 },
  { month: "Sep", income: 2300, expenses: 1300 },
  { month: "Oct", income: 2400, expenses: 1400 },
  { month: "Nov", income: 2500, expenses: 1500 },
  { month: "Dec", income: 2600, expenses: 1600 },
];

const currency = {
  code: "USD",
  symbol: "$",
};

export default function NetBalanceChart() {
  return (
    <Card className="lg:col-span-6">
      <CardHeader>
        <CardTitle>Balance Trend</CardTitle>
        <CardDescription>
          Net income/expense trend over the year
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            net: {
              label: "Net Amount",
              color: "var(--chart-1)",
            },
          }}
          className="aspect-auto h-[300px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={monthlyData.map((m) => ({
                ...m,
                net: m.income - m.expenses,
              }))}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => formatCurrency(value)} />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) =>
                      formatCurrency(Number(value), currency.code)
                    }
                  />
                }
              />
              <Line
                type="monotone"
                dataKey="net"
                stroke="var(--color-net)"
                strokeWidth={2}
                name="Net Amount"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
