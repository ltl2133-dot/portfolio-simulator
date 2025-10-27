from __future__ import annotations

from typing import Dict, List

from pydantic import BaseModel, Field


class Property(BaseModel):
    name: str
    purchase_price: float = Field(gt=0)
    down_payment: float = Field(ge=0)
    mortgage_rate: float = Field(ge=0)
    mortgage_years: int = Field(gt=0)
    annual_rent: float = Field(ge=0)
    annual_expenses: float = Field(ge=0)


class PortfolioSimulationRequest(BaseModel):
    properties: List[Property]
    years: int = Field(gt=0, le=40)
    appreciation_rate: float = Field(default=0.03)
    rent_growth_rate: float = Field(default=0.02)


class PropertyMetricsSchema(BaseModel):
    value: float
    annual_cashflow: float
    total_cashflow: float
    total_investment: float
    equity: float
    yearly_cashflows: List[float]


class PropertyBreakdown(BaseModel):
    name: str
    metrics: PropertyMetricsSchema


class YearlyPortfolioSnapshot(BaseModel):
    year: int
    annual_cashflow: float
    cumulative_cashflow: float


class PortfolioResponse(BaseModel):
    properties: List[PropertyBreakdown]
    totals: Dict[str, float]
    yearly: List[YearlyPortfolioSnapshot]


class MonteCarloRequest(BaseModel):
    properties: List[Property]
    years: int = Field(gt=0, le=40)
    iterations: int = Field(gt=0, le=1000)
    appreciation_rate: float = Field(default=0.03)
    appreciation_volatility: float = Field(default=0.01, ge=0)
    rent_growth_rate: float = Field(default=0.02)
    rent_growth_volatility: float = Field(default=0.01, ge=0)


class MonteCarloRun(BaseModel):
    appreciation_rate: float
    rent_growth_rate: float
    totals: Dict[str, float]


class MonteCarloResponse(BaseModel):
    runs: List[MonteCarloRun]
    summary: Dict[str, Dict[str, float]]


class SamplePortfolioResponse(BaseModel):
    properties: List[Property]

    @staticmethod
    def example() -> "SamplePortfolioResponse":
        return SamplePortfolioResponse(
            properties=[
                Property(
                    name="Downtown Duplex",
                    purchase_price=350_000,
                    down_payment=70_000,
                    mortgage_rate=0.045,
                    mortgage_years=30,
                    annual_rent=36_000,
                    annual_expenses=9_000,
                ),
                Property(
                    name="Suburban Single Family",
                    purchase_price=280_000,
                    down_payment=56_000,
                    mortgage_rate=0.042,
                    mortgage_years=30,
                    annual_rent=28_800,
                    annual_expenses=7_200,
                ),
            ]
        )
