# BullStreet AI — Next.js / Vercel package

## Run on Windows
1. Extract `BullStreet_AI_Vercel_NextJS.zip`.
2. Open PowerShell in the extracted `BullStreet_AI_Vercel_NextJS` folder.
3. Run `npm install`
4. Run `npm run dev`
5. Open http://localhost:3000

## Deploy to Vercel
Push the project to GitHub, then import that repository at https://vercel.com/new. Keep the detected Next.js defaults and click Deploy.

## Important prototype limitations
- Market values and price histories are illustrative sample data, not live quotes.
- The forecast is a demo scenario calculation, not a trained XGBoost model.
- Login is a local demo interaction, not secure authentication.
- Portfolio values are illustrative and do not execute trades.
- To use publicly for real research, connect an appropriate market-data provider and a tested forecasting backend, add secure authentication and persistence, and review data licensing/compliance.
