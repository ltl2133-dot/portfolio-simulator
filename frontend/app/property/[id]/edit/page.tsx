"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter, useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { PropertyForm, PropertyFormValues } from "@/components/property/property-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Property } from "@/types/property";

async function fetchProperty(id: string): Promise<Property> {
  const res = await fetch(`/api/properties/${id}`);
  if (!res.ok) throw new Error("Failed to load property");
  return res.json();
}

async function updateProperty(id: string, values: PropertyFormValues) {
  const res = await fetch(`/api/properties/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
  if (!res.ok) throw new Error("Failed to update property");
  return res.json();
}

export default function EditPropertyPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const propertyId = params?.id ?? "";
  const [isSubmitting, setIsSubmitting] = useState(false);

  const propertyQuery = useQuery({
    queryKey: ["property", propertyId],
    queryFn: () => fetchProperty(propertyId),
    enabled: Boolean(propertyId),
  });

  const mutation = useMutation({
    mutationFn: (values: PropertyFormValues) => updateProperty(propertyId, values),
    onSuccess: (property) => {
      toast.success("Property updated", { description: `${property.name} metrics refreshed.` });
      router.push(`/property/${propertyId}`);
    },
    onError: () => toast.error("Update failed"),
  });

  const handleSubmit = async (values: PropertyFormValues) => {
    setIsSubmitting(true);
    try {
      await mutation.mutateAsync(values);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Edit Property</p>
          <h2 className="text-3xl font-semibold text-white md:text-4xl">Refresh underwriting inputs</h2>
          <p className="text-slate-300">Adjust asset assumptions to keep analytics synchronized.</p>
        </div>
        <Button variant="ghost" className="border border-white/10" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>

      <Card className="border-white/10 bg-slate-900/70">
        <CardHeader>
          <CardTitle>Update property metrics</CardTitle>
          <CardDescription>Revise purchase, rent, and expense assumptions to recast forecasts.</CardDescription>
        </CardHeader>
        <CardContent>
          {propertyQuery.isLoading ? (
            <div className="h-64 animate-pulse rounded-3xl bg-slate-800/50" />
          ) : propertyQuery.data ? (
            <PropertyForm
              mode="edit"
              defaultValues={propertyQuery.data}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          ) : (
            <p className="text-sm text-rose-400">Unable to load property data.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
