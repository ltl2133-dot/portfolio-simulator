"use client";

import Link from "next/link";
import { useEffect } from "react";
import { motion } from "framer-motion";

import PortfolioSummary from "../components/PortfolioSummary";
import PropertyCard from "../components/PropertyCard";
import NewPropertyModal from "../components/NewPropertyModal";
import { usePortfolioStore } from "../store/usePortfolio";

const fadeIn = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export default function HomePage() {
  const { fetchSamplePortfolio, properties } = usePortfolioStore();

  useEffect(() => {
    fetchSamplePortfolio();
  }, [fetchSamplePortfolio]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.12),_transparent_45%),_radial-gradient(circle_at_bottom,_rgba(16,185,129,0.1),_transparent_40%)]" />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-14 px-6 pb-20 pt-24">
        <motion.section
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.8, ease: "easeOut" }}
          variants={fadeIn}
          className="mx-auto max-w-3xl text-center tracking-[0.08em]"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase text-slate-300 backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Real Estate Intelligence
          </span>
          <h1 className="mt-6 text-4xl font-semibold sm:text-5xl">
            Design the portfolio of tomorrow.
          </h1>
          <p className="mt-4 text-sm text-slate-300">
            Model rental performance, stress-test your assumptions, and stay ahead of
            market volatility with interactive analytics.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/portfolio"
                className="inline-flex rounded-full border border-emerald-300/40 bg-emerald-400/20 px-6 py-3 text-sm font-semibold text-emerald-200 shadow-[0_10px_30px_-15px_rgba(45,212,191,0.8)] backdrop-blur transition"
              >
                Enter Portfolio
              </Link>
            </motion.div>
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/analytics"
                className="inline-flex rounded-full border border-cyan-300/40 bg-cyan-400/20 px-6 py-3 text-sm font-semibold text-cyan-200 shadow-[0_10px_30px_-15px_rgba(34,211,238,0.9)] backdrop-blur transition"
              >
                Explore Monte Carlo
              </Link>
            </motion.div>
          </div>
        </motion.section>

        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ staggerChildren: 0.1 }}
          className="grid gap-8 lg:grid-cols-[2fr_1fr]"
        >
          <motion.div variants={fadeIn} className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="tracking-[0.08em]">
                <h2 className="text-xs uppercase text-slate-400">Holdings</h2>
                <p className="text-2xl font-semibold">Active Properties</p>
              </div>
              <NewPropertyModal />
            </div>
            <div className="grid gap-4">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
              {properties.length === 0 && (
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-white/10 bg-white/5 p-8 text-sm text-slate-300 shadow-xl backdrop-blur"
                >
                  Your canvas is clear. Add a property to begin sculpting your strategy.
                </motion.p>
              )}
            </div>
          </motion.div>

          <PortfolioSummary />
        </motion.section>
      </div>
    </main>
  );
}
