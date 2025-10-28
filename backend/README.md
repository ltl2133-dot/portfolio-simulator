# Portfolio Simulator Backend

This FastAPI service powers the portfolio simulator application. It offers two core endpoints:

- `POST /simulate` — deterministic cashflow and equity projections for a portfolio of properties.
- `POST /monte-carlo` — stochastic simulation to understand a range of outcomes.

## Local Development

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn backend.main:app --reload
```

The server listens on `http://127.0.0.1:8000` by default. Update the frontend `NEXT_PUBLIC_API_BASE` env variable to point to this URL during development.

## Deployment

Render start command:

```bash
uvicorn backend.main:app --host 0.0.0.0 --port 10000
```

Configure the environment variable `PORT` to `10000` on Render so health checks succeed.
