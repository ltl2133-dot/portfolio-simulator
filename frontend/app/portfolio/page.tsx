"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

import NewPropertyModal from "../../components/NewPropertyModal";
import PortfolioSummary from "../../components/PortfolioSummary";
import PropertyCard from "../../components/PropertyCard";
import { usePortfolioStore } from "../../store/usePortfolio";

const fadeIn = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const randomVolatilityFactor = () => 1 + (Math.random() * 0.4 - 0.2);

type VolatilityMap = Record<string, number>;

export default function PortfolioPage() {
  const { properties, fetchSamplePortfolio, clearProperties } = usePortfolioStore();
  const [volatilityMap, setVolatilityMap] = useState<VolatilityMap>({});
  const [highlightedIds, setHighlightedIds] = useState<string[]>([]);
  const highlightTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (properties.length === 0) {
      fetchSamplePortfolio();
    }
  }, [fetchSamplePortfolio, properties.length]);

  useEffect(
    () => () => {
      if (highlightTimeoutRef.current) {
        clearTimeout(highlightTimeoutRef.current);
      }
    },
    []
  );

  const hasProperties = properties.length > 0;
  const volatilityActive = hasProperties && Object.keys(volatilityMap).length > 0;

  const scheduleHighlightReset = () => {
    if (highlightTimeoutRef.current) {
      clearTimeout(highlightTimeoutRef.current);
    }
    highlightTimeoutRef.current = setTimeout(() => {
      setHighlightedIds([]);
    }, 2000);
  };

  const handleSimulateVolatility = () => {
    if (!hasProperties) return;
    const nextMap: VolatilityMap = {};
    properties.forEach((property) => {
      nextMap[property.id] = randomVolatilityFactor();
    });
    setVolatilityMap(nextMap);
    setHighlightedIds(properties.map((property) => property.id));
    scheduleHighlightReset();
  };

  const handleResetVolatility = () => {
    setVolatilityMap({});
    setHighlightedIds([]);
    if (highlightTimeoutRef.current) {
      clearTimeout(highlightTimeoutRef.current);
    }
  };

  const handleClearPortfolio = () => {
    handleResetVolatility();
    clearProperties();
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-black text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.16),_transparent_52%),_radial-gradient(circle_at_bottom_left,_rgba(56,189,248,0.12),_transparent_48%),_radial-gradient(circle_at_bottom_right,_rgba(244,114,182,0.12),_transparent_52%)]" />
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-16 px-6 py-20 lg:py-24">
        <motion.section
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="grid gap-12 lg:grid-cols-[1.3fr_0.7fr] lg:items-center"
        >
          <div className="space-y-8 text-center tracking-[0.08em] lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[0.65rem] uppercase text-slate-300 backdrop-blur">
              <span className="h-2.5 w-2.5 rounded-full bg-sky-400 ring-4 ring-sky-400/20" />
              Active Command Center
            </div>
            <div className="space-y-5">
              <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">Your Portfolio</h1>
              <p className="mx-auto max-w-2xl text-sm leading-relaxed text-slate-300 lg:mx-0 lg:text-base">
                Orchestrate your properties within a glass-surfaced cockpit. Trigger volatility sweeps, rebalance instantly,
                and compare every scenario without breaking flow.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 lg:justify-start">
              <motion.button
                type="button"
                onClick={handleSimulateVolatility}
                disabled={!hasProperties}
                whileHover={hasProperties ? { y: -3, boxShadow: "0 28px 80px -60px rgba(244,114,182,0.7)" } : undefined}
                whileTap={hasProperties ? { scale: 0.97 } : undefined}
                className={`inline-flex items-center gap-2 rounded-full border px-7 py-3 text-sm font-semibold uppercase tracking-[0.24em] transition backdrop-blur ${
                  hasProperties
                    ? "border-pink-300/60 bg-gradient-to-r from-pink-400/25 to-rose-400/25 text-pink-100 shadow-[0_24px_75px_-55px_rgba(244,114,182,0.8)]"
                    : "cursor-not-allowed border-white/10 bg-white/5 text-slate-500"
                }`}
              >
                Simulate Volatility
              </motion.button>

              <NewPropertyModal />

              <motion.button
                type="button"
                onClick={handleClearPortfolio}
                disabled={!hasProperties}
                whileHover={hasProperties ? { y: -3, boxShadow: "0 28px 80px -60px rgba(56,189,248,0.7)" } : undefined}
                whileTap={hasProperties ? { scale: 0.97 } : undefined}
                className={`inline-flex items-center gap-2 rounded-full border px-7 py-3 text-sm font-semibold uppercase tracking-[0.24em] transition backdrop-blur ${
                  hasProperties
                    ? "border-sky-300/60 bg-gradient-to-r from-sky-400/25 to-cyan-400/25 text-sky-100 shadow-[0_24px_75px_-55px_rgba(56,189,248,0.8)]"
                    : "cursor-not-allowed border-white/10 bg-white/5 text-slate-500"
                }`}
              >
                Clear
              </motion.button>

              {volatilityActive && (
                <motion.button
                  type="button"
                  onClick={handleResetVolatility}
                  whileHover={{ y: -3, boxShadow: "0 24px 70px -55px rgba(148,163,184,0.65)" }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-7 py-3 text-sm font-semibold uppercase tracking-[0.24em] text-slate-200 shadow-[0_20px_60px_-50px_rgba(148,163,184,0.65)] backdrop-blur"
                >
                  Reset
                </motion.button>
              )}
            </div>
            <div className="grid gap-4 text-left text-[0.7rem] uppercase tracking-[0.28em] text-slate-400 sm:grid-cols-3">
              {["Real-time KPIs", "Scenario Blends", "Instant Rebalance"].map((label) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-center font-semibold text-slate-200/80 shadow-[0_25px_80px_-65px_rgba(148,163,184,0.9)] backdrop-blur">
                  {label}
                </div>
              ))}
            </div>
          </div>

          <div className="relative isolate hidden h-full rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-white/10 p-10 shadow-[0_65px_200px_-110px_rgba(59,130,246,0.85)] backdrop-blur-xl lg:flex lg:flex-col lg:justify-between">
            <div>
              <p className="text-[0.65rem] uppercase tracking-[0.3em] text-slate-400">Signals Live</p>
              <p className="mt-4 text-2xl font-semibold text-white">Volatility map</p>
              <p className="mt-2 text-sm text-slate-300">
                Highlighted holdings pulse with market drift, surfacing which assets need attention first.
              </p>
            </div>
            <div className="grid gap-3">
              {["Watch cap rate", "Lease renewal queue", "Income stress buffer"].map((item) => (
                <div key={item} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-slate-200">
                  <span>{item}</span>
                  <span className="text-xs text-emerald-200">Synced</span>
                </div>
              ))}
            </div>
            <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-sky-400/10 via-emerald-400/10 to-cyan-400/10 p-5 text-sm text-slate-200">
              "We rebalance weekly now. The cockpit lets our team respond in minutes instead of hours."
              <p className="mt-3 text-xs uppercase tracking-[0.26em] text-sky-200/80">COO, Harbour Group</p>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ staggerChildren: 0.08 }}
          className="w-full"
        >
          <motion.div
            variants={fadeIn}
            className={`rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-white/10 p-10 shadow-[0_55px_160px_-90px_rgba(15,23,42,0.85)] backdrop-blur-xl transition ${
              volatilityActive ? "border-pink-400/40 bg-pink-400/10" : ""
            }`}
          >
            <div className="mb-8 flex flex-col items-center text-center">
              <p className="text-[0.65rem] uppercase tracking-[0.28em] text-slate-400">Asset Lineup</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-[0.12em] text-white">Holdings Grid</h2>
            </div>
            <div className="grid justify-items-center gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {properties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  volatilityFactor={volatilityMap[property.id] ?? 1}
                  volatilityActive={volatilityActive}
                  highlighted={highlightedIds.includes(property.id)}
                />
              ))}
            </div>

            {!hasProperties && (
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 rounded-3xl border border-dashed border-white/15 bg-white/5 p-10 text-center text-sm text-slate-300"
              >
                No assets on file. Deploy capital with “Add Property” to populate the grid.
              </motion.p>
            )}
          </motion.div>

          <motion.div
            variants={fadeIn}
            className="mx-auto mt-16 flex max-w-3xl flex-col items-center text-center"
          >
            <div className="mb-6 h-px w-32 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            <p className="text-[0.65rem] uppercase tracking-[0.28em] text-slate-400">Portfolio Signal</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-[0.12em] text-white">Summary Metrics</h2>
            <p className="mt-4 max-w-2xl text-sm text-slate-300">
              Aggregate performance recalibrates automatically as holdings evolve. Monitor the rolling totals to
              understand portfolio momentum.
            </p>
            <div className="mt-10 w-full">
              <PortfolioSummary />
            </div>
          </motion.div>
        </motion.section>
      </div>
    </main>
  );
}
