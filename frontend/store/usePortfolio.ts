"use client";

import { create } from "zustand";

import {
  fetchSamplePortfolio as fetchSamplePortfolioApi,
  runMonteCarlo as runMonteCarloApi,
  simulatePortfolio as simulatePortfolioApi,
} from "../lib/api";

export interface Property {
  name: string;
  purchasePrice: number;
  downPayment: number;
  mortgageRate: number;
  mortgageYears: number;
  annualRent: number;
  annualExpenses: number;
}

interface PortfolioState {
  properties: Property[];
  totals: { cashflow: number; equity: number; investment: number };
  monteCarloSummary: Record<string, { min: number; mean: number; max: number }>;
  addProperty: (property: Property) => void;
  clearProperties: () => void;
  fetchSamplePortfolio: () => Promise<void>;
  fetchSimulation: () => Promise<void>;
  runMonteCarlo: () => Promise<void>;
}

const simulationDefaults = {
  years: 10,
  appreciation_rate: 0.03,
  rent_growth_rate: 0.02,
};

const monteCarloDefaults = {
  ...simulationDefaults,
  iterations: 200,
  appreciation_volatility: 0.01,
  rent_growth_volatility: 0.01,
};

export const usePortfolioStore = create<PortfolioState>((set, get) => ({
  properties: [],
  totals: { cashflow: 0, equity: 0, investment: 0 },
  monteCarloSummary: {},

  addProperty: (property) =>
    set((state) => ({ properties: [...state.properties, property] })),

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
