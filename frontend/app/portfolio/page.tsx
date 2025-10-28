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
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-black text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(51,204,255,0.12),_transparent_46%),_radial-gradient(circle_at_bottom,_rgba(255,102,204,0.1),_transparent_45%)]" />
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center justify-center px-6 py-16">
        <motion.section
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex w-full flex-col items-center text-center"
        >
          <div className="rounded-3xl border border-white/10 bg-white/5 px-10 py-12 shadow-[0_55px_160px_-90px_rgba(51,204,255,0.85)] backdrop-blur-xl">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Command Center</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-[0.08em] text-white">Your Portfolio</h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-300">
              Orchestrate your holdings from a centered glass console. Explore neon-drenched analytics,
              simulate turbulence, and curate the real estate mix that matches your conviction.
            </p>
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <motion.button
              type="button"
              onClick={handleSimulateVolatility}
              disabled={!hasProperties}
              whileHover={hasProperties ? { scale: 1.05, boxShadow: "0 30px 90px -60px rgba(255,102,204,0.8)" } : undefined}
              whileTap={hasProperties ? { scale: 0.97 } : undefined}
              className={`rounded-full border px-7 py-2 text-sm font-semibold uppercase tracking-[0.24em] transition backdrop-blur ${
                hasProperties
                  ? "border-[#ff66cc]/60 bg-[#ff66cc1a] text-[#ffd6f0] shadow-[0_20px_60px_-40px_rgba(255,102,204,0.85)]"
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
              whileHover={hasProperties ? { scale: 1.05, boxShadow: "0 30px 90px -60px rgba(51,204,255,0.8)" } : undefined}
              whileTap={hasProperties ? { scale: 0.97 } : undefined}
              className={`rounded-full border px-7 py-2 text-sm font-semibold uppercase tracking-[0.24em] transition backdrop-blur ${
                hasProperties
                  ? "border-[#33ccff]/60 bg-[#33ccff1a] text-[#c7f2ff] shadow-[0_20px_70px_-50px_rgba(51,204,255,0.85)]"
                  : "cursor-not-allowed border-white/10 bg-white/5 text-slate-500"
              }`}
            >
              Clear
            </motion.button>

            {volatilityActive && (
              <motion.button
                type="button"
                onClick={handleResetVolatility}
                whileHover={{ scale: 1.04, boxShadow: "0 28px 80px -58px rgba(148,163,184,0.65)" }}
                whileTap={{ scale: 0.97 }}
                className="rounded-full border border-white/20 bg-white/10 px-7 py-2 text-sm font-semibold uppercase tracking-[0.24em] text-slate-200 shadow-[0_18px_60px_-46px_rgba(148,163,184,0.7)] backdrop-blur"
              >
                Reset
              </motion.button>
            )}
          </div>
        </motion.section>

        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ staggerChildren: 0.08 }}
          className="mt-16 w-full"
        >
          <motion.div
            variants={fadeIn}
            className={`rounded-3xl border border-white/10 bg-white/5 p-10 shadow-[0_55px_160px_-90px_rgba(15,23,42,0.85)] backdrop-blur-xl transition ${
              volatilityActive ? "border-[#ff66cc]/40 bg-[#ff66cc14]" : ""
            }`}
          >
            <div className="mb-8 text-center">
              <p className="text-[0.65rem] uppercase tracking-[0.28em] text-slate-400">Asset Lineup</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-[0.12em] text-white">Holdings Grid</h2>
            </div>
            <div className="grid gap-6 justify-items-center sm:grid-cols-2 xl:grid-cols-3">
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
