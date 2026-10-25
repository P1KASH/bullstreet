# StockSense AI — XGBoost Stock Prediction Prototype

## Run locally
1. Install Python 3.10 or 3.11.
2. Extract this ZIP and open a terminal in the project folder.
3. Run:
   ```bash
   python -m venv .venv
   # Windows:
   .venv\Scripts\activate
   # macOS/Linux:
   source .venv/bin/activate
   pip install -r requirements.txt
   streamlit run app.py
   ```
4. The app opens in your browser. Enter a ticker such as `RELIANCE.NS` or upload a CSV.

## CSV format
Recommended columns: `Date, Open, High, Low, Close, Volume`. Date is optional. Prices should be adjusted consistently.
## Method
XGBoost regressor, technical indicators, chronological 80/20 holdout, MAE/RMSE/R², feature importance, and an illustrative direction-based backtest.
## Limitations
Research/education prototype only. It is not investment advice. Historical performance does not establish future returns. Data provider availability, missing data, transaction costs, survivorship bias, and market regime shifts can materially affect results. The backtest is simplified and is not suitable for live trading.
