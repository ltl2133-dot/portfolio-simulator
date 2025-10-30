"""Financial calculation utilities for the portfolio simulator."""
from __future__ import annotations

from dataclasses import dataclass
from typing import Iterable, List, Sequence

import math
import random


@dataclass
class CashFlowSummary:
    """Represents a single year's cash flow summary."""

    year: int
    gross_rent: float
    expenses: float
    net_cash_flow: float


def calculate_noi(annual_rent: float, annual_expenses: float, vacancy_rate: float) -> float:
    """Calculate Net Operating Income (NOI)."""

    effective_rent = annual_rent * (1 - vacancy_rate)
    return round(effective_rent - annual_expenses, 2)


def calculate_cap_rate(noi: float, market_value: float) -> float:
    """Calculate the capitalization rate given NOI and market value."""

    if market_value <= 0:
        return 0.0
    return round(noi / market_value, 4)


def calculate_cash_on_cash(noi: float, initial_equity: float) -> float:
    """Estimate cash-on-cash return."""

    if initial_equity <= 0:
        return 0.0
    return round(noi / initial_equity, 4)


def calculate_irr(cash_flows: Sequence[float]) -> float:
    """Compute Internal Rate of Return from a series of cash flows."""

    if len(cash_flows) < 2:
        return 0.0

    guess = 0.1
    for _ in range(100):
        npv = 0.0
        derivative = 0.0
        for period, cash_flow in enumerate(cash_flows):
            discount = (1 + guess) ** period
            npv += cash_flow / discount
            if period > 0:
                derivative -= period * cash_flow / (1 + guess) ** (period + 1)
        if abs(derivative) < 1e-9:
            break
        new_guess = guess - npv / derivative
        if abs(new_guess - guess) < 1e-7:
            guess = new_guess
            break
        guess = new_guess

    if math.isnan(guess) or math.isinf(guess):
        return 0.0
    return round(guess, 4)


def build_cash_flow_projection(
    purchase_price: float,
    annual_rent: float,
    annual_expenses: float,
    vacancy_rate: float,
    appreciation_rate: float,
    rent_growth_rate: float,
    expense_growth_rate: float,
    hold_years: int = 10,
) -> List[CashFlowSummary]:
    """Generate a simple projection of annual cash flows."""

    flows: List[CashFlowSummary] = []
    current_rent = annual_rent
    current_expenses = annual_expenses

    for year in range(1, hold_years + 1):
        gross_rent = current_rent * (1 - vacancy_rate)
        net = gross_rent - current_expenses
        flows.append(
            CashFlowSummary(
                year=year,
                gross_rent=round(gross_rent, 2),
                expenses=round(current_expenses, 2),
                net_cash_flow=round(net, 2),
            )
        )
        current_rent *= 1 + rent_growth_rate
        current_expenses *= 1 + expense_growth_rate

    return flows


def assemble_cash_flow_series(
    purchase_price: float,
    annual_rent: float,
    annual_expenses: float,
    vacancy_rate: float,
    appreciation_rate: float,
    rent_growth_rate: float,
    expense_growth_rate: float,
    hold_years: int = 10,
) -> List[float]:
    """Create the cash flow array used for IRR calculations."""

    projections = build_cash_flow_projection(
        purchase_price,
        annual_rent,
        annual_expenses,
        vacancy_rate,
        appreciation_rate,
        rent_growth_rate,
        expense_growth_rate,
        hold_years,
    )

    flows: List[float] = [-purchase_price]
    for summary in projections:
        flows.append(summary.net_cash_flow)

    terminal_value = purchase_price * (1 + appreciation_rate) ** hold_years
    flows[-1] += terminal_value
    return flows


def simulate_monte_carlo_paths(
    purchase_price: float,
    annual_rent: float,
    annual_expenses: float,
    vacancy_rate: float,
    appreciation_rate: float,
    rent_growth_rate: float,
    expense_growth_rate: float,
    hold_years: int,
    iterations: int = 250,
) -> List[dict]:
    """Monte Carlo simulation of property value paths."""

    results: List[dict] = []
    for _ in range(iterations):
        simulated_value = purchase_price
        rent = annual_rent
        expenses = annual_expenses
        trajectory = []
        for year in range(1, hold_years + 1):
            rent_noise = random.gauss(mu=0, sigma=0.03)
            expense_noise = random.gauss(mu=0, sigma=0.025)
            vacancy_noise = random.gauss(mu=0, sigma=0.01)

            rent *= 1 + rent_growth_rate + rent_noise
            expenses *= 1 + expense_growth_rate + expense_noise
            simulated_value *= 1 + appreciation_rate + rent_noise - expense_noise

            effective_income = rent * max(0, 1 - (vacancy_rate + vacancy_noise))
            net_cash_flow = effective_income - expenses
            trajectory.append(
                {
                    "year": year,
                    "value": round(simulated_value, 2),
                    "net_cash_flow": round(net_cash_flow, 2),
                }
            )

        results.append({"path": trajectory})

    return results


def simulate_stress_scenarios(
    noi: float,
    vacancy_rate: float,
    annual_expenses: float,
    shock_vacancy: float,
    shock_expenses: float,
) -> dict:
    """Apply vacancy and expense shocks to gauge downside impact."""

    stressed_vacancy = min(0.95, vacancy_rate + shock_vacancy)
    stressed_expenses = annual_expenses * (1 + shock_expenses)
    stressed_noi = calculate_noi(
        annual_rent=noi + annual_expenses,
        annual_expenses=stressed_expenses,
        vacancy_rate=stressed_vacancy,
    )

    delta_noi = stressed_noi - noi
    return {
        "stressed_noi": round(stressed_noi, 2),
        "vacancy_rate": round(stressed_vacancy, 4),
        "expense_load": round(stressed_expenses, 2),
        "noi_delta": round(delta_noi, 2),
    }


def aggregate(values: Iterable[float]) -> float:
    return round(sum(values), 2)


def average(values: Iterable[float]) -> float:
    seq = list(values)
    if not seq:
        return 0.0
    return round(sum(seq) / len(seq), 4)
