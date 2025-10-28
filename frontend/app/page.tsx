"use client";

import Link from "next/link";
import { useEffect } from "react";

import PortfolioSummary from "../components/PortfolioSummary";
import PropertyCard from "../components/PropertyCard";
import NewPropertyModal from "../components/NewPropertyModal";
import { usePortfolioStore } from "../store/usePortfolio";

export default function HomePage() {
  const { fetchSamplePortfolio, properties } = usePortfolioStore();

  useEffect(() => {
    fetchSamplePortfolio();
  }, [fetchSamplePortfolio]);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-16">
        <section className="space-y-4 text-center">
          <h1 className="text-4xl font-semibold">Portfolio Simulator</h1>
          <p className="text-slate-300">
            Model your rental investments, forecast cashflow, and explore the
            impact of market volatility.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/portfolio"
              className="rounded-md bg-emerald-500 px-4 py-2 font-medium text-white shadow"
            >
              View Portfolio
            </Link>
            <Link
              href="/analytics"
              className="rounded-md border border-emerald-400 px-4 py-2 font-medium text-emerald-300"
            >
              Monte Carlo Analytics
            </Link>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Holdings</h2>
              <NewPropertyModal />
            </div>
            <div className="grid gap-4">
              {properties.map((property) => (
                <PropertyCard key={property.name} property={property} />
              ))}
              {properties.length === 0 && (
                <p className="rounded border border-dashed border-slate-700 p-6 text-sm text-slate-400">
                  Add your first property to begin projecting performance.
                </p>
              )}
            </div>
          </div>

          <PortfolioSummary />
        </section>
      </div>
    </main>
  );
}
