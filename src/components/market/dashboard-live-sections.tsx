"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { BarChart3, RefreshCw, ShieldCheck } from "lucide-react";
import { ResearchTable, type LiveQuote } from "@/components/market/research-table";
import { SpeculativeRadar } from "@/components/market/speculative-radar";
import { StockCard } from "@/components/market/stock-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type {
  EmergingNarrative,
  PennyStockSignal,
  ResearchStock,
  SpeculativeSignal,
  SupplyChainLink,
} from "@/lib/types";

function chunk<T>(arr: T[], size: number) {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, index) =>
    arr.slice(index * size, index * size + size)
  );
}

function isMarketOpenNow() {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  }).formatToParts(now);

  const weekday = parts.find((part) => part.type === "weekday")?.value;
  const hour = Number(parts.find((part) => part.type === "hour")?.value);
  const minute = Number(parts.find((part) => part.type === "minute")?.value);
  const total = hour * 60 + minute;
  const isWeekday = weekday !== "Sat" && weekday !== "Sun";

  return isWeekday && total >= 570 && total < 960;
}

function uniqueSymbols(symbols: string[]) {
  return Array.from(
    new Set(
      symbols
        .map((symbol) => symbol.trim().toUpperCase())
        .filter((symbol) => /^[A-Z0-9.\-^=]{1,20}$/.test(symbol))
    )
  );
}

export function DashboardLiveSections({
  stocks,
  speculativeSignals,
  pennyStocks,
  narratives,
  supplyChains,
}: {
  stocks: ResearchStock[];
  speculativeSignals: SpeculativeSignal[];
  pennyStocks: PennyStockSignal[];
  narratives: EmergingNarrative[];
  supplyChains: SupplyChainLink[];
}) {
  const [quotes, setQuotes] = useState<Record<string, LiveQuote>>({});
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);

  const longTerm = useMemo(
    () => [...stocks].sort((a, b) => b.longTermScore - a.longTermScore).slice(0, 3),
    [stocks]
  );
  const shortTerm = useMemo(
    () => [...stocks].sort((a, b) => b.shortTermScore - a.shortTermScore).slice(0, 3),
    [stocks]
  );
  const symbols = useMemo(
    () =>
      uniqueSymbols([
        ...stocks.map((stock) => stock.symbol),
        ...speculativeSignals.map((signal) => signal.symbol),
        ...pennyStocks.map((stock) => stock.symbol),
      ]),
    [pennyStocks, speculativeSignals, stocks]
  );
  const marketOpen = isMarketOpenNow();

  const loadQuotes = useCallback(async () => {
    if (symbols.length === 0) return;

    setLoading(true);
    setQuoteError(null);

    try {
      const responses: {
        quotes?: LiveQuote[];
        error?: string;
        warning?: string;
        updatedAt?: string;
      }[] = [];

      for (const batch of chunk(symbols, 20)) {
        const response = await fetch(
          `/api/quotes?symbols=${encodeURIComponent(batch.join(","))}&t=${Date.now()}`,
          { cache: "no-store" }
        );

        responses.push(await response.json());
      }

      const nextQuotes = Object.fromEntries(
        responses.flatMap((response) => response.quotes ?? []).map((quote) => [quote.symbol, quote])
      );
      const warning = responses.find((response) => response.warning)?.warning;
      const error = responses.find((response) => response.error)?.error;

      setQuotes(nextQuotes);
      setUpdatedAt(new Date().toISOString());
      setQuoteError(error ?? warning ?? null);
    } catch {
      setQuoteError("Live market data could not refresh. Seed research values remain visible.");
    } finally {
      setLoading(false);
    }
  }, [symbols]);

  useEffect(() => {
    const firstLoad = window.setTimeout(() => {
      void loadQuotes();
    }, 0);

    const id = window.setInterval(() => {
      void loadQuotes();
    }, marketOpen ? 30_000 : 5 * 60_000);

    return () => {
      window.clearTimeout(firstLoad);
      window.clearInterval(id);
    };
  }, [loadQuotes, marketOpen]);

  const liveCount = Object.values(quotes).filter((quote) => quote.isLive && quote.price !== null).length;
  const refreshLabel = loading ? "Refreshing..." : "Refresh live prices";

  return (
    <>
      <section className="rounded-lg border border-cyan-400/20 bg-cyan-400/[0.06] p-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="border-cyan-400/35 bg-cyan-400/10 text-cyan-100" variant="outline">
                Live market overlay
              </Badge>
              <Badge variant="outline">{marketOpen ? "30s auto-refresh" : "5m auto-refresh"}</Badge>
              <Badge variant="outline">
                {liveCount}/{symbols.length} live-priced
              </Badge>
            </div>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
              Dashboard prices refresh from live quote endpoints and fall back to research seed
              values only when providers are unavailable. Manual refresh forces a fresh request.
            </p>
            {updatedAt ? (
              <p className="mt-1 text-xs text-muted-foreground">
                Last refreshed {new Date(updatedAt).toLocaleTimeString()}.
              </p>
            ) : null}
            {quoteError ? <p className="mt-1 text-xs text-amber-200">{quoteError}</p> : null}
          </div>
          <Button onClick={() => void loadQuotes()} disabled={loading} className="min-h-11">
            <RefreshCw className={loading ? "size-4 animate-spin" : "size-4"} aria-hidden />
            {refreshLabel}
          </Button>
        </div>
      </section>

      <Tabs defaultValue="long" className="grid gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold">Main Research Sections</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Core recommendations stay separate from speculative radar signals.
            </p>
          </div>
          <TabsList>
            <TabsTrigger value="long">Long-Term Investments</TabsTrigger>
            <TabsTrigger value="short">Short-Term Momentum</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="long" className="grid gap-4 md:grid-cols-3">
          {longTerm.map((stock) => (
            <StockCard key={stock.symbol} stock={stock} mode="long" quote={quotes[stock.symbol]} />
          ))}
        </TabsContent>
        <TabsContent value="short" className="grid gap-4 md:grid-cols-3">
          {shortTerm.map((stock) => (
            <StockCard key={stock.symbol} stock={stock} mode="short" quote={quotes[stock.symbol]} />
          ))}
        </TabsContent>
      </Tabs>

      <SpeculativeRadar
        signals={speculativeSignals}
        pennyStocks={pennyStocks}
        narratives={narratives}
        supplyChains={supplyChains}
        quotes={quotes}
      />

      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-white/10 bg-zinc-950/60 p-3 text-xs text-muted-foreground">
        <ShieldCheck className="size-4 text-emerald-300" aria-hidden />
        Live quote data may be delayed by provider rules. AlphaForge treats missing live data as a
        warning, not as a reason to hide risk.
      </div>

      <Card className="rounded-lg border-white/10 bg-zinc-950/70">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="size-5 text-sky-300" aria-hidden />
            Full Ranking Table
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResearchTable stocks={stocks} quotes={quotes} />
        </CardContent>
      </Card>
    </>
  );
}
