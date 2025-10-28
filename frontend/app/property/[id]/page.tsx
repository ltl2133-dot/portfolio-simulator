"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  usePortfolioStore,
  monteCarloDefaults,
  simulationDefaults,
} from "../../../store/usePortfolio";
import {
  runMonteCarlo as runMonteCarloApi,
  simulatePortfolio as simulatePortfolioApi,
} from "../../../lib/api";

interface PropertyMetricsResponse {
  value: number;
  annual_cashflow: number;
  total_cashflow: number;
  total_investment: number;
  equity: number;
  yearly_cashflows: number[];
}

interface MonteCarloSummary {
  [key: string]: { min: number; mean: number; max: number };
}

const formatCurrency = (value: number) =>
  `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

const calculateIrr = (cashflows: number[]) => {
  if (cashflows.length === 0) return 0;
  let rate = 0.1;
  for (let iteration = 0; iteration < 100; iteration += 1) {
    let npv = 0;
    let derivative = 0;
    for (let t = 0; t < cashflows.length; t += 1) {
      const cashflow = cashflows[t];
      const discount = (1 + rate) ** t;
      npv += cashflow / discount;
      if (t > 0) {
        derivative -= (t * cashflow) / ((1 + rate) ** (t + 1));
      }
    }
    if (Math.abs(derivative) < 1e-8) break;
    const nextRate = rate - npv / derivative;
    if (!Number.isFinite(nextRate)) break;
    if (Math.abs(nextRate - rate) < 1e-6) {
      rate = nextRate;
      break;
    }
    rate = nextRate;
  }
  return Math.max(rate, 0);
};

export default function PropertyDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const propertyId = Array.isArray(params?.id) ? params?.id[0] : params?.id;

  const { properties, fetchSamplePortfolio, getPropertyById } = usePortfolioStore();
  const property = getPropertyById(propertyId ?? "");

  const [metrics, setMetrics] = useState<PropertyMetricsResponse | null>(null);
  const [summary, setSummary] = useState<MonteCarloSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!property && properties.length === 0) {
      fetchSamplePortfolio();
    }
  }, [fetchSamplePortfolio, properties.length, property]);

  useEffect(() => {
    if (!property) return;

    const payloadProperty = {
      name: property.name,
      purchase_price: property.purchasePrice,
      down_payment: property.downPayment,
      mortgage_rate: property.mortgageRate,
      mortgage_years: property.mortgageYears,
      annual_rent: property.annualRent,
      annual_expenses: property.annualExpenses,
    };

    const simulationPayload = {
      ...simulationDefaults,
      properties: [payloadProperty],
    };

    const monteCarloPayload = {
      ...monteCarloDefaults,
      properties: [payloadProperty],
    };

    setLoading(true);
    setError(null);

    Promise.all([
      simulatePortfolioApi(simulationPayload),
      runMonteCarloApi(monteCarloPayload),
    ])
      .then(([simulationData, monteCarloData]) => {
        const firstProperty = simulationData.properties?.[0]?.metrics as
          | PropertyMetricsResponse
          | undefined;
        if (firstProperty) {
          setMetrics(firstProperty);
        }
        setSummary(monteCarloData.summary);
      })
      .catch(() => {
        setError("Unable to load property analytics.");
      })
      .finally(() => setLoading(false));
  }, [property]);

  const irr = useMemo(() => {
    if (!metrics || !property) return 0;
    const initialInvestment = property.downPayment + property.annualExpenses;
    const cashflows = [-initialInvestment, ...metrics.yearly_cashflows];
    return calculateIrr(cashflows) * 100;
  }, [metrics, property]);

  const noi = useMemo(() => {
    if (!property) return 0;
    return property.annualRent - property.annualExpenses;
  }, [property]);

  const yearlyCashflowData = useMemo(() => {
    if (!metrics) return [];
    let cumulative = 0;
    return metrics.yearly_cashflows.map((cashflow, index) => {
      cumulative += cashflow;
      return {
        year: index + 1,
        cashflow,
        cumulative,
      };
    });
  }, [metrics]);

  const monteCarloChartData = useMemo(() => {
    if (!summary) return [];
    return [
      {
        metric: "Cashflow",
        min: summary.cashflow?.min ?? 0,
        mean: summary.cashflow?.mean ?? 0,
        max: summary.cashflow?.max ?? 0,
      },
      {
        metric: "Equity",
        min: summary.equity?.min ?? 0,
        mean: summary.equity?.mean ?? 0,
        max: summary.equity?.max ?? 0,
      },
    ];
  }, [summary]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(79,70,229,0.16),_transparent_45%),_radial-gradient(circle_at_bottom,_rgba(16,185,129,0.14),_transparent_45%)]" />
      <motion.button
        type="button"
        onClick={() => router.push("/portfolio")}
        whileHover={{ scale: 1.04, backgroundColor: "rgba(255,255,255,0.12)" }}
        whileTap={{ scale: 0.95 }}
        className="fixed left-6 top-6 z-10 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-200 shadow-lg backdrop-blur"
      >
        ← Back
      </motion.button>
      <div className="relative mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-center gap-10 px-6 py-16">
        {!property && properties.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-3xl border border-white/10 bg-white/5 px-10 py-12 text-center text-sm text-slate-300 backdrop-blur"
          >
            Loading property details...
          </motion.p>
        )}

        {!property && properties.length > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-3xl border border-white/10 bg-white/5 px-10 py-12 text-center text-sm text-slate-300 backdrop-blur"
          >
            We couldn’t find that property. Return to the portfolio to select a live asset.
          </motion.p>
        )}

        {property && (
          <>
            <motion.header
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="w-full rounded-3xl border border-white/10 bg-white/5 px-10 py-8 text-center shadow-xl backdrop-blur"
            >
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                Asset Intelligence
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-[0.08em] text-white">
                {property.name}
              </h1>
              <p className="mt-2 text-sm text-slate-300">
                Deep dive into the cashflow cadence, intrinsic value, and probabilistic outlook for this property.
              </p>
            </motion.header>

            <motion.section
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
              className="grid w-full gap-6 md:grid-cols-3"
            >
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur">
                <p className="text-[0.65rem] uppercase tracking-[0.22em] text-slate-400">Net Operating Income</p>
                <p className="mt-2 text-3xl font-semibold text-emerald-200">{formatCurrency(noi)}</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur">
                <p className="text-[0.65rem] uppercase tracking-[0.22em] text-slate-400">Annual Cashflow</p>
                <p className="mt-2 text-3xl font-semibold text-cyan-200">
                  {metrics ? formatCurrency(metrics.annual_cashflow) : "—"}
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur">
                <p className="text-[0.65rem] uppercase tracking-[0.22em] text-slate-400">IRR</p>
                <p className="mt-2 text-3xl font-semibold text-indigo-200">
                  {metrics ? `${irr.toFixed(1)}%` : "—"}
                </p>
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
              className="grid w-full gap-6 lg:grid-cols-2"
            >
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_40px_120px_-60px_rgba(59,130,246,0.4)] backdrop-blur">
                <div className="mb-6 flex items-center justify-between">
                  <div className="tracking-[0.08em]">
                    <p className="text-xs uppercase text-slate-400">Cashflow Rhythm</p>
                    <h2 className="text-2xl font-semibold text-white">Yearly Performance</h2>
                  </div>
                  {loading && <span className="text-xs uppercase tracking-[0.16em] text-slate-400">Syncing…</span>}
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={yearlyCashflowData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="year" stroke="#94a3b8" tick={{ fill: "#cbd5f5", fontSize: 12 }} />
                    <YAxis
                      stroke="#94a3b8"
                      tickFormatter={(value) => `$${value.toLocaleString()}`}
                      tick={{ fill: "#cbd5f5", fontSize: 12 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(15,23,42,0.85)",
                        border: "1px solid rgba(148,163,184,0.2)",
                        borderRadius: "18px",
                        backdropFilter: "blur(12px)",
                      }}
                      formatter={(value: number) => `$${value.toLocaleString()}`}
                    />
                    <Line type="monotone" dataKey="cashflow" stroke="#22d3ee" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="cumulative" stroke="#a855f7" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_40px_120px_-60px_rgba(16,185,129,0.45)] backdrop-blur">
                <div className="mb-6 flex items-center justify-between">
                  <div className="tracking-[0.08em]">
                    <p className="text-xs uppercase text-slate-400">Probabilistic Envelope</p>
                    <h2 className="text-2xl font-semibold text-white">Monte Carlo Snapshot</h2>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monteCarloChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="metric" stroke="#94a3b8" tick={{ fill: "#cbd5f5", fontSize: 12 }} />
                    <YAxis
                      stroke="#94a3b8"
                      tickFormatter={(value) => `$${value.toLocaleString()}`}
                      tick={{ fill: "#cbd5f5", fontSize: 12 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(15,23,42,0.85)",
                        border: "1px solid rgba(148,163,184,0.2)",
                        borderRadius: "18px",
                        backdropFilter: "blur(12px)",
                      }}
                      formatter={(value: number) => `$${value.toLocaleString()}`}
                    />
                    <Bar dataKey="min" fill="#f97316" radius={14} />
                    <Bar dataKey="mean" fill="#22d3ee" radius={14} />
                    <Bar dataKey="max" fill="#22c55e" radius={14} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.section>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-3xl border border-rose-400/30 bg-rose-500/10 px-6 py-3 text-center text-sm text-rose-100 backdrop-blur"
              >
                {error}
              </motion.p>
            )}
          </>
        )}
      </div>
    </main>
  );
}
