# BullStreet AI — Backend (FastAPI + XGBoost)

This folder runs your existing XGBoost stock-prediction model behind a small
FastAPI API. The Next.js frontend talks to it through its own `/api/predict`
proxy, so the browser never calls FastAPI directly.

## Endpoints

| Method | Path        | Body                                  | Response |
|--------|-------------|---------------------------------------|----------|
| GET    | `/health`   | —                                     | `{"status":"ok","model_loaded":true/false}` |
| POST   | `/predict`  | `{"symbol":"RELIANCE","horizon":1}`   | see below |

`horizon` must be `1` or `5`.

### `/predict` response shape (matches the frontend)

```json
{
  "symbol": "RELIANCE",
  "horizon": 1,
  "predicted_return": 0.0123,
  "predicted_price": 2945.60,
  "current_price": 2909.50,
  "metrics": {
    "rmse": 0.018,
    "mae": 0.012,
    "r2": 0.74,
    "directional_accuracy": 0.81
  }
}
```

- `predicted_return` is a **fraction** (0.0123 = 1.23%).
- `metrics` is free-form — put whatever evaluation numbers your model reports.

## IMPORTANT — plug in your model

`main.py` is a thin HTTP layer and contains **no** prediction logic. All model
work happens in `model_interface.py`, which has four `TODO` markers:

1. **Import your model code** at the top of the file.
2. **`_load_model()`** — load your trained XGBoost model once at startup.
3. **`_predict_raw(symbol, horizon)`** — call your existing prediction
   function and return its raw output.
4. **`_to_response(symbol, horizon, raw)`** — map your model's output to the
   response shape above.

Until you fill in those TODOs, `/predict` returns a 500 error with a clear
message pointing at the file and function to edit. `/health` works immediately
and reports `model_loaded: false` until the model loads.

## Run on Windows

From the `backend/` folder in PowerShell:

```powershell
# 1) Create and activate a virtual environment (one-time)
python -m venv .venv
.venv\Scripts\Activate.ps1

# 2) Install dependencies
pip install -r requirements.txt

# 3) Start the API
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

The API will be live at http://127.0.0.1:8000.

- Check it: open http://127.0.0.1:8000/health
- Interactive docs: http://127.0.0.1:8000/docs

Then start the Next.js frontend (from the project root, in a separate
PowerShell window):

```powershell
npm run dev
```

Open http://localhost:3000, pick a symbol and horizon, and click
**Run forecast**.
