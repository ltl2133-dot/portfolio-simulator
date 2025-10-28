"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";

import PropertyCard from "../../components/PropertyCard";
import PortfolioSummary from "../../components/PortfolioSummary";
import NewPropertyModal from "../../components/NewPropertyModal";
import { usePortfolioStore } from "../../store/usePortfolio";

const fadeIn = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export default function PortfolioPage() {
  const { properties, fetchSamplePortfolio, clearProperties } = usePortfolioStore();

  useEffect(() => {
    if (properties.length === 0) {
      fetchSamplePortfolio();
    }
  }, [fetchSamplePortfolio, properties.length]);

  const hasProperties = properties.length > 0;

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.15),_transparent_45%),_radial-gradient(circle_at_bottom,_rgba(34,197,94,0.1),_transparent_40%)]" />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-12 px-6 pb-24 pt-20">
        <motion.header
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6, ease: "easeOut" }}
          variants={fadeIn}
          className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/5 px-8 py-6 shadow-xl backdrop-blur"
        >
          <div className="tracking-[0.08em]">
            <p className="text-xs uppercase text-slate-400">Command Center</p>
            <h1 className="mt-2 text-3xl font-semibold">Your Portfolio</h1>
            <p className="mt-1 text-sm text-slate-300">
              Track performance and recalibrate as the market evolves.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <motion.button
              type="button"
              onClick={clearProperties}
              disabled={!hasProperties}
              whileHover={hasProperties ? { y: -2, boxShadow: "0 15px 40px -20px rgba(248,250,252,0.65)" } : undefined}
              whileTap={hasProperties ? { scale: 0.97 } : undefined}
              className={`rounded-full border px-5 py-2 text-sm font-semibold tracking-[0.1em] backdrop-blur transition ${
                hasProperties
                  ? "border-white/20 bg-white/10 text-slate-200 hover:border-white/40"
                  : "cursor-not-allowed border-white/5 bg-white/5 text-slate-500"
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
          className="grid gap-8 lg:grid-cols-[2fr_1fr]"
        >
          <motion.div variants={fadeIn} className="grid gap-4">
            {properties.map((property) => (
              <PropertyCard key={property.name} property={property} />
            ))}
            {!hasProperties && (
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-10 text-sm text-slate-300 backdrop-blur"
              >
                No assets on file. Upload your vision with the “Add Property” control.
              </motion.p>
            )}
          </motion.div>

          <PortfolioSummary />
        </motion.section>
      </div>
    </main>
  );
}
