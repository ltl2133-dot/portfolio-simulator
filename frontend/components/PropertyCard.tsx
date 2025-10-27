"use client";

import type { Property } from "../store/usePortfolio";

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const cashOnCash = property.downPayment
    ? (property.annualRent - property.annualExpenses) / property.downPayment
    : 0;

  return (
    <article className="rounded-lg border border-slate-800 bg-slate-900/80 p-5 shadow">
      <header className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{property.name}</h3>
        <span className="text-sm text-emerald-300">
          Cash-on-Cash: {(cashOnCash * 100).toFixed(1)}%
        </span>
      </header>

      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-300 sm:grid-cols-4">
        <div>
          <dt className="text-xs uppercase tracking-wide text-slate-500">
            Purchase Price
          </dt>
          <dd>${property.purchasePrice.toLocaleString()}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-slate-500">
            Down Payment
          </dt>
          <dd>${property.downPayment.toLocaleString()}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-slate-500">
            Annual Rent
          </dt>
          <dd>${property.annualRent.toLocaleString()}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-slate-500">
            Expenses
          </dt>
          <dd>${property.annualExpenses.toLocaleString()}</dd>
        </div>
      </dl>
    </article>
  );
}
