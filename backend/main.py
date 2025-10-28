"""FastAPI application setup for the portfolio simulator service."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.finance.simulate import run_monte_carlo, simulate_portfolio
from backend.schemas import (
    MonteCarloRequest,
    MonteCarloResponse,
    PortfolioResponse,
    PortfolioSimulationRequest,
    SamplePortfolioResponse,
)

# Instantiate FastAPI application
app = FastAPI(title="Portfolio Simulator", version="1.0.0")

# Configure CORS middleware for local development and Vercel deployments
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://portfolio-simulator-five.vercel.app",
    ],
    allow_origin_regex="https://.*vercel.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Health monitoring endpoint
@app.get("/health")
def health_check() -> dict[str, str]:
    """Return a simple status response indicating the service is healthy."""
    return {"status": "ok"}


# Sample property dataset endpoint
@app.get("/properties", response_model=SamplePortfolioResponse)
def get_sample_properties() -> SamplePortfolioResponse:
    """Provide a sample portfolio payload for bootstrapping the frontend."""
    return SamplePortfolioResponse.example()


# Deterministic portfolio simulation endpoint
@app.post("/simulate", response_model=PortfolioResponse)
def simulate(request: PortfolioSimulationRequest) -> PortfolioResponse:
    """Calculate deterministic portfolio metrics for the supplied properties."""
    return simulate_portfolio(request)


# Monte Carlo simulation endpoint
@app.post("/monte-carlo", response_model=MonteCarloResponse)
def monte_carlo(request: MonteCarloRequest) -> MonteCarloResponse:
    """Run Monte Carlo simulations to summarize portfolio outcome distributions."""
    return run_monte_carlo(request)
