import Link from "next/link";
import { ArrowUpRight, BadgeCheck, TriangleAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatMarketCap, formatPercent, labelTone } from "@/lib/format";
import type { LiveQuote } from "@/components/market/research-table";
import type { ResearchStock } from "@/lib/types";

export function StockCard({
  stock,
  mode,
  quote,
}: {
  stock: ResearchStock;
  mode: "long" | "short";
  quote?: LiveQuote;
}) {
  const score = mode === "long" ? stock.longTermScore : stock.shortTermScore;
  const scoreLabel = mode === "long" ? "Long-term" : "Short-term";
  const price = quote?.price ?? stock.price;
  const changePercent = quote?.changePercent ?? stock.changePercent;

  return (
    <Link href={`/stocks/${stock.symbol}`} className="group block min-w-0 rounded-lg">
      <Card className="h-full rounded-lg border-white/10 bg-zinc-950/70 transition duration-200 group-hover:-translate-y-0.5 group-hover:border-cyan-400/60 group-hover:bg-cyan-400/5 group-hover:shadow-[0_0_28px_rgba(0,194,255,0.12)]">
        <CardHeader className="gap-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <CardTitle className="flex min-w-0 flex-wrap items-center gap-2">
                <span>{stock.symbol}</span>
                <span className="min-w-0 break-words text-sm font-normal text-muted-foreground">{stock.name}</span>
              </CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">
                {stock.sector} · {formatMarketCap(stock.marketCap)}
              </p>
            </div>
            <Badge className={labelTone(stock.recommendationLabel)} variant="outline">
              {stock.recommendationLabel}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-2xl font-semibold tabular-nums">${price.toFixed(2)}</p>
              <p className={changePercent >= 0 ? "text-sm text-emerald-300" : "text-sm text-rose-300"}>
                {formatPercent(changePercent)} today
              </p>
              {quote?.updatedAt ? (
                <p className="mt-1 text-[0.68rem] text-muted-foreground">
                  {quote.isLive === false ? "Fallback" : "Live"}{" "}
                  {new Date(quote.updatedAt).toLocaleTimeString()}
                </p>
              ) : null}
            </div>
            <div className="text-right">
              <p className="text-3xl font-semibold tabular-nums">{score}</p>
              <p className="text-xs text-muted-foreground">{scoreLabel} score</p>
            </div>
          </div>
          <Progress value={score} aria-label={`${stock.symbol} ${scoreLabel} score`} />
          <div className="grid gap-2 text-xs text-muted-foreground">
            <p className="flex items-center gap-2">
              <BadgeCheck className="size-3.5 text-emerald-300" aria-hidden />
              Confidence: {stock.confidence}
            </p>
            <p className="flex items-center gap-2">
              <TriangleAlert className="size-3.5 text-amber-300" aria-hidden />
              Risk: {stock.riskLevel}
            </p>
          </div>
          <p className="min-h-12 text-sm leading-6 text-zinc-300">{stock.whyThisPick}</p>
          <span className="inline-flex min-h-9 w-full items-center justify-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm transition group-hover:border-cyan-400/50 group-hover:text-cyan-100">
            Why this pick?
            <ArrowUpRight className="size-4" aria-hidden />
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}
