"""Simulation service orchestrates Monte Carlo and stress testing."""
from __future__ import annotations

from statistics import mean
from typing import List

from fastapi import HTTPException, status

from backend.models.property import MonteCarloPath
from backend.models.simulation import (
    MonteCarloRequest,
    MonteCarloResponse,
    StressTestRequest,
    StressTestResponse,
)
from backend.services.property_service import property_service
from backend.utils.finance import (
    assemble_cash_flow_series,
    calculate_irr,
    simulate_monte_carlo_paths,
    simulate_stress_scenarios,
)


class SimulationService:
    def run_monte_carlo(self, payload: MonteCarloRequest) -> MonteCarloResponse:
        if payload.property_id:
            property_obj = property_service.get_property(payload.property_id)
            targets = [property_obj]
        else:
            targets = property_service.list_properties()

        all_paths: List[MonteCarloPath] = []
        irr_values: List[float] = []

        for prop in targets:
            distribution = simulate_monte_carlo_paths(
                purchase_price=prop.purchase_price,
                annual_rent=prop.annual_rent,
                annual_expenses=prop.annual_expenses,
                vacancy_rate=prop.vacancy_rate,
                appreciation_rate=prop.appreciation_rate,
                rent_growth_rate=prop.rent_growth_rate,
                expense_growth_rate=prop.expense_growth_rate,
                hold_years=payload.hold_years or prop.hold_years,
                iterations=payload.iterations,
            )
            # take first 30 to return to reduce payload
            trimmed = distribution[:30]
            all_paths.extend(MonteCarloPath(**path) for path in trimmed)

            cashflows = assemble_cash_flow_series(
                purchase_price=prop.purchase_price,
                annual_rent=prop.annual_rent,
                annual_expenses=prop.annual_expenses,
                vacancy_rate=prop.vacancy_rate,
                appreciation_rate=prop.appreciation_rate,
                rent_growth_rate=prop.rent_growth_rate,
                expense_growth_rate=prop.expense_growth_rate,
                hold_years=payload.hold_years or prop.hold_years,
            )
            irr_values.append(calculate_irr(cashflows))

        summary = {
            "expected_irr": round(mean(irr_values), 4) if irr_values else 0,
            "paths_returned": len(all_paths),
            "iterations_per_property": payload.iterations,
        }

        return MonteCarloResponse(
            property_id=payload.property_id,
            summary=summary,
            distribution=all_paths,
        )

    def run_stress_test(self, payload: StressTestRequest) -> StressTestResponse:
        if payload.property_id:
            target = property_service.get_property(payload.property_id)
            properties = [target]
        else:
            properties = property_service.list_properties()

        stress_results = []
        for prop in properties:
            stress_results.append(
                simulate_stress_scenarios(
                    noi=prop.metrics.noi,
                    vacancy_rate=prop.vacancy_rate,
                    annual_expenses=prop.annual_expenses,
                    shock_vacancy=payload.vacancy_shock,
                    shock_expenses=payload.expense_shock,
                )
            )

        if not stress_results:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No properties found")

        aggregated = {
            "avg_stressed_noi": round(mean(item["stressed_noi"] for item in stress_results), 2),
            "avg_vacancy": round(mean(item["vacancy_rate"] for item in stress_results), 4),
            "avg_expense_load": round(mean(item["expense_load"] for item in stress_results), 2),
            "avg_noi_delta": round(mean(item["noi_delta"] for item in stress_results), 2),
        }

        return StressTestResponse(property_id=payload.property_id, stress=aggregated)


simulation_service = SimulationService()
