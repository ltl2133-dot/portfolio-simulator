"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Building2, MapPin, Plus, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { PropertyCollection } from "@/types/property";

async function fetchProperties(): Promise<PropertyCollection> {
  const res = await fetch("/api/properties");
  if (!res.ok) throw new Error("Failed to load properties");
  return res.json();
}

export default function PortfolioPage() {
  const router = useRouter();
  const propertiesQuery = useQuery({ queryKey: ["properties"], queryFn: fetchProperties });

  const portfolioSummary = useMemo(() => {
    if (!propertiesQuery.data) return null;
    const totalValue = propertiesQuery.data.properties.reduce((sum, property) => sum + property.market_value, 0);
    const avgIrr =
      propertiesQuery.data.properties.reduce((sum, property) => sum + property.metrics.irr, 0) /
      propertiesQuery.data.properties.length;
    const avgNoi =
      propertiesQuery.data.properties.reduce((sum, property) => sum + property.metrics.noi, 0) /
      propertiesQuery.data.properties.length;
    return { totalValue, avgIrr, avgNoi };
  }, [propertiesQuery.data]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="space-y-8"
    >
      <div className="flex flex-col justify-between gap-6 rounded-3xl border border-white/5 bg-white/5 p-8 backdrop-blur-xl md:flex-row md:items-center">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Your Portfolio</p>
          <h2 className="text-3xl font-semibold text-white md:text-4xl">Operational holdings overview</h2>
          <p className="max-w-2xl text-base text-slate-300">
            Track in-place income, evaluate property-level KPIs, and surface assets ready for refinancing or disposition.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button size="lg" onClick={() => router.push("/property/new")}>
            <Plus className="mr-2 h-4 w-4" /> Add Property
          </Button>
          <Button variant="ghost" size="lg" className="border border-white/10" onClick={() => router.push("/")}>
            Return to Dashboard
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Total Market Value</CardTitle>
            <CardDescription>Gross asset value across the platform</CardDescription>
          </CardHeader>
          <CardContent className="text-3xl font-semibold text-white">
            {portfolioSummary ? `$${portfolioSummary.totalValue.toLocaleString()}` : <Skeleton className="h-8 w-32" />}
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Average IRR</CardTitle>
            <CardDescription>Blended unlevered internal rate of return</CardDescription>
          </CardHeader>
          <CardContent className="text-3xl font-semibold text-emerald-300">
            {portfolioSummary ? `${(portfolioSummary.avgIrr * 100).toFixed(2)}%` : <Skeleton className="h-8 w-24" />}
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Average NOI</CardTitle>
            <CardDescription>Stabilized net operating income per property</CardDescription>
          </CardHeader>
          <CardContent className="text-3xl font-semibold text-sky-300">
            {portfolioSummary ? `$${Math.round(portfolioSummary.avgNoi).toLocaleString()}` : <Skeleton className="h-8 w-28" />}
          </CardContent>
        </Card>
      </div>

      {propertiesQuery.isLoading ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {[...Array(6)].map((_, index) => (
            <Skeleton key={index} className="h-72 rounded-3xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {propertiesQuery.data?.properties.map((property) => (
            <motion.div
              key={property.id}
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              className="flex h-full flex-col justify-between rounded-3xl border border-white/10 bg-slate-900/70 p-6 backdrop-blur"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <MapPin className="h-4 w-4" /> {property.location}
                    </div>
                    <h3 className="mt-2 text-2xl font-semibold text-white">{property.name}</h3>
                  </div>
                  <Button
                    variant="ghost"
                    className="border border-white/10 px-4"
                    onClick={() => router.push(`/property/${property.id}`)}
                  >
                    Open
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs uppercase text-slate-500">Market Value</p>
                    <p className="text-lg font-semibold text-white">${property.market_value.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-slate-500">Purchase Price</p>
                    <p className="text-lg font-semibold text-slate-300">${property.purchase_price.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-slate-500">NOI</p>
                    <p className="text-lg font-semibold text-emerald-300">${property.metrics.noi.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-slate-500">IRR</p>
                    <p className="text-lg font-semibold text-sky-300">{(property.metrics.irr * 100).toFixed(2)}%</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between text-sm text-slate-300">
                  <span className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" /> Stabilized Cash Flow
                  </span>
                  <span>${property.cashflow_projection[0]?.net_cash_flow.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between text-sm text-slate-300">
                  <span className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-emerald-300" /> Cash-on-Cash
                  </span>
                  <span>{(property.metrics.cash_on_cash_return * 100).toFixed(2)}%</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.section>
  );
}
