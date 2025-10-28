"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
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

const fadeIn = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

export default function AnalyticsPage() {
  const router = useRouter();
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
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.16),_transparent_45%),_radial-gradient(circle_at_bottom_left,_rgba(16,185,129,0.14),_transparent_45%)]" />
      <motion.button
        type="button"
        onClick={() => router.push("/portfolio")}
        whileHover={{ scale: 1.03, backgroundColor: "rgba(255,255,255,0.12)" }}
        whileTap={{ scale: 0.95 }}
        className="fixed left-6 top-6 z-10 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-200 shadow-lg backdrop-blur"
      >
        ← Back
      </motion.button>
      <div className="relative mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center justify-center gap-10 px-6 py-16">
        <motion.header
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.7, ease: "easeOut" }}
          variants={fadeIn}
          className="space-y-3 text-center tracking-[0.08em]"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[0.65rem] uppercase text-slate-300 backdrop-blur">
            Probabilistic Insights
          </span>
          <h1 className="text-4xl font-semibold">Monte Carlo Analytics</h1>
          <p className="text-sm text-slate-300">
            Randomized simulations reveal the corridor of outcomes across cashflow and equity under shifting market forces.
          </p>
        </motion.header>

        <motion.div
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.25, duration: 0.6, ease: "easeOut" }}
          variants={fadeIn}
          className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_40px_120px_-60px_rgba(34,211,238,0.45)] backdrop-blur"
        >
          <div className="mb-6 flex items-center justify-between">
            <div className="tracking-[0.08em]">
              <p className="text-xs uppercase text-slate-400">Distribution View</p>
              <h2 className="text-2xl font-semibold">Outcome Spectrum</h2>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={360}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorMin" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="colorMean" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="colorMax" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="metric" stroke="#94a3b8" tick={{ fill: "#cbd5f5", fontSize: 12 }} />
              <YAxis
                stroke="#94a3b8"
                tickFormatter={(value) => `$${value.toLocaleString()}`}
                tick={{ fill: "#cbd5f5", fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(15,23,42,0.85)",
                  border: "1px solid rgba(148,163,184,0.2)",
                  borderRadius: "18px",
                  backdropFilter: "blur(12px)",
                }}
                formatter={(value: number) => `$${value.toLocaleString()}`}
              />
              <Area type="monotone" dataKey="min" stroke="#f97316" fill="url(#colorMin)" strokeWidth={2} />
              <Area type="monotone" dataKey="mean" stroke="#22d3ee" fill="url(#colorMean)" strokeWidth={2} />
              <Area type="monotone" dataKey="max" stroke="#22c55e" fill="url(#colorMax)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </main>
  );
}
