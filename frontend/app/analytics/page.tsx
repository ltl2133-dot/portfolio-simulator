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
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.18),_transparent_52%),_radial-gradient(circle_at_bottom_left,_rgba(59,130,246,0.14),_transparent_48%),_radial-gradient(circle_at_top_left,_rgba(190,242,100,0.12),_transparent_55%)]" />
      <motion.button
        type="button"
        onClick={() => router.push("/portfolio")}
        whileHover={{ y: -3, backgroundColor: "rgba(255,255,255,0.12)" }}
        whileTap={{ scale: 0.95 }}
        className="fixed left-6 top-6 z-10 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-200 shadow-lg backdrop-blur"
      >
        ← Back
      </motion.button>
      <div className="relative mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center gap-14 px-6 py-20">
        <motion.header
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.7, ease: "easeOut" }}
          variants={fadeIn}
          className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center"
        >
          <div className="space-y-6 text-center tracking-[0.08em] lg:text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[0.65rem] uppercase text-slate-300 backdrop-blur">
              Probabilistic Insights
            </span>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">Monte Carlo Analytics</h1>
              <p className="text-sm leading-relaxed text-slate-300 lg:text-base">
                Randomized simulations reveal the corridor of outcomes across cashflow and equity. Glide between min, mean, and
                max projections to anticipate the moves you need to make next.
              </p>
            </div>
            <div className="grid gap-4 text-left text-[0.7rem] uppercase tracking-[0.28em] text-slate-400 sm:grid-cols-3">
              {["Scenario Blends", "Confidence Bands", "Instant Refresh"].map((label) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-center font-semibold text-slate-200/80 shadow-[0_25px_80px_-65px_rgba(148,163,184,0.9)] backdrop-blur">
                  {label}
                </div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="relative isolate rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-white/10 p-8 text-left shadow-[0_55px_160px_-100px_rgba(56,189,248,0.9)] backdrop-blur-xl"
          >
            <div className="space-y-5">
              <div>
                <p className="text-[0.65rem] uppercase tracking-[0.32em] text-slate-400">Insight Console</p>
                <p className="mt-2 text-2xl font-semibold text-white">Expectations engine</p>
              </div>
              <div className="grid gap-3">
                {["Adaptive variance tracking", "Fat-tail discovery", "Pessimistic planning"].map((item) => (
                  <div key={item} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-slate-200">
                    <span>{item}</span>
                    <span className="text-xs text-emerald-200">Live</span>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-cyan-400/10 via-emerald-400/10 to-lime-400/10 p-5 text-sm text-slate-200">
                "The probabilistic ranges let us brief investors with calm clarity. We can show the path before it happens."
                <p className="mt-3 text-xs uppercase tracking-[0.26em] text-cyan-200/80">Head of Strategy, Nova Estates</p>
              </div>
            </div>
          </motion.div>
        </motion.header>

        <motion.div
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.25, duration: 0.6, ease: "easeOut" }}
          variants={fadeIn}
          className="space-y-10 rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-white/10 p-10 shadow-[0_45px_140px_-70px_rgba(34,211,238,0.65)] backdrop-blur"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="tracking-[0.08em]">
              <p className="text-xs uppercase text-slate-400">Distribution View</p>
              <h2 className="text-2xl font-semibold text-white">Outcome Spectrum</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {data.map((item) => (
                <div key={item.metric} className="rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-center">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{item.metric}</p>
                  <div className="mt-3 space-y-1">
                    <p className="text-sm text-orange-200">Min: ${item.min.toLocaleString()}</p>
                    <p className="text-sm text-cyan-100">Mean: ${item.mean.toLocaleString()}</p>
                    <p className="text-sm text-emerald-200">Max: ${item.max.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={380}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorMin" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="colorMean" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="colorMax" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.45} />
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
