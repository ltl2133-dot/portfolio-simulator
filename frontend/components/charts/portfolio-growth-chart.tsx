"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { cn } from "@/lib/utils";

interface GrowthPoint {
  label: string;
  value: number;
}

export function PortfolioGrowthChart({ data, className }: { data: GrowthPoint[]; className?: string }) {
  return (
    <div className={cn("h-72 w-full", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 24, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="growth" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#34d399" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#0f172a" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.15)" vertical={false} />
          <XAxis dataKey="label" stroke="#94a3b8" tickLine={false} axisLine={false} fontSize={12} dy={8} />
          <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} fontSize={12} tickFormatter={(value) => `$${(value / 1_000_000).toFixed(1)}M`} />
          <Tooltip
            contentStyle={{
              background: "rgba(15, 23, 42, 0.9)",
              borderRadius: 24,
              border: "1px solid rgba(148, 163, 184, 0.2)",
              padding: "12px 16px",
              color: "#f8fafc",
            }}
            formatter={(value: number) => [`$${value.toLocaleString()}`, "Value"]}
          />
          <Area type="monotone" dataKey="value" stroke="#34d399" fill="url(#growth)" strokeWidth={2.5} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
