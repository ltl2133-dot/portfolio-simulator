"use client";

import { useEffect } from "react";

import PropertyCard from "../../components/PropertyCard";
import PortfolioSummary from "../../components/PortfolioSummary";
import NewPropertyModal from "../../components/NewPropertyModal";
import { usePortfolioStore } from "../../store/usePortfolio";

export default function PortfolioPage() {
  const { properties, fetchSamplePortfolio } = usePortfolioStore();

  useEffect(() => {
    if (properties.length === 0) {
      fetchSamplePortfolio();
    }
  }, [fetchSamplePortfolio, properties.length]);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-16">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Your Portfolio</h1>
            <p className="text-sm text-slate-400">
              Track performance metrics and update assumptions in real time.
            </p>
          </div>
          <NewPropertyModal />
        </header>

        <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="grid gap-4">
            {properties.map((property) => (
              <PropertyCard key={property.name} property={property} />
            ))}
            {properties.length === 0 && (
              <p className="rounded border border-dashed border-slate-700 p-6 text-sm text-slate-400">
                You have no properties yet. Add one to start projecting returns.
              </p>
            )}
          </div>

          <PortfolioSummary />
        </section>
      </div>
    </main>
  );
}
