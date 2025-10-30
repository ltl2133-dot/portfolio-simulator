"""Simulation endpoints."""
from __future__ import annotations

from fastapi import APIRouter

from backend.models.simulation import (
    MonteCarloRequest,
    MonteCarloResponse,
    StressTestRequest,
    StressTestResponse,
)
from backend.services.simulation_service import simulation_service

router = APIRouter(prefix="/simulate", tags=["simulation"])


@router.post("/montecarlo", response_model=MonteCarloResponse)
def run_monte_carlo(payload: MonteCarloRequest) -> MonteCarloResponse:
    return simulation_service.run_monte_carlo(payload)


@router.post("/stress", response_model=StressTestResponse)
def run_stress_test(payload: StressTestRequest) -> StressTestResponse:
    return simulation_service.run_stress_test(payload)
