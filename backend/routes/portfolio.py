"""Portfolio analytics endpoints."""
from __future__ import annotations

from fastapi import APIRouter

from backend.models.analytics import PortfolioAnalytics
from backend.services.analytics_service import analytics_service

router = APIRouter(prefix="/portfolio", tags=["portfolio"])


@router.get("/analytics", response_model=PortfolioAnalytics)
def portfolio_analytics() -> PortfolioAnalytics:
    return analytics_service.build_portfolio_metrics()
