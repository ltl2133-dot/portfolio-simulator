"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { PropertyForm, PropertyFormValues } from "@/components/property/property-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewPropertyPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: PropertyFormValues) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Failed to create property");
      const property = await res.json();
      toast.success("Property created", { description: `${property.name} is now live.` });
      router.push(`/property/${property.id}`);
    } catch (error) {
      toast.error("Unable to create property");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">New Property</p>
          <h2 className="text-3xl font-semibold text-white md:text-4xl">Onboard a real asset</h2>
          <p className="text-slate-300">Capture underwriting assumptions to model performance instantly.</p>
        </div>
        <Button variant="ghost" className="border border-white/10" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>

      <Card className="border-white/10 bg-slate-900/70">
        <CardHeader>
          <CardTitle>Acquisition profile</CardTitle>
          <CardDescription>Input purchase metrics, rent roll expectations, and growth assumptions.</CardDescription>
        </CardHeader>
        <CardContent>
          <PropertyForm mode="create" onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </CardContent>
      </Card>
    </div>
  );
}
