"""FastAPI entry point for the real estate portfolio simulator."""
from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.routes.properties import router as properties_router
from backend.routes.portfolio import router as portfolio_router
from backend.routes.simulations import router as simulations_router

app = FastAPI(
    title="Real Estate Portfolio Simulator API",
    version="1.0.0",
    description="Backend for modeling property performance, portfolio returns, and market risk.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(properties_router)
app.include_router(portfolio_router)
app.include_router(simulations_router)


@app.get("/health", tags=["health"])
def healthcheck() -> dict:
    """Simple health check endpoint used by Render."""

    return {"status": "ok"}
