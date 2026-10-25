"""
Bridge between the FastAPI layer and your existing XGBoost model.

This module does NOT implement any prediction logic. It imports YOUR model
code and exposes a single function `predict(symbol, horizon)` that returns a
dict with the fields the frontend expects.

>>> predict("RELIANCE", 1)
{
    "symbol": "RELIANCE",
    "horizon": 1,
    "predicted_return": 0.0123,        # fractional return, e.g. 0.0123 = 1.23%
    "predicted_price": 2945.60,        # estimated future price
    "current_price": 2909.50,          # last known close
    "metrics": {                       # whatever your model reports
        "rmse": 0.018,
        "mae": 0.012,
        "r2": 0.74,
        "directional_accuracy": 0.81
    }
}

INTEGRATION STEPS (replace the TODOs below with calls to YOUR code):

1. Put your model file(s) in this `backend/` folder (or a subfolder) and
   import them where indicated.
2. In `_load_model()`, load your trained XGBoost model once at startup
   (e.g. xgb.Booster(); joblib.load(...); pickle.load(...)).
3. In `_predict_raw()`, call your model's prediction function for the given
   symbol and horizon and return whatever your code produces.
4. In `_to_response()`, map your model's output to the dict shape above.
   The four numeric fields are what the frontend displays; `metrics` is a
   free-form object and can contain any evaluation numbers your model has.

If your model needs market data, load it here too (CSV, yfinance, an API
client, etc.) — keep all data access inside this file so main.py stays a
thin HTTP layer.
"""

from __future__ import annotations

import logging
from typing import Any

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# TODO 1: import your existing model code here, e.g.
#   import xgboost as xgb
#   import joblib
#   from your_model_file import build_features, fetch_recent_prices
# ---------------------------------------------------------------------------

_model: Any = None
_model_ready: bool = False


def is_ready() -> bool:
    """True once the model has been loaded successfully."""
    return _model_ready


def _load_model() -> None:
    """Load the trained XGBoost model once at startup."""
    global _model, _model_ready
    # TODO 2: load your model, e.g.
    #   _model = xgb.Booster()
    #   _model.load_model("xgb_model.json")
    # or
    #   _model = joblib.load("model.pkl")
    raise NotImplementedError(
        "Model loading is not configured. Edit backend/model_interface.py "
        "_load_model() to load your trained XGBoost model."
    )
    # _model_ready = True  # set this after a successful load


def _ensure_loaded() -> None:
    if not _model_ready:
        _load_model()


def _predict_raw(symbol: str, horizon: int) -> Any:
    """Call your existing prediction logic and return its raw output."""
    _ensure_loaded()
    # TODO 3: build features for `symbol`, run _model.predict(...), and return
    # whatever your model produces (a scalar return, a future price, a dict,
    # etc.). Keep the raw shape here — _to_response() maps it below.
    raise NotImplementedError(
        "Prediction logic is not configured. Edit backend/model_interface.py "
        "_predict_raw() to call your existing XGBoost prediction function."
    )


def _to_response(symbol: str, horizon: int, raw: Any) -> dict:
    """Map your model's raw output to the frontend's expected shape."""
    # TODO 4: replace this mapping with one that matches your model's output.
    # `raw` is whatever _predict_raw returned.
    raise NotImplementedError(
        "Response mapping is not configured. Edit backend/model_interface.py "
        "_to_response() to map your model output to the dict shape the "
        "frontend expects (predicted_return, predicted_price, current_price, metrics)."
    )
    # Example of the required return shape:
    # return {
    #     "symbol": symbol,
    #     "horizon": horizon,
    #     "predicted_return": float(raw["return"]),
    #     "predicted_price": float(raw["price"]),
    #     "current_price": float(raw["current"]),
    #     "metrics": {k: float(v) for k, v in raw["metrics"].items()},
    # }


def predict(symbol: str, horizon: int) -> dict:
    """Public entry point called by main.py /predict."""
    raw = _predict_raw(symbol, horizon)
    return _to_response(symbol, horizon, raw)
