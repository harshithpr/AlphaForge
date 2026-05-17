"use client";

import { FormEvent, useState } from "react";
import { ExternalLink, Globe2, Loader2, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatMarketCap, formatPercent } from "@/lib/format";

type QuoteDetail = {
  symbol: string;
  shortName?: string;
  longName?: string;
  regularMarketPrice?: number;
  regularMarketChangePercent?: number;
  regularMarketVolume?: number;
  marketCap?: number;
  exchange?: string;
  quoteType?: string;
};

type NewsResult = {
  title?: string;
  publisher?: string;
  link?: string;
  providerPublishTime?: number;
};

type WebResult = {
  title: string;
  url: string;
  description?: string;
};

type LiveSearchResponse = {
  ok: boolean;
  query: string;
  updatedAt: string;
  sources: string[];
  yahooError: string | null;
  webSearchNote: string;
  quoteDetails: QuoteDetail[];
  news: NewsResult[];
  webResults: WebResult[];
  disclaimer: string;
};

export function LiveMarketSearch() {
  const [query, setQuery] = useState("quantum AI");
  const [data, setData] = useState<LiveSearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function search(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/search/live?q=${encodeURIComponent(query.trim())}`, {
        cache: "no-store",
      });
      const payload = (await response.json()) as LiveSearchResponse & { error?: string };

      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || "Live search failed");
      }

      setData(payload);
    } catch (searchError) {
      setError(searchError instanceof Error ? searchError.message : "Live search failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="rounded-lg border-cyan-400/20 bg-[#0E1628]/78">
      <CardHeader className="gap-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Globe2 className="size-5 text-cyan-300" aria-hidden />
              Live Market Web Search
            </CardTitle>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              Search beyond the curated stock list. Server-side lookup can pull live market symbols,
              quotes, news, and optional broad web results when a search API key is configured.
            </p>
          </div>
          <Badge className="border-cyan-400/35 bg-cyan-400/10 text-cyan-100" variant="outline">
            Live server route
          </Badge>
        </div>
        <form onSubmit={search} className="grid gap-2 md:grid-cols-[1fr_auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-2.5 size-4 text-muted-foreground" aria-hidden />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="pl-9"
              placeholder="Search stocks, AI themes, quantum, defense tech, macro risks..."
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Search className="size-4" aria-hidden />}
            Search live
          </Button>
        </form>
      </CardHeader>
      <CardContent className="grid gap-4">
        {error ? (
          <p className="rounded-lg border border-rose-400/30 bg-rose-400/10 p-3 text-sm text-rose-100">
            {error}
          </p>
        ) : null}
        {data ? (
          <>
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span>Updated {new Date(data.updatedAt).toLocaleTimeString()}</span>
              {data.sources.map((source) => (
                <Badge key={source} variant="outline">{source}</Badge>
              ))}
            </div>
            {data.yahooError ? (
              <p className="rounded-lg border border-amber-400/25 bg-amber-400/10 p-3 text-sm text-amber-100">
                {data.yahooError}
              </p>
            ) : null}
            <div className="grid gap-3 lg:grid-cols-3">
              {data.quoteDetails.slice(0, 6).map((quote) => (
                <div key={quote.symbol} className="rounded-lg border border-white/10 bg-[#070B14]/55 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{quote.symbol}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {quote.shortName || quote.longName || quote.quoteType || "Market result"}
                      </p>
                    </div>
                    <Badge variant="outline">{quote.exchange || quote.quoteType || "Live"}</Badge>
                  </div>
                  <div className="mt-3 flex items-end justify-between gap-3">
                    <p className="text-2xl font-semibold tabular-nums">
                      {typeof quote.regularMarketPrice === "number" ? `$${quote.regularMarketPrice.toFixed(2)}` : "N/A"}
                    </p>
                    <p className={typeof quote.regularMarketChangePercent === "number" && quote.regularMarketChangePercent >= 0 ? "text-sm text-emerald-300" : "text-sm text-rose-300"}>
                      {typeof quote.regularMarketChangePercent === "number" ? formatPercent(quote.regularMarketChangePercent) : ""}
                    </p>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Market cap: {quote.marketCap ? formatMarketCap(quote.marketCap) : "unknown"} · Volume:{" "}
                    {quote.regularMarketVolume?.toLocaleString() ?? "unknown"}
                  </p>
                </div>
              ))}
            </div>
            <div className="grid gap-3 lg:grid-cols-2">
              <div className="rounded-lg border border-white/10 p-3">
                <p className="mb-3 text-sm font-medium">Live News</p>
                <div className="grid gap-3">
                  {data.news.slice(0, 5).map((item) => (
                    <a
                      key={`${item.title}-${item.link}`}
                      href={item.link}
                      target="_blank"
                      rel="noreferrer"
                      className="group rounded-lg border border-white/10 p-3 hover:border-cyan-400/50 hover:bg-cyan-400/5"
                    >
                      <p className="flex items-start gap-2 text-sm font-medium">
                        {item.title}
                        <ExternalLink className="mt-0.5 size-3.5 shrink-0 opacity-60" aria-hidden />
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">{item.publisher}</p>
                    </a>
                  ))}
                </div>
              </div>
              <div className="rounded-lg border border-white/10 p-3">
                <p className="mb-3 text-sm font-medium">Broad Web Intelligence</p>
                <p className="mb-3 text-xs leading-5 text-muted-foreground">{data.webSearchNote}</p>
                <div className="grid gap-3">
                  {data.webResults.length > 0 ? data.webResults.map((item) => (
                    <a
                      key={item.url}
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="group rounded-lg border border-white/10 p-3 hover:border-cyan-400/50 hover:bg-cyan-400/5"
                    >
                      <p className="flex items-start gap-2 text-sm font-medium">
                        {item.title}
                        <ExternalLink className="mt-0.5 size-3.5 shrink-0 opacity-60" aria-hidden />
                      </p>
                      <p className="mt-1 text-xs leading-5 text-muted-foreground">{item.description}</p>
                    </a>
                  )) : (
                    <p className="rounded-lg border border-white/10 p-3 text-sm text-muted-foreground">
                      Add `BRAVE_SEARCH_API_KEY` to include full web results beside finance search.
                    </p>
                  )}
                </div>
              </div>
            </div>
            <p className="text-xs leading-5 text-muted-foreground">{data.disclaimer}</p>
          </>
        ) : (
          <p className="rounded-lg border border-white/10 p-3 text-sm text-muted-foreground">
            Try searches like `IONQ`, `defense AI`, `quantum computing`, `uranium`, or `AI data center cooling`.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
