"use client";

import { useEffect, useMemo } from "react";
import { motion } from "framer-motion";

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
        textClass: "text-amber-200",
        glowClass: "bg-gradient-to-br from-amber-400/40 to-amber-300/20",
      },
      {
        label: "Total Cashflow",
        value: totals.cashflow,
        textClass: "text-emerald-200",
        glowClass: "bg-gradient-to-br from-emerald-400/40 to-emerald-300/20",
      },
      {
        label: "Total Equity",
        value: totals.equity,
        textClass: "text-cyan-200",
        glowClass: "bg-gradient-to-br from-cyan-400/40 to-cyan-300/20",
      },
    ],
    [totals.cashflow, totals.equity, totals.investment]
  );

  return (
    <motion.aside
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-7 shadow-[0_30px_90px_-60px_rgba(14,165,233,0.75)] backdrop-blur"
    >
      <div className="tracking-[0.08em]">
        <p className="text-xs uppercase text-slate-400">Portfolio Pulse</p>
        <h2 className="text-2xl font-semibold text-white">Summary</h2>
      </div>
      <div className="grid gap-4">
        {cards.map((card) => (
          <motion.div
            key={card.label}
            whileHover={{ y: -2 }}
            className={`relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 text-sm shadow-inner`}
          >
            <div className={`absolute inset-0 opacity-70 blur-3xl transition ${card.glowClass} pointer-events-none`} />
            <div className="relative">
              <p className="text-[0.65rem] uppercase tracking-[0.2em] text-slate-400">
                {card.label}
              </p>
              <p className={`mt-3 text-3xl font-semibold tracking-wide ${card.textClass}`}>
                ${card.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.aside>
  );
}
