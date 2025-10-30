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
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.14),_transparent_50%),_radial-gradient(circle_at_bottom_right,_rgba(190,242,100,0.12),_transparent_45%),_radial-gradient(circle_at_bottom_left,_rgba(14,165,233,0.1),_transparent_50%)]" />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-20 px-6 pb-24 pt-28 lg:pt-32">
        <motion.section
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.8, ease: "easeOut" }}
          variants={fadeIn}
          className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center"
        >
          <div className="space-y-8 text-center tracking-[0.08em] lg:text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[0.65rem] uppercase text-slate-300 backdrop-blur">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 ring-4 ring-emerald-400/20" />
              Intelligent Wealthcraft
            </span>
            <div className="space-y-5">
              <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
                Design the portfolio of tomorrow.
                <span className="ml-2 inline-flex items-center rounded-full bg-gradient-to-r from-emerald-400/20 via-cyan-400/25 to-sky-400/20 px-4 py-1 text-sm font-medium uppercase tracking-[0.26em] text-emerald-200/90">
                  Real-time
                </span>
              </h1>
              <p className="max-w-2xl text-sm leading-relaxed text-slate-300 lg:text-base">
                Curate a resilient property mix, pressure-test market shocks, and capture the edge with cinematic analytics that respond as quickly as your thesis evolves.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 lg:justify-start">
              <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/portfolio"
                  className="inline-flex items-center gap-2 rounded-full border border-emerald-300/50 bg-gradient-to-r from-emerald-400/25 to-teal-400/30 px-7 py-3 text-sm font-semibold text-emerald-100 shadow-[0_20px_60px_-40px_rgba(45,212,191,0.8)] backdrop-blur transition"
                >
                  Enter Portfolio
                  <span aria-hidden>→</span>
                </Link>
              </motion.div>
              <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/analytics"
                  className="inline-flex items-center gap-2 rounded-full border border-cyan-300/50 bg-gradient-to-r from-cyan-400/25 to-sky-400/30 px-7 py-3 text-sm font-semibold text-cyan-100 shadow-[0_20px_60px_-40px_rgba(34,211,238,0.8)] backdrop-blur transition"
                >
                  Explore Monte Carlo
                  <span aria-hidden>→</span>
                </Link>
              </motion.div>
            </div>
            <div className="grid gap-4 text-left text-[0.7rem] uppercase tracking-[0.32em] text-slate-400 sm:grid-cols-3">
              {["Live Stress Tests", "Cohort Benchmarks", "Predictive Signals"].map((label) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-center font-semibold text-slate-200/80 shadow-[0_25px_80px_-65px_rgba(148,163,184,0.9)] backdrop-blur">
                  {label}
                </div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="relative isolate"
          >
            <div className="absolute -left-8 -top-10 h-40 w-40 rounded-full bg-emerald-400/20 blur-3xl" />
            <div className="absolute -right-10 bottom-0 h-52 w-52 rounded-full bg-sky-400/20 blur-3xl" />
            <div className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-white/10 p-8 shadow-[0_55px_160px_-90px_rgba(34,211,238,0.85)] backdrop-blur-xl">
              <div className="space-y-6">
                <div>
                  <p className="text-[0.65rem] uppercase tracking-[0.3em] text-slate-400">Signal Console</p>
                  <p className="mt-2 text-2xl font-semibold text-white">Tomorrow&apos;s pulse, visualised</p>
                </div>
                <div className="grid gap-4">
                  {["Automated rent rolls", "Scenario planning", "Comparative comps"].map((item) => (
                    <div
                      key={item}
                      className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-slate-200"
                    >
                      <span>{item}</span>
                      <span className="text-xs text-emerald-200">Live</span>
                    </div>
                  ))}
                </div>
                <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-emerald-400/10 via-cyan-400/10 to-sky-400/10 p-5 text-sm text-slate-200">
                  "Our underwriting runs on autopilot now. The simulator keeps our conviction sharp."
                  <p className="mt-3 text-xs uppercase tracking-[0.26em] text-emerald-200/80">Principal, Skyline Capital</p>
                </div>
              </div>
            </div>
          </motion.div>
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
                  className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-8 text-sm text-slate-300 shadow-xl backdrop-blur"
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
