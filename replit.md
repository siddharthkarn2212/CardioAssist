# CardioAssist AI Workspace

## Overview

Full-stack ML SaaS application for heart disease risk prediction. Uses a Python FastAPI ML backend with a trained Logistic Regression model, a TypeScript Express proxy server, and a React + Vite frontend.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5 (proxy layer)
- **ML Backend**: Python FastAPI + scikit-learn
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   ├── api-server/         # Express API server (proxy to ML backend)
│   └── cardioassist/       # React + Vite frontend
├── ml-backend/             # Python FastAPI ML service
│   ├── main.py             # FastAPI app with /predict and /metrics
│   ├── train_model.py      # ML model training script
│   ├── data/               # heart_disease.csv dataset
│   ├── model.pkl           # Trained Logistic Regression model
│   ├── scaler.pkl          # StandardScaler for feature normalization
│   └── metrics.json        # Model evaluation metrics
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
└── package.json
```

## ML Pipeline

- **Dataset**: Cleveland Heart Disease dataset (303 rows, 14 columns)
- **Target**: `output` (1=high risk, 0=low risk)
- **Model**: Logistic Regression (max_iter=1000)
- **Preprocessing**: StandardScaler
- **Performance**: ~85% accuracy, 87% precision, 84% recall, 86% F1

## Architecture

```
Frontend (React/Vite :23227)
    ↓ HTTP
Express API Server (:8080) at /api
    ↓ Proxy
ML Backend (FastAPI :8000)
    → POST /predict
    → GET /metrics
```

## Workflows

- **ML Backend**: `cd ml-backend && uvicorn main:app --host 0.0.0.0 --port 8000`
- **API Server**: `pnpm --filter @workspace/api-server run dev`
- **CardioAssist Frontend**: `pnpm --filter @workspace/cardioassist run dev`

## Frontend Pages

- `/` — Landing page with product intro and CTA
- `/dashboard` — 13-field input form, prediction result with color-coded risk indicator
- `/analytics` — Model metrics cards + top feature importance bar chart (recharts)
- `/about` — Model explanation and methodology

## API Endpoints

- `GET /api/healthz` — Health check
- `POST /api/ml/predict` — Heart disease risk prediction
- `GET /api/ml/metrics` — Model evaluation metrics

## Packages

### `artifacts/api-server` (`@workspace/api-server`)

Express 5 API server with ML proxy route. Routes live in `src/routes/` and forward ML requests to the Python backend at `localhost:8000`.

### `artifacts/cardioassist` (`@workspace/cardioassist`)

React + Vite frontend. Uses generated React Query hooks from `@workspace/api-client-react`.

### `ml-backend`

Python FastAPI service. Trains and serves a Logistic Regression model for heart disease prediction. Run `python train_model.py` to retrain.
