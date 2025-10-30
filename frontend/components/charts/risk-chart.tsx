"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { cn } from "@/lib/utils";

interface RiskPoint {
  label: string;
  risk: number;
}

export function RiskChart({ data, className }: { data: RiskPoint[]; className?: string }) {
  return (
    <div className={cn("h-72 w-full", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 24, left: 0, bottom: 0 }}>
          <XAxis dataKey="label" stroke="#94a3b8" tickLine={false} axisLine={false} fontSize={12} dy={8} />
          <YAxis
            stroke="#94a3b8"
            tickLine={false}
            axisLine={false}
            fontSize={12}
            tickFormatter={(value) => `${(value * 100).toFixed(1)}%`}
          />
          <Tooltip
            contentStyle={{
              background: "rgba(15, 23, 42, 0.9)",
              borderRadius: 24,
              border: "1px solid rgba(148, 163, 184, 0.2)",
              padding: "12px 16px",
              color: "#f8fafc",
            }}
            formatter={(value: number) => [`${(value * 100).toFixed(2)}%`, "Portfolio Risk"]}
          />
          <Line type="monotone" dataKey="risk" stroke="#38bdf8" strokeWidth={2.5} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
