export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

export interface SimulationRequest {
  years: number;
  appreciation_rate: number;
  rent_growth_rate: number;
  properties: Array<{
    name: string;
    purchase_price: number;
    down_payment: number;
    mortgage_rate: number;
    mortgage_years: number;
    annual_rent: number;
    annual_expenses: number;
  }>;
}

export async function fetchSamplePortfolio() {
  const response = await fetch(`${API_BASE}/properties`, { cache: "no-store" });
  if (!response.ok) throw new Error("Failed to load sample properties");
  return response.json();
}

export async function simulatePortfolio(payload: SimulationRequest) {
  const response = await fetch(`${API_BASE}/simulate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Simulation request failed");
  return response.json();
}

export async function runMonteCarlo(payload: SimulationRequest & { iterations: number; appreciation_volatility: number; rent_growth_volatility: number; }) {
  const response = await fetch(`${API_BASE}/monte-carlo`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Monte Carlo request failed");
  return response.json();
}
