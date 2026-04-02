"""
CardioAssist AI - Model Training Script
Trains a Logistic Regression model on the heart disease dataset.
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
import joblib
import os

DATA_PATH = os.path.join(os.path.dirname(__file__), "data", "heart_disease.csv")
MODEL_PATH = os.path.join(os.path.dirname(__file__), "model.pkl")
SCALER_PATH = os.path.join(os.path.dirname(__file__), "scaler.pkl")
METRICS_PATH = os.path.join(os.path.dirname(__file__), "metrics.json")


def train_and_save():
    # Load dataset
    df = pd.read_csv(DATA_PATH)
    print(f"Dataset loaded: {df.shape[0]} rows, {df.shape[1]} columns")

    # Define features and target
    feature_columns = [
        "age", "sex", "cp", "trtbps", "chol", "fbs",
        "restecg", "thalachh", "exng", "oldpeak", "slp", "caa", "thall"
    ]
    X = df[feature_columns]
    y = df["output"]

    # Train-test split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    # Scale features using StandardScaler
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    # Train Logistic Regression model
    model = LogisticRegression(max_iter=1000)
    model.fit(X_train_scaled, y_train)

    # Evaluate model
    y_pred = model.predict(X_test_scaled)
    metrics = {
        "accuracy": round(float(accuracy_score(y_test, y_pred)), 4),
        "precision": round(float(precision_score(y_test, y_pred)), 4),
        "recall": round(float(recall_score(y_test, y_pred)), 4),
        "f1_score": round(float(f1_score(y_test, y_pred)), 4),
        "test_size": len(y_test),
        "train_size": len(y_train),
    }
    print("Model Evaluation Metrics:")
    for k, v in metrics.items():
        print(f"  {k}: {v}")

    # Extract top 3 feature importances from coefficients
    coefficients = model.coef_[0]
    feature_importance = list(zip(feature_columns, coefficients))
    feature_importance.sort(key=lambda x: abs(x[1]), reverse=True)
    top_features = [
        {"feature": feat, "coefficient": round(float(coef), 4)}
        for feat, coef in feature_importance[:3]
    ]
    metrics["top_features"] = top_features
    print("Top 3 Important Features:")
    for f in top_features:
        print(f"  {f['feature']}: {f['coefficient']}")

    # Save model and scaler
    joblib.dump(model, MODEL_PATH)
    joblib.dump(scaler, SCALER_PATH)
    print(f"Model saved to {MODEL_PATH}")
    print(f"Scaler saved to {SCALER_PATH}")

    # Save metrics
    import json
    with open(METRICS_PATH, "w") as f:
        json.dump(metrics, f, indent=2)
    print(f"Metrics saved to {METRICS_PATH}")

    return metrics


if __name__ == "__main__":
    train_and_save()
