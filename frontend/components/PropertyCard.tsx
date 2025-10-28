"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import type { Property } from "../store/usePortfolio";

interface PropertyCardProps {
  property: Property;
  volatilityFactor?: number;
  volatilityActive?: boolean;
}

export default function PropertyCard({
  property,
  volatilityFactor = 1,
  volatilityActive = false,
}: PropertyCardProps) {
  const baseCashOnCash = property.downPayment
    ? (property.annualRent - property.annualExpenses) / property.downPayment
    : 0;
  const adjustedCashOnCash = baseCashOnCash * volatilityFactor;

  return (
    <Link
      href={`/property/${property.id}`}
      className="group relative block w-full max-w-sm transform no-underline transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#33ccff]/80 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 sm:w-[320px]"
    >
      <motion.article
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        whileHover={{ scale: 1.05, y: -6 }}
        className={`relative overflow-hidden rounded-2xl border border-white/20 bg-white/5 p-6 shadow-[0_35px_120px_-70px_rgba(51,204,255,0.85)] backdrop-blur-lg transition-all duration-300 group-hover:border-[#33ccff]/60 group-hover:shadow-[0_45px_140px_-60px_rgba(51,204,255,0.95)] ${
          volatilityActive ? "ring-1 ring-[#ff66cc]/60 bg-[#ff66cc0d]" : ""
        }`}
      >
        <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#33ccff29] via-transparent to-transparent blur-2xl" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#ff66cc22] via-transparent to-transparent blur-2xl" />
        </div>

        {volatilityActive && (
          <span className="absolute right-5 top-5 inline-flex items-center gap-2 rounded-full border border-[#ff66cc]/40 bg-[#ff66cc1a] px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-[#ffb0e3]">
            Δ volatility
          </span>
        )}

        <header className="relative flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-xl font-semibold tracking-[0.12em] text-white group-hover:text-[#33ccff]">
              {property.name}
            </h3>
            <p className="text-[0.65rem] uppercase tracking-[0.3em] text-slate-400">
              Asset Overview
            </p>
          </div>
          <span className="inline-flex items-center rounded-full border border-[#33ccff]/60 bg-[#33ccff1a] px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#9be8ff] shadow-inner">
            Cash-on-Cash {(adjustedCashOnCash * 100).toFixed(1)}%
          </span>
        </header>

        <dl className="relative mt-6 grid grid-cols-2 gap-5 text-sm text-slate-200 sm:grid-cols-4">
          <div className="space-y-1">
            <dt className="text-[0.6rem] uppercase tracking-[0.28em] text-slate-400">Purchase Price</dt>
            <dd className="text-base font-semibold tracking-wide text-slate-100">
              ${property.purchasePrice.toLocaleString()}
            </dd>
          </div>
          <div className="space-y-1">
            <dt className="text-[0.6rem] uppercase tracking-[0.28em] text-slate-400">Down Payment</dt>
            <dd className="text-base font-semibold tracking-wide text-slate-100">
              ${property.downPayment.toLocaleString()}
            </dd>
          </div>
          <div className="space-y-1">
            <dt className="text-[0.6rem] uppercase tracking-[0.28em] text-slate-400">Annual Rent</dt>
            <dd className="text-base font-semibold tracking-wide text-slate-100">
              ${property.annualRent.toLocaleString()}
            </dd>
          </div>
          <div className="space-y-1">
            <dt className="text-[0.6rem] uppercase tracking-[0.28em] text-slate-400">Expenses</dt>
            <dd className="text-base font-semibold tracking-wide text-slate-100">
              ${property.annualExpenses.toLocaleString()}
            </dd>
          </div>
        </dl>
      </motion.article>
    </Link>
  );
}
