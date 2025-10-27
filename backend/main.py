from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from schemas import (
    MonteCarloRequest,
    MonteCarloResponse,
    PortfolioResponse,
    PortfolioSimulationRequest,
    SamplePortfolioResponse,
)
from finance.simulate import run_monte_carlo, simulate_portfolio

app = FastAPI(title="Portfolio Simulator", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://portfolio-simulator-five.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/properties", response_model=SamplePortfolioResponse)
def get_sample_properties() -> SamplePortfolioResponse:
    return SamplePortfolioResponse.example()


@app.post("/simulate", response_model=PortfolioResponse)
def simulate(request: PortfolioSimulationRequest) -> PortfolioResponse:
    return simulate_portfolio(request)


@app.post("/monte-carlo", response_model=MonteCarloResponse)
def monte_carlo(request: MonteCarloRequest) -> MonteCarloResponse:
    return run_monte_carlo(request)
