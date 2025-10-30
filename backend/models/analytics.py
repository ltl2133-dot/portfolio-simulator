"""Analytics response models."""
from __future__ import annotations

from typing import List

from pydantic import BaseModel


class TrendPoint(BaseModel):
    label: str
    value: float


class RiskPoint(BaseModel):
    label: str
    risk: float


class PortfolioAnalytics(BaseModel):
    total_portfolio_value: float
    average_irr: float
    cash_on_cash_return: float
    vacancy_rate: float
    growth_trend: List[TrendPoint]
    risk_profile: List[RiskPoint]
