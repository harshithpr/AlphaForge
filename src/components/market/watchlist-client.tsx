"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Plus, Star, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResearchTable } from "@/components/market/research-table";
import type { ResearchStock } from "@/lib/types";

const storageKey = "alphaforge-watchlist";
const defaultSymbols = ["NVDA", "MSFT", "LLY"];

function readInitialSymbols() {
  if (typeof window === "undefined") return defaultSymbols;

  const saved = window.localStorage.getItem(storageKey);
  if (!saved) return defaultSymbols;

  try {
    return JSON.parse(saved) as string[];
  } catch {
    return defaultSymbols;
  }
}

export function WatchlistClient({ stocks }: { stocks: ResearchStock[] }) {
  const [symbols, setSymbols] = useState<string[]>(readInitialSymbols);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(symbols));
  }, [symbols]);

  const watched = useMemo(
    () => stocks.filter((stock) => symbols.includes(stock.symbol)),
    [stocks, symbols]
  );
  const available = stocks.filter((stock) => !symbols.includes(stock.symbol));

  return (
    <div className="grid gap-5">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-lg border-white/10 bg-zinc-950/70 md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="size-5 text-amber-300" aria-hidden />
              Intelligent Watchlist
            </CardTitle>
          </CardHeader>
          <CardContent>
            {watched.length > 0 ? <ResearchTable stocks={watched} /> : <p className="text-sm text-muted-foreground">No symbols saved yet.</p>}
          </CardContent>
        </Card>
        <Card className="rounded-lg border-white/10 bg-zinc-950/70">
          <CardHeader>
            <CardTitle>Add Signals</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {available.map((stock) => (
              <div key={stock.symbol} className="flex items-center justify-between gap-3 rounded-lg border border-white/10 p-3">
                <div>
                  <p className="font-medium">{stock.symbol}</p>
                  <p className="text-xs text-muted-foreground">{stock.recommendationLabel}</p>
                </div>
                <Button size="icon-sm" variant="outline" onClick={() => setSymbols((current) => [...current, stock.symbol])} aria-label={`Add ${stock.symbol}`}>
                  <Plus className="size-4" aria-hidden />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      <Card className="rounded-lg border-white/10 bg-zinc-950/70">
        <CardHeader>
          <CardTitle>What Changed Today?</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          {watched.map((stock) => (
            <div key={stock.symbol} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/10 p-3">
              <div>
                <p className="font-medium">
                  {stock.symbol}: {stock.shortTermScore > stock.longTermScore ? "short-term setup improved" : "long-term quality remains dominant"}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{stock.whyNot[1]}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{stock.confidence}</Badge>
                <Button asChild size="icon-sm" variant="ghost" aria-label={`Open ${stock.symbol}`}>
                  <Link href={`/stocks/${stock.symbol}`}>
                    <ArrowUpRight className="size-4" aria-hidden />
                  </Link>
                </Button>
                <Button size="icon-sm" variant="ghost" onClick={() => setSymbols((current) => current.filter((symbol) => symbol !== stock.symbol))} aria-label={`Remove ${stock.symbol}`}>
                  <X className="size-4" aria-hidden />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
