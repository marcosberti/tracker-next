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
import { formatCurrency } from "@/lib/formatters";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

const currency = {
  code: "USD",
};

const monthlyData = [
  {
    month: "Jan",
    income: 1000,
    expenses: 500,
  },
  {
    month: "Feb",
    income: 1500,
    expenses: 700,
  },
  {
    month: "Mar",
    income: 1200,
    expenses: 600,
  },
  {
    month: "Apr",
    income: 1800,
    expenses: 900,
  },
  {
    month: "May",
    income: 2000,
    expenses: 1000,
  },
  {
    month: "Jun",
    income: 1900,
    expenses: 950,
  },
  {
    month: "Jul",
    income: 2100,
    expenses: 1100,
  },
  {
    month: "Aug",
    income: 2200,
    expenses: 1200,
  },
  {
    month: "Sep",
    income: 2300,
    expenses: 1300,
  },
  {
    month: "Oct",
    income: 2400,
    expenses: 1400,
  },
  {
    month: "Nov",
    income: 2500,
    expenses: 1500,
  },
  {
    month: "Dec",
    income: 2600,
    expenses: 1600,
  },
];

export default function MonthlyChart() {
  return (
    <Card className="@container/card col-span-1 lg:col-span-4">
      <CardHeader>
        <CardTitle>Monthly Income vs Expenses</CardTitle>
        <CardDescription>Year overview ({currency.code})</CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={{
            income: {
              label: "Income",
              color: "var(--chart-1)",
            },
            expenses: {
              label: "Expenses",
              color: "var(--chart-2)",
            },
          }}
          className="aspect-auto h-[300px] "
        >
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={(value) => formatCurrency(value)} />
            <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
            <Legend />
            <Bar dataKey="income" fill="var(--color-income)" name="Income" />
            <Bar
              dataKey="expenses"
              fill="var(--color-expenses)"
              name="Expenses"
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
