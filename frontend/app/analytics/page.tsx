"use client";

import { useEffect } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { usePortfolioStore } from "../../store/usePortfolio";

export default function AnalyticsPage() {
  const {
    monteCarloSummary,
    runMonteCarlo,
    properties,
    fetchSamplePortfolio,
  } = usePortfolioStore();

  useEffect(() => {
    if (properties.length === 0) {
      fetchSamplePortfolio();
    }
  }, [fetchSamplePortfolio, properties.length]);

  useEffect(() => {
    if (properties.length > 0) {
      runMonteCarlo();
    }
  }, [properties, runMonteCarlo]);

  const data = [
    {
      metric: "Cashflow",
      min: monteCarloSummary.cashflow?.min ?? 0,
      mean: monteCarloSummary.cashflow?.mean ?? 0,
      max: monteCarloSummary.cashflow?.max ?? 0,
    },
    {
      metric: "Equity",
      min: monteCarloSummary.equity?.min ?? 0,
      mean: monteCarloSummary.equity?.mean ?? 0,
      max: monteCarloSummary.equity?.max ?? 0,
    },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-16">
        <header>
          <h1 className="text-3xl font-semibold">Monte Carlo Analytics</h1>
          <p className="text-sm text-slate-400">
            Randomized simulations of appreciation and rent growth assumptions
            provide context for potential upside and downside.
          </p>
        </header>

        <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold">Outcome Distribution</h2>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="metric" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" tickFormatter={(value) => `$${value.toLocaleString()}`} />
              <Tooltip
                contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155" }}
                formatter={(value: number) => `$${value.toLocaleString()}`}
              />
              <Area type="monotone" dataKey="min" stroke="#f97316" fill="#f9731622" />
              <Area type="monotone" dataKey="mean" stroke="#22d3ee" fill="#22d3ee22" />
              <Area type="monotone" dataKey="max" stroke="#22c55e" fill="#22c55e22" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </main>
  );
}
