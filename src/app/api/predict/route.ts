import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const BACKEND_URL = "http://127.0.0.1:8000/predict";

export async function POST(req: NextRequest) {
  let body: { symbol?: string; horizon?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const symbol = (body.symbol ?? "").toString().trim().toUpperCase();
  const horizon = Number(body.horizon);
  if (!symbol) {
    return NextResponse.json({ error: "symbol is required" }, { status: 400 });
  }
  if (horizon !== 1 && horizon !== 5) {
    return NextResponse.json({ error: "horizon must be 1 or 5" }, { status: 400 });
  }

  let backendRes: Response;
  try {
    backendRes = await fetch(BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ symbol, horizon }),
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to reach the forecast backend at " + BACKEND_URL },
      { status: 502 }
    );
  }

  const text = await backendRes.text();
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }

  if (!backendRes.ok) {
    return NextResponse.json(
      { error: "Backend error", detail: data },
      { status: backendRes.status }
    );
  }

  return NextResponse.json(data);
}
