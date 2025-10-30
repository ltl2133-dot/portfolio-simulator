"""Services for managing properties in memory."""
from __future__ import annotations

from typing import Dict, List

from uuid import uuid4

from fastapi import HTTPException, status

from backend.models.property import (
    CashflowPoint,
    PropertyCreate,
    PropertyMetrics,
    PropertyResponse,
    PropertyUpdate,
)
from backend.utils.finance import (
    assemble_cash_flow_series,
    build_cash_flow_projection,
    calculate_cap_rate,
    calculate_cash_on_cash,
    calculate_irr,
    calculate_noi,
)


class PropertyService:
    """Simple in-memory data store for demo purposes."""

    def __init__(self) -> None:
        self._properties: Dict[str, PropertyResponse] = {}
        self._seed_properties()

    def _seed_properties(self) -> None:
        seeds: List[PropertyCreate] = [
            PropertyCreate(
                name="Aurora High-Rise",
                location="Seattle, WA",
                purchase_price=4_200_000,
                market_value=4_850_000,
                annual_rent=620_000,
                annual_expenses=260_000,
                vacancy_rate=0.06,
                appreciation_rate=0.035,
                rent_growth_rate=0.025,
                expense_growth_rate=0.018,
                hold_years=10,
            ),
            PropertyCreate(
                name="Harborfront Lofts",
                location="Miami, FL",
                purchase_price=3_150_000,
                market_value=3_520_000,
                annual_rent=480_000,
                annual_expenses=190_000,
                vacancy_rate=0.08,
                appreciation_rate=0.032,
                rent_growth_rate=0.024,
                expense_growth_rate=0.017,
                hold_years=10,
            ),
            PropertyCreate(
                name="Canyon Ridge Estates",
                location="Austin, TX",
                purchase_price=5_050_000,
                market_value=5_640_000,
                annual_rent=710_000,
                annual_expenses=315_000,
                vacancy_rate=0.05,
                appreciation_rate=0.038,
                rent_growth_rate=0.027,
                expense_growth_rate=0.016,
                hold_years=10,
            ),
            PropertyCreate(
                name="Summit View Offices",
                location="Denver, CO",
                purchase_price=2_780_000,
                market_value=3_150_000,
                annual_rent=360_000,
                annual_expenses=155_000,
                vacancy_rate=0.07,
                appreciation_rate=0.031,
                rent_growth_rate=0.022,
                expense_growth_rate=0.015,
                hold_years=10,
            ),
        ]

        for property_data in seeds:
            self.create_property(property_data)

    def _build_response(self, property_id: str, data: PropertyCreate) -> PropertyResponse:
        cashflow_projection = build_cash_flow_projection(
            purchase_price=data.purchase_price,
            annual_rent=data.annual_rent,
            annual_expenses=data.annual_expenses,
            vacancy_rate=data.vacancy_rate,
            appreciation_rate=data.appreciation_rate,
            rent_growth_rate=data.rent_growth_rate,
            expense_growth_rate=data.expense_growth_rate,
            hold_years=data.hold_years,
        )

        cashflow_points = [
            CashflowPoint(**summary.__dict__)
            for summary in cashflow_projection
        ]

        cash_flow_series = assemble_cash_flow_series(
            purchase_price=data.purchase_price,
            annual_rent=data.annual_rent,
            annual_expenses=data.annual_expenses,
            vacancy_rate=data.vacancy_rate,
            appreciation_rate=data.appreciation_rate,
            rent_growth_rate=data.rent_growth_rate,
            expense_growth_rate=data.expense_growth_rate,
            hold_years=data.hold_years,
        )

        noi = calculate_noi(
            annual_rent=data.annual_rent,
            annual_expenses=data.annual_expenses,
            vacancy_rate=data.vacancy_rate,
        )
        cap_rate = calculate_cap_rate(noi=noi, market_value=data.market_value)
        irr = calculate_irr(cash_flow_series)
        cash_on_cash = calculate_cash_on_cash(
            noi=noi,
            initial_equity=data.purchase_price,
        )

        metrics = PropertyMetrics(
            noi=noi,
            cap_rate=cap_rate,
            irr=irr,
            cash_on_cash_return=cash_on_cash,
        )

        return PropertyResponse(
            id=property_id,
            metrics=metrics,
            cashflow_projection=cashflow_points,
            **data.dict(),
        )

    def list_properties(self) -> List[PropertyResponse]:
        return list(self._properties.values())

    def get_property(self, property_id: str) -> PropertyResponse:
        property_obj = self._properties.get(property_id)
        if not property_obj:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Property not found")
        return property_obj

    def create_property(self, payload: PropertyCreate) -> PropertyResponse:
        property_id = str(uuid4())
        response = self._build_response(property_id, payload)
        self._properties[property_id] = response
        return response

    def update_property(self, property_id: str, payload: PropertyUpdate) -> PropertyResponse:
        existing = self.get_property(property_id)
        data = payload.dict(exclude_unset=True)
        updated_payload = PropertyCreate(**{**existing.dict(exclude={"id", "metrics", "cashflow_projection"}), **data})
        updated = self._build_response(property_id, updated_payload)
        self._properties[property_id] = updated
        return updated

    def delete_property(self, property_id: str) -> None:
        if property_id not in self._properties:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Property not found")
        del self._properties[property_id]


property_service = PropertyService()
