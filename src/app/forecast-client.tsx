"use client";

import { useState } from "react";
import { Loader as Loader2, CircleAlert as AlertCircle } from "lucide-react";

type Horizon = 1 | 5;

type PredictResponse = {
  symbol?: string;
  horizon?: number;
  predicted_return?: number;
  predicted_return_pct?: number;
  predicted_price?: number;
  current_price?: number;
  metrics?: Record<string, number>;
  [key: string]: unknown;
};

const SYMBOLS = ["RELIANCE", "TCS", "INFY", "HDFCBANK", "AAPL"];

export default function ForecastClient() {
  const [symbol, setSymbol] = useState<string>("RELIANCE");
  const [horizon, setHorizon] = useState<Horizon>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PredictResponse | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol, horizon }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Backend returned ${res.status}: ${text}`);
      }
      const data: PredictResponse = await res.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to reach the forecast backend.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6">
      <form
        onSubmit={handleSubmit}
        className="bg-[var(--panel)] border border-[var(--border)] rounded-xl p-5 grid gap-4"
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="grid gap-2 text-sm">
            <span className="text-[var(--muted)]">Stock symbol</span>
            <input
              list="symbols"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              className="bg-[var(--bg)] border border-[var(--border)] rounded-lg px-3 py-2 outline-none focus:border-[var(--accent)] transition-colors uppercase"
              placeholder="RELIANCE"
              required
            />
            <datalist id="symbols">
              {SYMBOLS.map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
          </label>

          <fieldset className="grid gap-2 text-sm">
            <span className="text-[var(--muted)]">Forecast horizon</span>
            <div className="flex gap-2">
              {[1, 5].map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => setHorizon(h as Horizon)}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    horizon === h
                      ? "border-[var(--accent)] text-[var(--accent)] bg-[var(--accent)]/10"
                      : "border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)]"
                  }`}
                >
                  {h} day{h > 1 ? "s" : ""}
                </button>
              ))}
            </div>
          </fieldset>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 bg-[var(--accent)] text-[var(--bg)] font-medium rounded-lg px-4 py-2.5 disabled:opacity-60 hover:opacity-90 transition-opacity"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {loading ? "Running model…" : "Run forecast"}
        </button>
      </form>

      {error && (
        <div className="flex items-start gap-3 bg-[var(--down)]/10 border border-[var(--down)]/40 text-[var(--down)] rounded-xl p-4 text-sm">
          <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
          <div>
            <p className="font-medium">Forecast failed</p>
            <p className="opacity-90 mt-1 break-words">{error}</p>
            <p className="opacity-70 mt-2">
              Make sure your FastAPI backend is running at http://127.0.0.1:8000.
            </p>
          </div>
        </div>
      )}

      {result && <ResultCard data={result} />}
    </div>
  );
}

function ResultCard({ data }: { data: PredictResponse }) {
  const ret =
    data.predicted_return ?? data.predicted_return_pct ?? null;
  const price = data.predicted_price ?? null;
  const current = data.current_price ?? null;
  const isUp = ret == null ? null : ret >= 0;
  const metrics = data.metrics ?? null;

  return (
    <div className="bg-[var(--panel)] border border-[var(--border)] rounded-xl p-5 grid gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">
          {data.symbol ?? "—"}
          <span className="text-[var(--muted)] font-normal text-sm ml-2">
            {data.horizon ?? "?"}-day forecast
          </span>
        </h2>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Stat
          label="Predicted return"
          value={ret == null ? "—" : `${(ret * 100).toFixed(2)}%`}
          tone={isUp == null ? undefined : isUp ? "up" : "down"}
        />
        <Stat
          label="Estimated future price"
          value={price == null ? "—" : `${Number(price).toFixed(2)}`}
        />
        <Stat
          label="Current price"
          value={current == null ? "—" : `${Number(current).toFixed(2)}`}
        />
      </div>

      {metrics && Object.keys(metrics).length > 0 && (
        <div className="grid gap-2">
          <h3 className="text-sm text-[var(--muted)]">Model evaluation metrics</h3>
          <div className="grid sm:grid-cols-3 gap-2">
            {Object.entries(metrics).map(([k, v]) => (
              <div
                key={k}
                className="bg-[var(--bg)] border border-[var(--border)] rounded-lg px-3 py-2"
              >
                <div className="text-xs text-[var(--muted)] uppercase tracking-wide">{k}</div>
                <div className="font-mono text-sm mt-0.5">
                  {typeof v === "number" ? v.toFixed(4) : String(v)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "up" | "down";
}) {
  const color =
    tone === "up" ? "text-[var(--up)]" : tone === "down" ? "text-[var(--down)]" : "text-[var(--text)]";
  return (
    <div className="bg-[var(--bg)] border border-[var(--border)] rounded-lg px-4 py-3">
      <div className="text-xs text-[var(--muted)] uppercase tracking-wide">{label}</div>
      <div className={`text-lg font-semibold mt-1 ${color}`}>{value}</div>
    </div>
  );
}
