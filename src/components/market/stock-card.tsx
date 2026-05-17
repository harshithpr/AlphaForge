import Link from "next/link";
import { ArrowUpRight, BadgeCheck, TriangleAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatMarketCap, formatPercent, labelTone } from "@/lib/format";
import type { ResearchStock } from "@/lib/types";

export function StockCard({ stock, mode }: { stock: ResearchStock; mode: "long" | "short" }) {
  const score = mode === "long" ? stock.longTermScore : stock.shortTermScore;
  const scoreLabel = mode === "long" ? "Long-term" : "Short-term";

  return (
    <Card className="rounded-lg border-white/10 bg-zinc-950/70">
      <CardHeader className="gap-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2">
              <span>{stock.symbol}</span>
              <span className="text-sm font-normal text-muted-foreground">{stock.name}</span>
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
        <div className="flex items-end justify-between">
          <div>
            <p className="text-2xl font-semibold tabular-nums">${stock.price.toFixed(2)}</p>
            <p className={stock.changePercent >= 0 ? "text-sm text-emerald-300" : "text-sm text-rose-300"}>
              {formatPercent(stock.changePercent)} today
            </p>
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
        <Button asChild variant="outline" size="sm" className="w-full">
          <Link href={`/stocks/${stock.symbol}`}>
            Why this pick?
            <ArrowUpRight className="size-4" aria-hidden />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
