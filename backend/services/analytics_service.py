"""Portfolio analytics aggregation service."""
from __future__ import annotations

from datetime import datetime, timedelta
from typing import List

from backend.models.analytics import PortfolioAnalytics, RiskPoint, TrendPoint
from backend.services.property_service import property_service
from backend.utils.finance import aggregate, average


class AnalyticsService:
    def build_portfolio_metrics(self) -> PortfolioAnalytics:
        properties = property_service.list_properties()
        total_value = aggregate(p.market_value for p in properties)
        average_irr = average(p.metrics.irr for p in properties)
        average_cash_on_cash = average(p.metrics.cash_on_cash_return for p in properties)
        average_vacancy = average(p.vacancy_rate for p in properties)

        growth_trend: List[TrendPoint] = []
        risk_profile: List[RiskPoint] = []

        today = datetime.utcnow()
        base_value = total_value
        for i in range(6, -1, -1):
            month = today - timedelta(days=30 * i)
            label = month.strftime("%b %Y")
            seasonal_multiplier = 1 + ((i - 3) * 0.01)
            growth_trend.append(
                TrendPoint(label=label, value=round(base_value * (0.96 + seasonal_multiplier * 0.02), 2))
            )
            risk_profile.append(
                RiskPoint(label=label, risk=round(max(0.02, 0.08 + (3 - i) * 0.01), 3))
            )

        return PortfolioAnalytics(
            total_portfolio_value=total_value,
            average_irr=average_irr,
            cash_on_cash_return=average_cash_on_cash,
            vacancy_rate=average_vacancy,
            growth_trend=growth_trend,
            risk_profile=risk_profile,
        )


analytics_service = AnalyticsService()
