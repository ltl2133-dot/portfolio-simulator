"use client";

import { create } from "zustand";

import {
  fetchSamplePortfolio as fetchSamplePortfolioApi,
  runMonteCarlo as runMonteCarloApi,
  simulatePortfolio as simulatePortfolioApi,
} from "../lib/api";

export interface Property {
  id: string;
  name: string;
  purchasePrice: number;
  downPayment: number;
  mortgageRate: number;
  mortgageYears: number;
  annualRent: number;
  annualExpenses: number;
}

type NewPropertyInput = Omit<Property, "id">;

interface PortfolioState {
  properties: Property[];
  totals: { cashflow: number; equity: number; investment: number };
  monteCarloSummary: Record<string, { min: number; mean: number; max: number }>;
  addProperty: (property: NewPropertyInput) => void;
  clearProperties: () => void;
  fetchSamplePortfolio: () => Promise<void>;
  fetchSimulation: () => Promise<void>;
  getPropertyById: (id: string) => Property | undefined;
  runMonteCarlo: () => Promise<void>;
}

export const simulationDefaults = {
  years: 10,
  appreciation_rate: 0.03,
  rent_growth_rate: 0.02,
};

export const monteCarloDefaults = {
  ...simulationDefaults,
  iterations: 200,
  appreciation_volatility: 0.01,
  rent_growth_volatility: 0.01,
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

const createId = (name: string, stable = false) => {
  const base = slugify(name || "property");
  if (stable && base) return base;
  return `${base || "property"}-${Math.random().toString(36).slice(2, 7)}`;
};

export const usePortfolioStore = create<PortfolioState>((set, get) => ({
  properties: [],
  totals: { cashflow: 0, equity: 0, investment: 0 },
  monteCarloSummary: {},

  addProperty: (property) =>
    set((state) => ({
      properties: [
        ...state.properties,
        {
          ...property,
          id: createId(property.name || "property"),
        },
      ],
    })),

  clearProperties: () =>
    set({
      properties: [],
      totals: { cashflow: 0, equity: 0, investment: 0 },
      monteCarloSummary: {},
    }),

  fetchSamplePortfolio: async () => {
    const data = await fetchSamplePortfolioApi();
    set({
      properties: data.properties.map((item: any) => ({
        id: createId(item.name, true),
        name: item.name,
        purchasePrice: item.purchase_price,
        downPayment: item.down_payment,
        mortgageRate: item.mortgage_rate,
        mortgageYears: item.mortgage_years,
        annualRent: item.annual_rent,
        annualExpenses: item.annual_expenses,
      })),
    });
  },

  fetchSimulation: async () => {
    const { properties } = get();
    if (properties.length === 0) return;
    const payload = {
      ...simulationDefaults,
      properties: properties.map((property) => ({
        name: property.name,
        purchase_price: property.purchasePrice,
        down_payment: property.downPayment,
        mortgage_rate: property.mortgageRate,
        mortgage_years: property.mortgageYears,
        annual_rent: property.annualRent,
        annual_expenses: property.annualExpenses,
      })),
    };
    const data = await simulatePortfolioApi(payload);
    set({ totals: data.totals });
  },

  getPropertyById: (id) => get().properties.find((property) => property.id === id),

  runMonteCarlo: async () => {
    const { properties } = get();
    if (properties.length === 0) return;
    const payload = {
      ...monteCarloDefaults,
      properties: properties.map((property) => ({
        name: property.name,
        purchase_price: property.purchasePrice,
        down_payment: property.downPayment,
        mortgage_rate: property.mortgageRate,
        mortgage_years: property.mortgageYears,
        annual_rent: property.annualRent,
        annual_expenses: property.annualExpenses,
      })),
    };
    const data = await runMonteCarloApi(payload);
    set({ monteCarloSummary: data.summary });
  },
}));
