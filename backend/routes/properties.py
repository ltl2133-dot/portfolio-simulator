"""Property endpoints."""
from __future__ import annotations

from fastapi import APIRouter

from backend.models.property import PropertyCollection, PropertyCreate, PropertyResponse, PropertyUpdate
from backend.services.property_service import property_service

router = APIRouter(prefix="/properties", tags=["properties"])


@router.get("", response_model=PropertyCollection)
def list_properties() -> PropertyCollection:
    properties = property_service.list_properties()
    return PropertyCollection(properties=properties)


@router.get("/{property_id}", response_model=PropertyResponse)
def fetch_property(property_id: str) -> PropertyResponse:
    return property_service.get_property(property_id)


@router.post("", response_model=PropertyResponse, status_code=201)
def create_property(payload: PropertyCreate) -> PropertyResponse:
    return property_service.create_property(payload)


@router.put("/{property_id}", response_model=PropertyResponse)
def update_property(property_id: str, payload: PropertyUpdate) -> PropertyResponse:
    return property_service.update_property(property_id, payload)


@router.delete("/{property_id}", status_code=204)
def delete_property(property_id: str) -> None:
    property_service.delete_property(property_id)
