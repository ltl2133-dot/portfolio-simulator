"use client";

import { useEffect, useMemo } from "react";

import { usePortfolioStore } from "../store/usePortfolio";

export default function PortfolioSummary() {
  const { totals, fetchSimulation, properties } = usePortfolioStore();

  useEffect(() => {
    if (properties.length > 0) {
      fetchSimulation();
    }
  }, [fetchSimulation, properties]);

  const cards = useMemo(
    () => [
      {
        label: "Total Investment",
        value: totals.investment,
        accent: "text-amber-400",
      },
      { label: "Total Cashflow", value: totals.cashflow, accent: "text-emerald-400" },
      { label: "Total Equity", value: totals.equity, accent: "text-cyan-300" },
    ],
    [totals.cashflow, totals.equity, totals.investment]
  );

  return (
    <aside className="space-y-4 rounded-lg border border-slate-800 bg-slate-900/80 p-5 shadow">
      <h2 className="text-xl font-semibold">Summary</h2>
      <div className="grid gap-3">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded border border-slate-800 bg-slate-900/60 p-4 text-sm"
          >
            <p className="text-xs uppercase tracking-wide text-slate-500">
              {card.label}
            </p>
            <p className={`mt-2 text-2xl font-semibold ${card.accent}`}>
              ${card.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
          </div>
        ))}
      </div>
    </aside>
  );
}
