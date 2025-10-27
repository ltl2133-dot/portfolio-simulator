# Portfolio Simulator

A full-stack real estate portfolio simulator featuring a FastAPI backend and a Next.js 14 frontend. Use it to estimate portfolio performance and explore Monte Carlo scenarios.

## Structure

- `backend/` — FastAPI service exposing simulation endpoints.
- `frontend/` — Next.js UI with Zustand state management and Recharts visualizations.

## Local Development

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn backend.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Set `NEXT_PUBLIC_API_BASE=http://localhost:8000` to point to the local backend.

## Deployment

- **Backend (Render)**: start command `uvicorn backend.main:app --host 0.0.0.0 --port 10000`.
- **Frontend (Vercel)**: configure `NEXT_PUBLIC_API_BASE` to the Render deployment URL.
