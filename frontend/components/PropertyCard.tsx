"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import type { Property } from "../store/usePortfolio";

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const cashOnCash = property.downPayment
    ? (property.annualRent - property.annualExpenses) / property.downPayment
    : 0;

  return (
    <Link href={`/property/${property.id}`} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900">
      <motion.article
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        whileHover={{ y: -6, boxShadow: "0 35px 120px -70px rgba(16,185,129,0.8)" }}
        className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_25px_80px_-60px_rgba(15,118,110,0.9)] backdrop-blur transition-colors hover:border-emerald-200/40"
      >
        <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-xl font-semibold tracking-[0.1em] text-white">
              {property.name}
            </h3>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Asset Overview</p>
          </div>
          <span className="inline-flex items-center rounded-full border border-emerald-300/40 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-200">
            Cash-on-Cash {(cashOnCash * 100).toFixed(1)}%
          </span>
        </header>

        <dl className="mt-6 grid grid-cols-2 gap-5 text-sm text-slate-200 sm:grid-cols-4">
          <div className="space-y-1">
            <dt className="text-[0.65rem] uppercase tracking-[0.24em] text-slate-400">Purchase Price</dt>
            <dd className="text-base font-semibold tracking-wide text-slate-100">
              ${property.purchasePrice.toLocaleString()}
            </dd>
          </div>
          <div className="space-y-1">
            <dt className="text-[0.65rem] uppercase tracking-[0.24em] text-slate-400">Down Payment</dt>
            <dd className="text-base font-semibold tracking-wide text-slate-100">
              ${property.downPayment.toLocaleString()}
            </dd>
          </div>
          <div className="space-y-1">
            <dt className="text-[0.65rem] uppercase tracking-[0.24em] text-slate-400">Annual Rent</dt>
            <dd className="text-base font-semibold tracking-wide text-slate-100">
              ${property.annualRent.toLocaleString()}
            </dd>
          </div>
          <div className="space-y-1">
            <dt className="text-[0.65rem] uppercase tracking-[0.24em] text-slate-400">Expenses</dt>
            <dd className="text-base font-semibold tracking-wide text-slate-100">
              ${property.annualExpenses.toLocaleString()}
            </dd>
          </div>
        </dl>
      </motion.article>
    </Link>
  );
}
