from __future__ import annotations

import random
from typing import List

from ..models import MortgageScheduleEntry, PropertyMetrics
from ..schemas import (
    MonteCarloRequest,
    MonteCarloResponse,
    MonteCarloRun,
    PortfolioResponse,
    PortfolioSimulationRequest,
    PropertyBreakdown,
    YearlyPortfolioSnapshot,
)


def mortgage_payment(principal: float, annual_rate: float, years: int) -> float:
    if annual_rate == 0:
        return principal / (years * 12)
    monthly_rate = annual_rate / 12
    n_payments = years * 12
    payment = principal * (monthly_rate * (1 + monthly_rate) ** n_payments) / (
        (1 + monthly_rate) ** n_payments - 1
    )
    return payment


def amortization_schedule(
    principal: float, annual_rate: float, years: int
) -> List[MortgageScheduleEntry]:
    balance = principal
    payment = mortgage_payment(principal, annual_rate, years)
    monthly_rate = annual_rate / 12
    schedule: List[MortgageScheduleEntry] = []

    for month in range(1, years * 12 + 1):
        interest = balance * monthly_rate
        principal_paid = payment - interest
        balance = max(balance - principal_paid, 0)
        if balance < 1e-5:
            balance = 0
        schedule.append(
            MortgageScheduleEntry(
                month=month,
                payment=payment,
                principal=principal_paid,
                interest=interest,
                balance=balance,
            )
        )
        if balance == 0:
            break
    return schedule


def property_cashflow(
    purchase_price: float,
    down_payment: float,
    mortgage_rate: float,
    mortgage_years: int,
    annual_rent: float,
    annual_expenses: float,
    appreciation_rate: float,
    rent_growth: float,
    years: int,
) -> PropertyMetrics:
    principal = purchase_price - down_payment
    schedule = amortization_schedule(principal, mortgage_rate, mortgage_years)
    annual_payment = mortgage_payment(principal, mortgage_rate, mortgage_years) * 12

    value = purchase_price
    rent = annual_rent
    expenses = annual_expenses

    yearly_cashflows: list[float] = []
    equity: list[float] = []
    balance_lookup = {entry.month: entry.balance for entry in schedule}

    for year in range(1, years + 1):
        value *= 1 + appreciation_rate
        rent *= 1 + rent_growth
        expenses *= 1 + (rent_growth / 2)

        total_income = rent
        total_expenses = expenses + min(annual_payment, rent)
        cashflow = total_income - total_expenses
        yearly_cashflows.append(cashflow)

        month_index = min(year * 12, schedule[-1].month)
        remaining_balance = balance_lookup.get(month_index, 0)
        equity.append(max(value - remaining_balance, 0))

    total_cashflow = sum(yearly_cashflows)
    total_investment = down_payment + annual_expenses
    return PropertyMetrics(
        value=value,
        annual_cashflow=yearly_cashflows[-1] if yearly_cashflows else 0,
        total_cashflow=total_cashflow,
        total_investment=total_investment,
        equity=equity[-1] if equity else down_payment,
        yearly_cashflows=yearly_cashflows,
    )


def simulate_portfolio(request: PortfolioSimulationRequest) -> PortfolioResponse:
    property_results: list[PropertyBreakdown] = []
    total_cashflow = 0.0
    total_equity = 0.0
    total_investment = 0.0

    for prop in request.properties:
        metrics = property_cashflow(
            purchase_price=prop.purchase_price,
            down_payment=prop.down_payment,
            mortgage_rate=prop.mortgage_rate,
            mortgage_years=prop.mortgage_years,
            annual_rent=prop.annual_rent,
            annual_expenses=prop.annual_expenses,
            appreciation_rate=request.appreciation_rate,
            rent_growth=request.rent_growth_rate,
            years=request.years,
        )

        property_results.append(
            PropertyBreakdown(
                name=prop.name,
                metrics=metrics,
            )
        )
        total_cashflow += metrics.total_cashflow
        total_equity += metrics.equity
        total_investment += metrics.total_investment

    yearly_snapshots: list[YearlyPortfolioSnapshot] = []
    for year in range(request.years):
        yearly_cashflow = sum(
            prop.metrics.yearly_cashflows[year] for prop in property_results
        )
        cumulative_cashflow = sum(
            sum(prop.metrics.yearly_cashflows[: year + 1])
            for prop in property_results
        )
        yearly_snapshots.append(
            YearlyPortfolioSnapshot(
                year=year + 1,
                annual_cashflow=yearly_cashflow,
                cumulative_cashflow=cumulative_cashflow,
            )
        )

    return PortfolioResponse(
        properties=property_results,
        totals={
            "cashflow": total_cashflow,
            "equity": total_equity,
            "investment": total_investment,
        },
        yearly=yearly_snapshots,
    )


def run_monte_carlo(request: MonteCarloRequest) -> MonteCarloResponse:
    runs: list[MonteCarloRun] = []
    results_cashflow: list[float] = []
    results_equity: list[float] = []

    for _ in range(request.iterations):
        appreciation = random.gauss(
            request.appreciation_rate, request.appreciation_volatility
        )
        rent_growth = random.gauss(
            request.rent_growth_rate, request.rent_growth_volatility
        )
        adjusted_request = PortfolioSimulationRequest(
            properties=request.properties,
            years=request.years,
            appreciation_rate=appreciation,
            rent_growth_rate=rent_growth,
        )
        portfolio = simulate_portfolio(adjusted_request)
        total_cashflow = portfolio.totals["cashflow"]
        total_equity = portfolio.totals["equity"]
        results_cashflow.append(total_cashflow)
        results_equity.append(total_equity)
        runs.append(
            MonteCarloRun(
                appreciation_rate=appreciation,
                rent_growth_rate=rent_growth,
                totals=portfolio.totals,
            )
        )

    def summarize(values: list[float]) -> dict[str, float]:
        if not values:
            return {"min": 0.0, "max": 0.0, "mean": 0.0}
        mean = sum(values) / len(values)
        return {"min": min(values), "max": max(values), "mean": mean}

    summary = {
        "cashflow": summarize(results_cashflow),
        "equity": summarize(results_equity),
    }

    return MonteCarloResponse(runs=runs, summary=summary)
