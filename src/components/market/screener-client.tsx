"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ResearchTable, type LiveQuote } from "@/components/market/research-table";
import type { ResearchStock } from "@/lib/types";

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

export function ScreenerClient({ stocks }: { stocks: ResearchStock[] }) {
  const [query, setQuery] = useState("");
  const [sector, setSector] = useState("all");
  const [timeframe, setTimeframe] = useState("all");
  const [risk, setRisk] = useState("all");
  const [minimumScore, setMinimumScore] = useState("60");
  const [quotes, setQuotes] = useState<Record<string, LiveQuote>>({});
  const [quoteUpdatedAt, setQuoteUpdatedAt] = useState<string | null>(null);
  const [quoteError, setQuoteError] = useState<string | null>(null);

  const sectors = useMemo(() => ["all", ...Array.from(new Set(stocks.map((stock) => stock.sector)))], [stocks]);

  const filtered = useMemo(() => {
    const min = Number(minimumScore) || 0;

    return stocks.filter((stock) => {
      const textMatch = `${stock.symbol} ${stock.name}`.toLowerCase().includes(query.toLowerCase());
      const sectorMatch = sector === "all" || stock.sector === sector;
      const riskMatch = risk === "all" || stock.riskLevel === risk;
      const scoreMatch =
        timeframe === "short"
          ? stock.shortTermScore >= min
          : timeframe === "long"
            ? stock.longTermScore >= min
            : Math.max(stock.shortTermScore, stock.longTermScore) >= min;

      return textMatch && sectorMatch && riskMatch && scoreMatch;
    });
  }, [minimumScore, query, risk, sector, stocks, timeframe]);

  const symbols = useMemo(() => filtered.map((stock) => stock.symbol).slice(0, 200), [filtered]);
  const symbolsKey = symbols.join(",");
  const marketOpen = isMarketOpenNow();

  useEffect(() => {
    if (symbols.length === 0) {
      return;
    }

    let active = true;
    const controller = new AbortController();

    async function loadQuotes() {
      try {
        setQuoteError(null);
        const batches = chunk(symbols, 60);
        const responses = await Promise.all(
          batches.map(async (batch) => {
            const response = await fetch(`/api/quotes?symbols=${encodeURIComponent(batch.join(","))}`, {
              cache: "no-store",
              signal: controller.signal,
            });
            return (await response.json()) as { quotes?: LiveQuote[]; error?: string; updatedAt?: string };
          })
        );

        if (!active) return;

        const nextQuotes = Object.fromEntries(
          responses.flatMap((response) => response.quotes ?? []).map((quote) => [quote.symbol, quote])
        );
        setQuotes(nextQuotes);
        setQuoteUpdatedAt(new Date().toISOString());
        const error = responses.find((response) => response.error)?.error;
        setQuoteError(error ?? null);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        if (active) setQuoteError("Live quotes unavailable. Static research scores are still visible.");
      }
    }

    void loadQuotes();
    const id = window.setInterval(() => {
      void loadQuotes();
    }, marketOpen ? 30_000 : 5 * 60_000);

    return () => {
      active = false;
      controller.abort();
      window.clearInterval(id);
    };
  }, [marketOpen, symbols, symbolsKey]);

  return (
    <div className="grid gap-5">
      <div className="grid gap-3 rounded-lg border border-white/10 bg-zinc-950/70 p-4 md:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr_0.6fr_auto]">
        <div className="grid gap-2">
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-2.5 size-4 text-muted-foreground" aria-hidden />
            <Input id="search" value={query} onChange={(event) => setQuery(event.target.value)} className="pl-8" placeholder="Symbol or company" />
          </div>
        </div>
        <div className="grid gap-2">
          <Label>Sector</Label>
          <Select value={sector} onValueChange={setSector}>
            <SelectTrigger>
              <SelectValue placeholder="Sector" />
            </SelectTrigger>
            <SelectContent>
              {sectors.map((option) => (
                <SelectItem key={option} value={option}>
                  {option === "all" ? "All sectors" : option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label>Timeframe</Label>
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger>
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Best score</SelectItem>
              <SelectItem value="long">Long-term</SelectItem>
              <SelectItem value="short">Short-term</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label>Risk</Label>
          <Select value={risk} onValueChange={setRisk}>
            <SelectTrigger>
              <SelectValue placeholder="Risk" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All risk</SelectItem>
              <SelectItem value="Low Risk">Low Risk</SelectItem>
              <SelectItem value="Moderate Risk">Moderate Risk</SelectItem>
              <SelectItem value="Aggressive">Aggressive</SelectItem>
              <SelectItem value="Extreme Volatility">Extreme Volatility</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="minimum">Min score</Label>
          <Input id="minimum" inputMode="numeric" value={minimumScore} onChange={(event) => setMinimumScore(event.target.value)} />
        </div>
        <div className="flex items-end">
          <Button variant="outline" className="w-full" onClick={() => {
            setQuery("");
            setSector("all");
            setTimeframe("all");
            setRisk("all");
            setMinimumScore("60");
          }}>
            <SlidersHorizontal className="size-4" aria-hidden />
            Reset
          </Button>
        </div>
      </div>
      <div className="rounded-lg border border-white/10 bg-zinc-950/70 p-1">
        <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2">
          <div>
            <p className="text-sm text-muted-foreground">{filtered.length} matches</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Live market data refreshes automatically during active trading hours. Results may vary.
              {quoteUpdatedAt ? ` Updated ${new Date(quoteUpdatedAt).toLocaleTimeString()}.` : ""}
            </p>
            {quoteError ? <p className="mt-1 text-xs text-amber-200">{quoteError}</p> : null}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge className={marketOpen ? "border-emerald-400/35 bg-emerald-400/10 text-emerald-200" : "border-amber-400/35 bg-amber-400/10 text-amber-200"} variant="outline">
              {marketOpen ? "Market Open" : "Market Closed"}
            </Badge>
            <Badge variant="outline">Stocks, ETFs, and crypto research universe</Badge>
          </div>
        </div>
        <ResearchTable stocks={filtered} quotes={quotes} />
      </div>
    </div>
  );
}
