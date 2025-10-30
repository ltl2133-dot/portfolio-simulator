export interface PropertyMetrics {
  noi: number;
  cap_rate: number;
  irr: number;
  cash_on_cash_return: number;
}

export interface CashflowPoint {
  year: number;
  gross_rent: number;
  expenses: number;
  net_cash_flow: number;
}

export interface Property {
  id: string;
  name: string;
  location: string;
  purchase_price: number;
  market_value: number;
  annual_rent: number;
  annual_expenses: number;
  vacancy_rate: number;
  appreciation_rate: number;
  rent_growth_rate: number;
  expense_growth_rate: number;
  hold_years: number;
  metrics: PropertyMetrics;
  cashflow_projection: CashflowPoint[];
}

export interface PropertyCollection {
  properties: Property[];
}

export interface TrendPoint {
  label: string;
  value: number;
}

export interface RiskPoint {
  label: string;
  risk: number;
}

export interface PortfolioAnalytics {
  total_portfolio_value: number;
  average_irr: number;
  cash_on_cash_return: number;
  vacancy_rate: number;
  growth_trend: TrendPoint[];
  risk_profile: RiskPoint[];
}

export interface MonteCarloPathPoint {
  year: number;
  value: number;
  net_cash_flow: number;
}

export interface MonteCarloPath {
  path: MonteCarloPathPoint[];
}

export interface MonteCarloResponse {
  property_id?: string;
  summary: {
    expected_irr: number;
    paths_returned: number;
    iterations_per_property: number;
  };
  distribution: MonteCarloPath[];
}

export interface StressTestResponse {
  property_id?: string;
  stress: {
    avg_stressed_noi: number;
    avg_vacancy: number;
    avg_expense_load: number;
    avg_noi_delta: number;
  };
}
