"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { cn } from "@/lib/utils";

interface MonteCarloPoint {
  year: number;
  value: number;
}

interface MonteCarloPath {
  path: MonteCarloPoint[];
}

export function MonteCarloChart({ distribution, className }: { distribution: MonteCarloPath[]; className?: string }) {
  const formatted = distribution.map((entry, idx) =>
    entry.path.map((point) => ({ year: point.year, value: point.value, series: `Path ${idx + 1}` })),
  );

  const flattened = formatted.flat();

  const grouped = Object.values(
    flattened.reduce<Record<string, { year: number; [key: string]: number }>>((acc, item) => {
      const key = String(item.year);
      acc[key] = acc[key] || { year: item.year };
      acc[key][item.series] = item.value;
      return acc;
    }, {}),
  );

  const lines = distribution.slice(0, 8).map((_, index) => `Path ${index + 1}`);

  return (
    <div className={cn("h-80 w-full", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={grouped}>
          <XAxis dataKey="year" stroke="#94a3b8" tickLine={false} axisLine={false} />
          <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} tickFormatter={(value) => `$${(value / 1_000_000).toFixed(1)}M`} />
          <Tooltip
            contentStyle={{
              background: "rgba(15, 23, 42, 0.9)",
              borderRadius: 24,
              border: "1px solid rgba(148, 163, 184, 0.2)",
              padding: "12px 16px",
              color: "#f8fafc",
            }}
            formatter={(value: number) => [`$${value.toLocaleString()}`, "Projected Value"]}
          />
          {lines.map((line, index) => (
            <Line
              key={line}
              type="monotone"
              dataKey={line}
              stroke={`hsl(${index * 36}, 85%, 55%)`}
              strokeWidth={1.8}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
