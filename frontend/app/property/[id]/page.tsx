"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, BarChart4, Building, Factory, Flame, PlayCircle, Shield } from "lucide-react";
import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import { IncomeExpenseChart } from "@/components/charts/income-expense-chart";
import { MonteCarloChart } from "@/components/charts/monte-carlo-chart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MonteCarloResponse, Property, StressTestResponse } from "@/types/property";

async function fetchProperty(id: string): Promise<Property> {
  const res = await fetch(`/api/properties/${id}`);
  if (!res.ok) throw new Error("Failed to load property");
  return res.json();
}

async function runMonteCarlo(id: string) {
  const res = await fetch("/api/simulate/montecarlo", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ property_id: id, iterations: 200 }),
  });
  if (!res.ok) throw new Error("Monte Carlo failed");
  return res.json();
}

async function applyMarketShock(id: string) {
  const res = await fetch("/api/simulate/stress", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ property_id: id, vacancy_shock: 0.07, expense_shock: 0.12 }),
  });
  if (!res.ok) throw new Error("Stress simulation failed");
  return res.json();
}

export default function PropertyDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const propertyId = params?.id ?? "";

  const propertyQuery = useQuery({
    queryKey: ["property", propertyId],
    queryFn: () => fetchProperty(propertyId),
    enabled: Boolean(propertyId),
  });

  const monteCarloMutation = useMutation<MonteCarloResponse, Error>({
    mutationFn: () => runMonteCarlo(propertyId),
    onSuccess: () => toast.success("Monte Carlo simulation completed"),
    onError: () => toast.error("Monte Carlo simulation failed"),
  });

  const stressMutation = useMutation<StressTestResponse, Error>({
    mutationFn: () => applyMarketShock(propertyId),
    onSuccess: (response) =>
      toast.success("Market shock applied", {
        description: `Stressed NOI: $${response.stress.avg_stressed_noi.toLocaleString()} | Vacancy ${(response.stress.avg_vacancy * 100).toFixed(2)}%`,
      }),
    onError: () => toast.error("Market shock simulation failed"),
  });

  const metrics = useMemo(() => propertyQuery.data?.metrics, [propertyQuery.data]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="space-y-8"
    >
      {propertyQuery.isError && (
        <div className="rounded-3xl border border-rose-500/40 bg-rose-500/10 p-4 text-sm text-rose-200">
          Unable to load property details. Please return to the portfolio overview.
        </div>
      )}
      <div className="flex flex-col justify-between gap-6 rounded-3xl border border-white/5 bg-gradient-to-br from-slate-900 to-slate-950 p-8 md:flex-row md:items-center">
        <div className="space-y-3">
          <Button variant="ghost" className="border border-white/10" onClick={() => router.push("/portfolio")}> 
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Portfolio
          </Button>
          {propertyQuery.isLoading ? (
            <Skeleton className="h-12 w-64 rounded-3xl" />
          ) : (
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Property Detail</p>
              <h2 className="text-4xl font-semibold text-white md:text-5xl">{propertyQuery.data?.name}</h2>
              <p className="text-slate-300">{propertyQuery.data?.location}</p>
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-3">
          <Button size="lg" variant="accent" onClick={() => router.push(`/property/${propertyId}/edit`)}>
            <Building className="mr-2 h-4 w-4" /> Edit Property
          </Button>
          <Button size="lg" onClick={() => monteCarloMutation.mutate()} disabled={monteCarloMutation.isPending}>
            <PlayCircle className="mr-2 h-4 w-4" /> Run Monte Carlo Simulation
          </Button>
          <Button
            size="lg"
            variant="ghost"
            className="border border-white/10"
            onClick={() => stressMutation.mutate()}
            disabled={stressMutation.isPending}
          >
            <Flame className="mr-2 h-4 w-4" /> Apply Market Shock
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Performance Snapshot</CardTitle>
            <CardDescription>Core return metrics across the hold period</CardDescription>
          </CardHeader>
          <CardContent>
            {propertyQuery.isLoading ? (
              <Skeleton className="h-48 w-full" />
            ) : (
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="text-xs uppercase text-slate-500">Net Operating Income</p>
                  <p className="text-3xl font-semibold text-emerald-300">
                    {metrics ? `$${metrics.noi.toLocaleString()}` : "--"}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs uppercase text-slate-500">Capitalization Rate</p>
                  <p className="text-3xl font-semibold text-sky-300">
                    {metrics ? `${(metrics.cap_rate * 100).toFixed(2)}%` : "--"}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs uppercase text-slate-500">Internal Rate of Return</p>
                  <p className="text-3xl font-semibold text-white">
                    {metrics ? `${(metrics.irr * 100).toFixed(2)}%` : "--"}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs uppercase text-slate-500">Cash-on-Cash Return</p>
                  <p className="text-3xl font-semibold text-slate-200">
                    {metrics ? `${(metrics.cash_on_cash_return * 100).toFixed(2)}%` : "--"}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Operating Fundamentals</CardTitle>
            <CardDescription>Income, expenses, and occupancy drivers</CardDescription>
          </CardHeader>
          <CardContent>
            {propertyQuery.isLoading ? (
              <Skeleton className="h-48 w-full" />
            ) : (
              <div className="space-y-4 text-sm text-slate-300">
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4">
                  <span className="flex items-center gap-2">
                    <Factory className="h-4 w-4" /> Annual Rent (stabilized)
                  </span>
                  <span>${propertyQuery.data?.annual_rent.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4">
                  <span className="flex items-center gap-2">
                    <Shield className="h-4 w-4" /> Vacancy Rate
                  </span>
                  <span>{((propertyQuery.data?.vacancy_rate ?? 0) * 100).toFixed(2)}%</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4">
                  <span className="flex items-center gap-2">
                    <BarChart4 className="h-4 w-4" /> Expense Load
                  </span>
                  <span>${propertyQuery.data?.annual_expenses.toLocaleString()}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Income & Expense Projection</CardTitle>
          <CardDescription>Multi-year cash flow modeling with growth assumptions</CardDescription>
        </CardHeader>
        <CardContent>
          {propertyQuery.isLoading ? <Skeleton className="h-80 w-full" /> : <IncomeExpenseChart data={propertyQuery.data?.cashflow_projection ?? []} />}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Monte Carlo Simulation Paths</CardTitle>
          <CardDescription>Preview value dispersion across stochastic scenarios</CardDescription>
        </CardHeader>
        <CardContent>
          {monteCarloMutation.isPending ? (
            <Skeleton className="h-80 w-full" />
          ) : monteCarloMutation.data ? (
            <MonteCarloChart distribution={monteCarloMutation.data.distribution} />
          ) : (
            <div className="flex h-80 items-center justify-center rounded-3xl border border-dashed border-white/10 text-sm text-slate-400">
              Trigger a Monte Carlo simulation to visualize probabilistic outcomes.
            </div>
          )}
        </CardContent>
      </Card>
    </motion.section>
  );
}
