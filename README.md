# CardioAssist

A full-stack ML SaaS application for heart disease risk prediction using Logistic Regression trained on the Cleveland Heart Disease dataset.

## Repository Structure

```
CardioAssist/
├── frontend/          # React + Vite + Tailwind v3  →  Deploy to Vercel
└── backend/           # Python FastAPI + scikit-learn  →  Deploy to Render
```

## Quick Start

### Backend (FastAPI)
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

API available at `http://localhost:8000`

### Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```

App available at `http://localhost:5173`  
Vite proxies `/api/*` → `http://localhost:8000/*` in dev mode.

---

## Deployment

### Backend → Render

1. Connect this repository to Render.
2. Set **Root Directory** to `backend`.
3. Set **Build Command** to `pip install -r requirements.txt`.
4. Set **Start Command** to `uvicorn main:app --host 0.0.0.0 --port $PORT`.
5. Deploy — your API will be at `https://your-app.onrender.com`.

### Frontend → Vercel

1. Connect this repository to Vercel.
2. Set **Root Directory** to `frontend`.
3. Add **Environment Variable**: `VITE_API_URL = https://your-app.onrender.com`.
4. Framework preset: **Vite**.
5. Deploy.

---

## ML Model

- **Algorithm**: Logistic Regression (scikit-learn, max_iter=1000)
- **Dataset**: Cleveland Heart Disease Dataset (303 samples, 13 features)
- **Preprocessing**: StandardScaler
- **Split**: 80% train / 20% test

### API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/healthz` | Health check |
| GET | `/metrics` | Model performance metrics + feature importance |
| POST | `/predict` | Predict heart disease risk for a patient |

### Predict Request Body
```json
{
  "age": 50,
  "sex": 1,
  "cp": 0,
  "trtbps": 120,
  "chol": 200,
  "fbs": 0,
  "restecg": 0,
  "thalachh": 150,
  "exng": 0,
  "oldpeak": 1.0,
  "slp": 1,
  "caa": 0,
  "thall": 2
}
```

---

*For informational purposes only. Not a substitute for professional medical advice.*
