"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { AlertTriangle, BarChart3, LineChart, Sparkles, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { toast } from "sonner";

import { PortfolioGrowthChart } from "@/components/charts/portfolio-growth-chart";
import { RiskChart } from "@/components/charts/risk-chart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { PortfolioAnalytics, PropertyCollection } from "@/types/property";

async function fetchAnalytics(): Promise<PortfolioAnalytics> {
  const res = await fetch("/api/portfolio/analytics");
  if (!res.ok) throw new Error("Failed to load analytics");
  return res.json();
}

async function fetchProperties(): Promise<PropertyCollection> {
  const res = await fetch("/api/properties");
  if (!res.ok) throw new Error("Failed to load properties");
  return res.json();
}

async function runStressTest() {
  const res = await fetch("/api/simulate/stress", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
  if (!res.ok) {
    throw new Error("Stress simulation failed");
  }
  return res.json();
}

export default function DashboardPage() {
  const router = useRouter();
  const analyticsQuery = useQuery({ queryKey: ["portfolio-analytics"], queryFn: fetchAnalytics });
  const propertiesQuery = useQuery({ queryKey: ["properties"], queryFn: fetchProperties });

  const stressMutation = useMutation({
    mutationFn: runStressTest,
    onSuccess: (response) => {
      const { stress } = response;
      toast.success("Stress test complete", {
        description: `Stressed NOI: $${stress.avg_stressed_noi.toLocaleString()} • Vacancy ${(stress.avg_vacancy * 100).toFixed(
          1,
        )}%`,
      });
    },
    onError: () => toast.error("Unable to execute stress simulation"),
  });

  const highlightMetrics = useMemo(() => {
    if (!analyticsQuery.data) return [];
    const metrics = analyticsQuery.data;
    return [
      {
        label: "Total Portfolio Value",
        value: `$${metrics.total_portfolio_value.toLocaleString()}`,
        icon: TrendingUp,
      },
      {
        label: "Average IRR",
        value: `${(metrics.average_irr * 100).toFixed(2)}%`,
        icon: LineChart,
      },
      {
        label: "Cash-on-Cash",
        value: `${(metrics.cash_on_cash_return * 100).toFixed(2)}%`,
        icon: BarChart3,
      },
      {
        label: "Vacancy Rate",
        value: `${(metrics.vacancy_rate * 100).toFixed(2)}%`,
        icon: AlertTriangle,
      },
    ];
  }, [analyticsQuery.data]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-10"
    >
      <div className="flex flex-col items-center justify-between gap-6 rounded-3xl border border-white/5 bg-gradient-to-br from-emerald-500/10 via-slate-900 to-slate-950 p-10 shadow-2xl shadow-emerald-500/10 md:flex-row">
        <div className="max-w-2xl space-y-4">
          <Badge className="bg-emerald-500/15 text-emerald-200">
            <Sparkles className="h-4 w-4" /> Intelligent Market Engine
          </Badge>
          <h2 className="text-4xl font-semibold text-white md:text-5xl">Design the real estate portfolio of tomorrow.</h2>
          <p className="text-lg text-slate-300">
            Monitor performance, visualize upside and downside scenarios, and orchestrate your acquisition cadence with
            confidence.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" onClick={() => stressMutation.mutate()} disabled={stressMutation.isPending}>
              Simulate Volatility
            </Button>
            <Button
              size="lg"
              variant="ghost"
              onClick={() => router.push("/portfolio")}
              className="border border-white/10"
            >
              Explore Portfolio
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {highlightMetrics.length === 0
            ? [1, 2, 3, 4].map((key) => <Skeleton key={key} className="h-24 w-40 rounded-3xl" />)
            : highlightMetrics.map((item) => (
                <div
                  key={item.label}
                  className="flex h-24 w-44 flex-col justify-between rounded-3xl border border-white/5 bg-white/5 p-4 text-left"
                >
                  <item.icon className="h-5 w-5 text-emerald-300" />
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-400">{item.label}</p>
                    <p className="text-lg font-semibold text-white">{item.value}</p>
                  </div>
                </div>
              ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Portfolio Growth Trajectory</CardTitle>
            <CardDescription>Projected asset value trend for the multi-market portfolio</CardDescription>
          </CardHeader>
          <CardContent>
            {analyticsQuery.isLoading ? (
              <Skeleton className="h-72 w-full" />
            ) : (
              <PortfolioGrowthChart data={analyticsQuery.data?.growth_trend ?? []} />
            )}
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Risk Pulse</CardTitle>
            <CardDescription>Rolling volatility and vacancy projections</CardDescription>
          </CardHeader>
          <CardContent>
            {analyticsQuery.isLoading ? <Skeleton className="h-72 w-full" /> : <RiskChart data={analyticsQuery.data?.risk_profile ?? []} />}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Property Signal Board</CardTitle>
          <CardDescription>Live KPI summary across each active holding</CardDescription>
        </CardHeader>
        <CardContent>
          {propertiesQuery.isLoading ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {[...Array(6)].map((_, index) => (
                <Skeleton key={index} className="h-40 rounded-3xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {propertiesQuery.data?.properties.map((property) => (
                <motion.div
                  key={property.id}
                  whileHover={{ y: -4, scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-lg"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">{property.location}</p>
                      <h3 className="text-xl font-semibold text-white">{property.name}</h3>
                    </div>
                    <Button
                      variant="ghost"
                      className="h-10 border border-white/10 px-4 text-sm"
                      onClick={() => router.push(`/property/${property.id}`)}
                    >
                      View
                    </Button>
                  </div>
                  <Separator className="my-4" />
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs uppercase text-slate-500">Market Value</p>
                      <p className="font-semibold text-white">${property.market_value.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase text-slate-500">NOI</p>
                      <p className="font-semibold text-emerald-300">${property.metrics.noi.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase text-slate-500">IRR</p>
                      <p className="font-semibold text-sky-300">{(property.metrics.irr * 100).toFixed(2)}%</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase text-slate-500">Cash-on-Cash</p>
                      <p className="font-semibold text-slate-200">{(property.metrics.cash_on_cash_return * 100).toFixed(2)}%</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.section>
  );
}
