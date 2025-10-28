# Portfolio Simulator Frontend

Next.js 14 application styled with TailwindCSS. It communicates with the FastAPI backend using the `NEXT_PUBLIC_API_BASE` environment variable.

## Getting Started

```bash
npm install
npm run dev
```

The development server runs on `http://localhost:3000`. Ensure the backend is available locally at `http://localhost:8000` or update `NEXT_PUBLIC_API_BASE` accordingly.

## Deployment

Deploy to Vercel and set the environment variable:

- `NEXT_PUBLIC_API_BASE` → URL of the deployed FastAPI service on Render.
