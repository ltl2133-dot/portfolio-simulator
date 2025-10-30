"use client";

import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { cn } from "@/lib/utils";

interface CashflowPoint {
  year: number;
  gross_rent: number;
  expenses: number;
  net_cash_flow: number;
}

export function IncomeExpenseChart({ data, className }: { data: CashflowPoint[]; className?: string }) {
  return (
    <div className={cn("h-80 w-full", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="year" stroke="#94a3b8" tickLine={false} axisLine={false} />
          <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
          <Tooltip
            contentStyle={{
              background: "rgba(15, 23, 42, 0.9)",
              borderRadius: 24,
              border: "1px solid rgba(148, 163, 184, 0.2)",
              padding: "12px 16px",
              color: "#f8fafc",
            }}
            formatter={(value: number, key: string) => [`$${value.toLocaleString()}`, key.replace(/_/g, " ")]}
          />
          <Legend wrapperStyle={{ color: "#cbd5f5" }} />
          <Bar dataKey="gross_rent" name="Income" fill="#34d399" radius={[16, 16, 16, 16]} />
          <Bar dataKey="expenses" name="Expenses" fill="#f97316" radius={[16, 16, 16, 16]} />
          <Bar dataKey="net_cash_flow" name="Net Cash Flow" fill="#38bdf8" radius={[16, 16, 16, 16]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
