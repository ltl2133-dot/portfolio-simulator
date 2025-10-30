"""Property domain models."""
from __future__ import annotations

from typing import List, Optional

from pydantic import BaseModel, Field


class PropertyBase(BaseModel):
    name: str = Field(..., description="Property name")
    location: str = Field(..., description="City or metro area")
    purchase_price: float = Field(..., gt=0)
    market_value: float = Field(..., gt=0)
    annual_rent: float = Field(..., ge=0)
    annual_expenses: float = Field(..., ge=0)
    vacancy_rate: float = Field(..., ge=0, le=1)
    appreciation_rate: float = Field(0.03, description="Expected annual appreciation")
    rent_growth_rate: float = Field(0.02, description="Expected annual rent growth")
    expense_growth_rate: float = Field(0.015, description="Expected annual expense growth")
    hold_years: int = Field(10, ge=1, le=30)


class PropertyCreate(PropertyBase):
    pass


class PropertyUpdate(BaseModel):
    name: Optional[str]
    location: Optional[str]
    purchase_price: Optional[float]
    market_value: Optional[float]
    annual_rent: Optional[float]
    annual_expenses: Optional[float]
    vacancy_rate: Optional[float]
    appreciation_rate: Optional[float]
    rent_growth_rate: Optional[float]
    expense_growth_rate: Optional[float]
    hold_years: Optional[int]


class CashflowPoint(BaseModel):
    year: int
    gross_rent: float
    expenses: float
    net_cash_flow: float


class MonteCarloPoint(BaseModel):
    year: int
    value: float
    net_cash_flow: float


class MonteCarloPath(BaseModel):
    path: List[MonteCarloPoint]


class PropertyMetrics(BaseModel):
    noi: float
    cap_rate: float
    irr: float
    cash_on_cash_return: float


class PropertyResponse(PropertyBase):
    id: str
    metrics: PropertyMetrics
    cashflow_projection: List[CashflowPoint]


class PropertyCollection(BaseModel):
    properties: List[PropertyResponse]
