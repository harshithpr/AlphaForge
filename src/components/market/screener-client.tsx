"use client";

import { useMemo, useState } from "react";
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
import { ResearchTable } from "@/components/market/research-table";
import type { ResearchStock } from "@/lib/types";

export function ScreenerClient({ stocks }: { stocks: ResearchStock[] }) {
  const [query, setQuery] = useState("");
  const [sector, setSector] = useState("all");
  const [timeframe, setTimeframe] = useState("all");
  const [risk, setRisk] = useState("all");
  const [minimumScore, setMinimumScore] = useState("60");

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
        <div className="flex items-center justify-between px-3 py-2">
          <p className="text-sm text-muted-foreground">{filtered.length} matches</p>
          <Badge variant="outline">Global universe API-ready</Badge>
        </div>
        <ResearchTable stocks={filtered} />
      </div>
    </div>
  );
}
