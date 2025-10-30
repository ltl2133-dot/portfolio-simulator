"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { UseFormRegister, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Property } from "@/types/property";

const propertySchema = z.object({
  name: z.string().min(3),
  location: z.string().min(3),
  purchase_price: z.coerce.number().positive(),
  market_value: z.coerce.number().positive(),
  annual_rent: z.coerce.number().nonnegative(),
  annual_expenses: z.coerce.number().nonnegative(),
  vacancy_rate: z.coerce.number().min(0).max(1),
  appreciation_rate: z.coerce.number().min(-0.5).max(0.5),
  rent_growth_rate: z.coerce.number().min(-0.5).max(0.5),
  expense_growth_rate: z.coerce.number().min(-0.5).max(0.5),
  hold_years: z.coerce.number().min(1).max(30),
});

export type PropertyFormValues = z.infer<typeof propertySchema>;

const DEFAULT_VALUES: PropertyFormValues = {
  name: "",
  location: "",
  purchase_price: 2_000_000,
  market_value: 2_100_000,
  annual_rent: 240_000,
  annual_expenses: 110_000,
  vacancy_rate: 0.06,
  appreciation_rate: 0.03,
  rent_growth_rate: 0.02,
  expense_growth_rate: 0.015,
  hold_years: 10,
};

interface PropertyFormProps {
  mode: "create" | "edit";
  defaultValues?: Property;
  onSubmit: (values: PropertyFormValues) => Promise<void>;
  isSubmitting?: boolean;
}

export function PropertyForm({ mode, defaultValues, onSubmit, isSubmitting }: PropertyFormProps) {
  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: defaultValues
      ? {
          name: defaultValues.name,
          location: defaultValues.location,
          purchase_price: defaultValues.purchase_price,
          market_value: defaultValues.market_value,
          annual_rent: defaultValues.annual_rent,
          annual_expenses: defaultValues.annual_expenses,
          vacancy_rate: defaultValues.vacancy_rate,
          appreciation_rate: defaultValues.appreciation_rate,
          rent_growth_rate: defaultValues.rent_growth_rate,
          expense_growth_rate: defaultValues.expense_growth_rate,
          hold_years: defaultValues.hold_years,
        }
      : DEFAULT_VALUES,
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit(values);
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Property Name</Label>
          <Input id="name" placeholder="Emerald Towers" {...form.register("name")} />
          {form.formState.errors.name && (
            <p className="text-xs text-rose-400">{form.formState.errors.name.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input id="location" placeholder="Austin, TX" {...form.register("location")} />
          {form.formState.errors.location && (
            <p className="text-xs text-rose-400">{form.formState.errors.location.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <FieldControl label="Purchase Price" id="purchase_price" register={form.register} error={form.formState.errors.purchase_price?.message} />
        <FieldControl label="Market Value" id="market_value" register={form.register} error={form.formState.errors.market_value?.message} />
        <FieldControl label="Hold Years" id="hold_years" register={form.register} error={form.formState.errors.hold_years?.message} />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <FieldControl label="Annual Rent" id="annual_rent" register={form.register} error={form.formState.errors.annual_rent?.message} />
        <FieldControl label="Annual Expenses" id="annual_expenses" register={form.register} error={form.formState.errors.annual_expenses?.message} />
        <FieldControl label="Vacancy Rate" id="vacancy_rate" register={form.register} error={form.formState.errors.vacancy_rate?.message} helper="Enter as decimal (e.g. 0.07)" />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <FieldControl label="Appreciation Rate" id="appreciation_rate" register={form.register} error={form.formState.errors.appreciation_rate?.message} />
        <FieldControl label="Rent Growth Rate" id="rent_growth_rate" register={form.register} error={form.formState.errors.rent_growth_rate?.message} />
        <FieldControl label="Expense Growth Rate" id="expense_growth_rate" register={form.register} error={form.formState.errors.expense_growth_rate?.message} />
      </div>

      <div className="flex justify-end">
        <Button type="submit" size="lg" disabled={isSubmitting} className="px-8">
          {mode === "create" ? "Add Property" : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}

interface FieldControlProps {
  label: string;
  id: keyof PropertyFormValues;
  register: UseFormRegister<PropertyFormValues>;
  error?: string;
  helper?: string;
}

function FieldControl({ label, id, register, error, helper }: FieldControlProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type="number" step="any" {...register(id)} />
      {helper && <p className="text-xs text-slate-500">{helper}</p>}
      {error && <p className="text-xs text-rose-400">{error}</p>}
    </div>
  );
}
