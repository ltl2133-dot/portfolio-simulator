"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import PropertyCard from "../../components/PropertyCard";
import PortfolioSummary from "../../components/PortfolioSummary";
import NewPropertyModal from "../../components/NewPropertyModal";
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

  useEffect(() => {
    if (properties.length === 0) {
      fetchSamplePortfolio();
    }
  }, [fetchSamplePortfolio, properties.length]);

  const hasProperties = properties.length > 0;
  const volatilityActive = hasProperties && Object.keys(volatilityMap).length > 0;

  const handleSimulateVolatility = () => {
    if (!hasProperties) return;
    const nextMap: VolatilityMap = {};
    properties.forEach((property) => {
      nextMap[property.id] = randomVolatilityFactor();
    });
    setVolatilityMap(nextMap);
  };

  const handleResetVolatility = () => {
    setVolatilityMap({});
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-black text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(51,204,255,0.12),_transparent_46%),_radial-gradient(circle_at_bottom,_rgba(255,102,204,0.1),_transparent_45%)]" />
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center px-6 py-16">
        <motion.header
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6, ease: "easeOut" }}
          variants={fadeIn}
          className="flex w-full max-w-4xl flex-col items-center gap-6 rounded-3xl border border-white/15 bg-white/5 px-10 py-8 text-center shadow-[0_45px_140px_-80px_rgba(51,204,255,0.85)] backdrop-blur-xl"
        >
          <div className="tracking-[0.12em]">
            <p className="text-xs uppercase text-slate-400">Command Center</p>
            <h1 className="mt-2 text-4xl font-semibold">Your Portfolio</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">
              Calibrate performance assumptions, explore volatility, and evolve your holdings inside a balanced, minimal dashboard.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <motion.button
              type="button"
              onClick={clearProperties}
              disabled={!hasProperties}
              whileHover={hasProperties ? { y: -2, boxShadow: "0 20px 50px -30px rgba(255,255,255,0.7)" } : undefined}
              whileTap={hasProperties ? { scale: 0.97 } : undefined}
              className={`rounded-full border px-6 py-2 text-sm font-semibold uppercase tracking-[0.22em] backdrop-blur transition ${
                hasProperties
                  ? "border-white/30 bg-white/10 text-slate-100 hover:border-white/50"
                  : "cursor-not-allowed border-white/10 bg-white/5 text-slate-500"
              }`}
            >
              Clear
            </motion.button>
            <NewPropertyModal />
          </div>
        </motion.header>

        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ staggerChildren: 0.08 }}
          className="mt-16 flex w-full max-w-5xl flex-col items-center gap-12"
        >
          <motion.div
            variants={fadeIn}
            className={`w-full rounded-3xl border border-white/15 bg-white/5 p-10 shadow-[0_55px_160px_-90px_rgba(15,23,42,0.8)] backdrop-blur-xl transition ${
              volatilityActive ? "border-[#ff66cc]/40 bg-[#ff66cc14]" : ""
            }`}
          >
            <div className="flex flex-wrap justify-center gap-6">
              {properties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  volatilityFactor={volatilityMap[property.id] ?? 1}
                  volatilityActive={volatilityActive}
                />
              ))}
            </div>

            {!hasProperties && (
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 rounded-3xl border border-dashed border-white/15 bg-white/5 p-10 text-center text-sm text-slate-300"
              >
                No assets on file. Upload your vision with the “Add Property” control.
              </motion.p>
            )}

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <motion.button
                type="button"
                onClick={handleSimulateVolatility}
                disabled={!hasProperties}
                whileHover={hasProperties ? { scale: 1.04, boxShadow: "0 30px 90px -60px rgba(255,102,204,0.75)" } : undefined}
                whileTap={hasProperties ? { scale: 0.97 } : undefined}
                className={`rounded-full px-7 py-2 text-sm font-semibold uppercase tracking-[0.24em] transition ${
                  hasProperties
                    ? "border border-[#ff66cc]/60 bg-[#ff66cc1a] text-[#ffd6f0] shadow-[0_20px_60px_-40px_rgba(255,102,204,0.8)] backdrop-blur"
                    : "cursor-not-allowed border border-white/10 bg-white/5 text-slate-500"
                }`}
              >
                Simulate Volatility
              </motion.button>
              {volatilityActive && (
                <motion.button
                  type="button"
                  onClick={handleResetVolatility}
                  whileHover={{ scale: 1.03, boxShadow: "0 25px 80px -60px rgba(51,204,255,0.75)" }}
                  whileTap={{ scale: 0.97 }}
                  className="rounded-full border border-[#33ccff]/60 bg-[#33ccff1a] px-7 py-2 text-sm font-semibold uppercase tracking-[0.24em] text-[#c7f2ff] shadow-[0_20px_70px_-50px_rgba(51,204,255,0.8)] backdrop-blur"
                >
                  Reset
                </motion.button>
              )}
            </div>
          </motion.div>

          <motion.div variants={fadeIn} className="w-full max-w-3xl">
            <PortfolioSummary />
          </motion.div>
        </motion.section>
      </div>
    </main>
  );
}
