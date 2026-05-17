"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LineChart, Loader2, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

function normalizeSymbol(symbol: string) {
  const clean = symbol.trim().replace(/[^A-Z0-9:._-]/gi, "").toUpperCase();
  return clean || "NASDAQ:NVDA";
}

export function TradingViewTerminal({ symbol }: { symbol: string }) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const normalizedSymbol = useMemo(() => normalizeSymbol(symbol), [symbol]);
  const [draft, setDraft] = useState(normalizedSymbol);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    setLoading(true);
    container.innerHTML = "";

    const widget = document.createElement("div");
    widget.className = "tradingview-widget-container__widget h-full min-h-[620px]";
    container.appendChild(widget);

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.async = true;
    script.text = JSON.stringify({
      autosize: true,
      symbol: normalizedSymbol,
      interval: "D",
      timezone: "Etc/UTC",
      theme: "dark",
      style: "1",
      locale: "en",
      allow_symbol_change: true,
      calendar: false,
      support_host: "https://www.tradingview.com",
      studies: ["STD;Volume", "RSI@tv-basicstudies", "MASimple@tv-basicstudies"],
      hide_side_toolbar: false,
      withdateranges: true,
    });
    script.addEventListener("load", () => setLoading(false));
    script.addEventListener("error", () => setLoading(false));
    container.appendChild(script);

    return () => {
      container.innerHTML = "";
    };
  }, [normalizedSymbol]);

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push(`/research?symbol=${encodeURIComponent(normalizeSymbol(draft))}`);
  }

  return (
    <Card className="rounded-lg border-cyan-400/20 bg-[#0E1628]/78">
      <CardHeader className="gap-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="size-5 text-cyan-300" aria-hidden />
              TradingView Research Terminal
            </CardTitle>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              Advanced charting loads only on this page, keeping the dashboard fast while still
              giving users symbol search, indicators, market news, and technical context.
            </p>
          </div>
          <Badge className="border-cyan-400/35 bg-cyan-400/10 text-cyan-100" variant="outline">
            {normalizedSymbol}
          </Badge>
        </div>
        <form onSubmit={submitSearch} className="grid gap-2 md:grid-cols-[1fr_auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-2.5 size-4 text-muted-foreground" aria-hidden />
            <Input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              className="pl-9 uppercase"
              placeholder="NASDAQ:NVDA, NYSE:PLTR, NASDAQ:IONQ..."
            />
          </div>
          <Button type="submit">
            <Search className="size-4" aria-hidden />
            Load symbol
          </Button>
        </form>
      </CardHeader>
      <CardContent>
        <div className="relative h-[72vh] min-h-[620px] overflow-hidden rounded-lg border border-white/10 bg-[#070B14]">
          {loading ? (
            <div className="absolute inset-0 z-10 grid place-items-center bg-[#070B14] text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Loading chart
              </span>
            </div>
          ) : null}
          <div ref={containerRef} className="tradingview-widget-container h-full w-full" />
        </div>
        <p className="mt-3 text-xs leading-5 text-muted-foreground">
          Charting is provided by TradingView. AlphaForge provides automated market research for
          educational purposes only. This is not financial advice.
        </p>
      </CardContent>
    </Card>
  );
}
