from dataclasses import dataclass


@dataclass
class MortgageScheduleEntry:
    month: int
    payment: float
    principal: float
    interest: float
    balance: float


@dataclass
class PropertyMetrics:
    value: float
    annual_cashflow: float
    total_cashflow: float
    total_investment: float
    equity: float
    yearly_cashflows: list[float]
