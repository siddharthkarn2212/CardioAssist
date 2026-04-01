"""
CardioAssist AI - FastAPI Backend
Serves ML predictions for heart disease risk.
"""

import os
import json
import numpy as np
import joblib
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# Paths
BASE_DIR = os.path.dirname(__file__)
MODEL_PATH = os.path.join(BASE_DIR, "model.pkl")
SCALER_PATH = os.path.join(BASE_DIR, "scaler.pkl")
METRICS_PATH = os.path.join(BASE_DIR, "metrics.json")

# Train model on startup if not trained
if not os.path.exists(MODEL_PATH) or not os.path.exists(SCALER_PATH):
    print("Model not found. Training model...")
    from train_model import train_and_save
    train_and_save()
    print("Model trained and saved.")

# Load model and scaler
model = joblib.load(MODEL_PATH)
scaler = joblib.load(SCALER_PATH)

# Load metrics
with open(METRICS_PATH, "r") as f:
    model_metrics = json.load(f)

app = FastAPI(
    title="CardioAssist AI API",
    description="Heart disease risk prediction using Logistic Regression",
    version="1.0.0",
)

# Configure CORS to allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Feature order must match training
FEATURE_COLUMNS = [
    "age", "sex", "cp", "trtbps", "chol", "fbs",
    "restecg", "thalachh", "exng", "oldpeak", "slp", "caa", "thall"
]


class PredictInput(BaseModel):
    age: int = Field(..., description="Age in years", ge=1, le=120)
    sex: int = Field(..., description="Sex (1=male, 0=female)", ge=0, le=1)
    cp: int = Field(..., description="Chest pain type (0-3)", ge=0, le=3)
    trtbps: int = Field(..., description="Resting blood pressure (mm Hg)", ge=50, le=300)
    chol: int = Field(..., description="Serum cholesterol (mg/dl)", ge=100, le=600)
    fbs: int = Field(..., description="Fasting blood sugar > 120 mg/dl (1=true, 0=false)", ge=0, le=1)
    restecg: int = Field(..., description="Resting ECG results (0-2)", ge=0, le=2)
    thalachh: int = Field(..., description="Maximum heart rate achieved", ge=50, le=250)
    exng: int = Field(..., description="Exercise induced angina (1=yes, 0=no)", ge=0, le=1)
    oldpeak: float = Field(..., description="ST depression induced by exercise", ge=0.0, le=10.0)
    slp: int = Field(..., description="Slope of peak exercise ST segment (0-2)", ge=0, le=2)
    caa: int = Field(..., description="Number of major vessels colored by fluoroscopy (0-4)", ge=0, le=4)
    thall: int = Field(..., description="Thalassemia (0-3)", ge=0, le=3)


class PredictOutput(BaseModel):
    prediction: str
    probability: float
    risk_score: float


class MetricsOutput(BaseModel):
    accuracy: float
    precision: float
    recall: float
    f1_score: float
    test_size: int
    train_size: int
    top_features: list


@app.get("/")
def root():
    return {"message": "CardioAssist AI API is running", "status": "healthy"}


@app.post("/predict", response_model=PredictOutput)
def predict(data: PredictInput):
    """
    Predict heart disease risk for a given patient profile.
    Returns prediction label, probability, and risk score.
    """
    try:
        # Build feature array in correct column order
        features = np.array([[
            data.age, data.sex, data.cp, data.trtbps, data.chol, data.fbs,
            data.restecg, data.thalachh, data.exng, data.oldpeak,
            data.slp, data.caa, data.thall
        ]])

        # Apply the same scaler used during training
        features_scaled = scaler.transform(features)

        # Get prediction and probabilities
        prediction_class = model.predict(features_scaled)[0]
        probabilities = model.predict_proba(features_scaled)[0]

        # output=1 means "has heart disease" (high risk)
        # output=0 means "no heart disease" (low risk)
        high_risk_prob = float(probabilities[1])

        if prediction_class == 1:
            label = "High Risk"
        else:
            label = "Low Risk"

        return PredictOutput(
            prediction=label,
            probability=round(high_risk_prob, 4),
            risk_score=round(high_risk_prob * 100, 2),
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/metrics", response_model=MetricsOutput)
def get_metrics():
    """
    Return model evaluation metrics computed during training.
    """
    return MetricsOutput(**model_metrics)
