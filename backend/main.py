"""
BullStreet AI — FastAPI backend.

Exposes:
  GET  /health   -> {"status":"ok"}
  POST /predict  -> forwards {symbol, horizon} to your XGBoost model and returns its output.

This file contains NO prediction logic. It loads your model through
`model_interface.predict(symbol, horizon)`, which imports your existing
XGBoost code. See model_interface.py and README.md for the contract.
"""

from __future__ import annotations

import logging
from typing import Literal

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

import model_interface

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("bullstreet-api")

app = FastAPI(title="BullStreet AI Backend", version="1.0.0")

# Allow the Next.js dev server (and the in-app proxy) to call this API.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


class PredictRequest(BaseModel):
    symbol: str = Field(..., min_length=1, max_length=20)
    horizon: Literal[1, 5] = 1


@app.get("/health")
def health() -> dict:
    return {"status": "ok", "model_loaded": model_interface.is_ready()}


@app.post("/predict")
def predict(req: PredictRequest) -> dict:
    symbol = req.symbol.strip().upper()
    logger.info("predict request: symbol=%s horizon=%d", symbol, req.horizon)
    return model_interface.predict(symbol, req.horizon)
