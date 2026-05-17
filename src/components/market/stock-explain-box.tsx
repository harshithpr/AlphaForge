"use client";

import { useState } from "react";

type ExplainData = {
  symbol: string;
  name: string;
  price: number | null;
  changePercent: number;
  marketCap: string;
  pe: string | number;
  volume: string | number;
  marketState: string;
  risk: string;
  pros: string[];
  cons: string[];
  shortTerm: string;
  longTerm: string;
  keyNewsFactors?: string[];
  warning: string;
  updatedAt: string;
  error?: string;
};

export function StockExplainBox() {
  const [symbol, setSymbol] = useState("");
  const [data, setData] = useState<ExplainData | null>(null);
  const [loading, setLoading] = useState(false);

  async function explainStock() {
    if (!symbol.trim()) return;

    setLoading(true);
    setData(null);

    try {
      const response = await fetch("/api/explain/stock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ symbol }),
      });

      const json = (await response.json()) as ExplainData;
      setData(json);
    } catch {
      setData({
        symbol: symbol.trim().toUpperCase(),
        name: "Unavailable",
        price: null,
        changePercent: 0,
        marketCap: "Unknown",
        pe: "Unknown",
        volume: "Unknown",
        marketState: "Unknown",
        risk: "Unknown",
        pros: [],
        cons: [],
        shortTerm: "",
        longTerm: "",
        warning: "This is automated market research for educational purposes only, not financial advice.",
        updatedAt: new Date().toISOString(),
        error: "Failed to generate explanation. Try again in a moment.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
      <h2 className="text-2xl font-semibold tracking-tight">Stock Explain</h2>
      <p className="mt-2 text-sm text-white/55">
        Type a ticker and get pros, cons, risks, outlook notes, and key market factors.
      </p>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <input
          value={symbol}
          onChange={(event) => setSymbol(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") void explainStock();
          }}
          placeholder="Example: NVDA, AAPL, AMD"
          className="min-h-11 flex-1 rounded-lg border border-white/10 bg-black/30 px-4 text-sm outline-none focus:border-cyan-400/60"
        />

        <button
          onClick={explainStock}
          disabled={loading}
          className="min-h-11 rounded-lg bg-cyan-300 px-5 font-medium text-black transition hover:bg-cyan-200"
        >
          {loading ? "Analyzing..." : "Explain"}
        </button>
      </div>

      {data?.error ? (
        <p className="mt-4 rounded-lg border border-rose-400/20 bg-rose-400/5 p-3 text-sm text-rose-100">
          {data.error}
        </p>
      ) : null}

      {data && !data.error ? (
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="rounded-lg border border-white/10 bg-black/20 p-4 lg:col-span-2">
            <h3 className="text-xl font-semibold">
              {data.symbol} · {data.name}
            </h3>
            <p className="mt-2 text-sm leading-6 text-white/60">
              Price: ${data.price ?? "N/A"} · Change:{" "}
              {typeof data.changePercent === "number" ? data.changePercent.toFixed(2) : data.changePercent}% ·
              Risk: {data.risk} · Market: {data.marketState} · Updated{" "}
              {new Date(data.updatedAt).toLocaleTimeString()}
            </p>
            <p className="mt-2 text-xs leading-5 text-white/45">
              Market cap: {data.marketCap} · P/E: {data.pe} · Volume:{" "}
              {typeof data.volume === "number" ? data.volume.toLocaleString() : data.volume}
            </p>
          </div>

          <div className="rounded-lg border border-emerald-400/20 bg-emerald-400/5 p-4">
            <h4 className="font-semibold text-emerald-200">Pros</h4>
            <ul className="mt-3 grid list-disc gap-2 pl-4 text-sm leading-6 text-white/70">
              {data.pros.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-rose-400/20 bg-rose-400/5 p-4">
            <h4 className="font-semibold text-rose-200">Cons</h4>
            <ul className="mt-3 grid list-disc gap-2 pl-4 text-sm leading-6 text-white/70">
              {data.cons.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-white/10 bg-black/20 p-4">
            <h4 className="font-semibold">Short-term outlook</h4>
            <p className="mt-2 text-sm leading-6 text-white/65">{data.shortTerm}</p>
          </div>

          <div className="rounded-lg border border-white/10 bg-black/20 p-4">
            <h4 className="font-semibold">Long-term outlook</h4>
            <p className="mt-2 text-sm leading-6 text-white/65">{data.longTerm}</p>
          </div>

          <div className="rounded-lg border border-white/10 bg-black/20 p-4 lg:col-span-2">
            <h4 className="font-semibold">Key news factors</h4>
            <ul className="mt-3 grid list-disc gap-2 pl-4 text-sm leading-6 text-white/65">
              {(data.keyNewsFactors ?? []).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <p className="text-xs leading-5 text-white/40 lg:col-span-2">{data.warning}</p>
        </div>
      ) : null}
    </section>
  );
}
