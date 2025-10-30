"""Simulation request/response models."""
from __future__ import annotations

from typing import List, Optional

from pydantic import BaseModel, Field

from .property import MonteCarloPath


class MonteCarloRequest(BaseModel):
    property_id: Optional[str] = Field(None, description="Target property to simulate")
    iterations: int = Field(250, ge=50, le=1000)
    hold_years: Optional[int]


class MonteCarloResponse(BaseModel):
    property_id: Optional[str]
    summary: dict
    distribution: List[MonteCarloPath]


class StressTestRequest(BaseModel):
    property_id: Optional[str]
    vacancy_shock: float = Field(0.05, description="Additional vacancy impact")
    expense_shock: float = Field(0.1, description="Expense increase factor")


class StressTestResponse(BaseModel):
    property_id: Optional[str]
    stress: dict
