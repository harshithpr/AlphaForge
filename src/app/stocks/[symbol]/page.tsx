import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, ExternalLink, ShieldAlert } from "lucide-react";
import { AppShell } from "@/components/market/app-shell";
import { NewsFeed } from "@/components/market/news-feed";
import { PriceChart } from "@/components/market/price-chart";
import { ScoreBreakdown } from "@/components/market/score-breakdown";
import { ScoreMeter } from "@/components/market/score-meter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatMarketCap, formatPercent, labelTone } from "@/lib/format";
import { stocks } from "@/lib/mock-data";

export function generateStaticParams() {
  return stocks.map((stock) => ({ symbol: stock.symbol }));
}

export default async function StockPage({ params }: { params: Promise<{ symbol: string }> }) {
  const { symbol } = await params;
  const stock = stocks.find((candidate) => candidate.symbol === symbol.toUpperCase());

  if (!stock) {
    notFound();
  }

  const longFactors = Object.values(stock.longTermBreakdown);
  const shortFactors = Object.values(stock.shortTermBreakdown);

  return (
    <AppShell>
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 md:px-6 md:py-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button asChild variant="ghost" size="sm">
            <Link href="/">
              <ArrowLeft className="size-4" aria-hidden />
              Dashboard
            </Link>
          </Button>
          <Badge className={labelTone(stock.recommendationLabel)} variant="outline">
            {stock.recommendationLabel}
          </Badge>
        </div>

        <section className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <Card className="rounded-lg border-white/10 bg-zinc-950/70">
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">{stock.sector} · {stock.industry}</p>
                  <h1 className="mt-2 text-4xl font-semibold">{stock.symbol}</h1>
                  <p className="mt-1 text-lg text-muted-foreground">{stock.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-semibold tabular-nums">${stock.price.toFixed(2)}</p>
                  <p className={stock.changePercent >= 0 ? "text-sm text-emerald-300" : "text-sm text-rose-300"}>
                    {formatPercent(stock.changePercent)} today
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <PriceChart data={stock.priceHistory} />
            </CardContent>
          </Card>

          <div className="grid gap-4">
            <Card className="rounded-lg border-white/10 bg-zinc-950/70">
              <CardHeader>
                <CardTitle>Score Summary</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-5">
                <ScoreMeter score={stock.longTermScore} label="Long-term" tone="emerald" />
                <ScoreMeter score={stock.shortTermScore} label="Short-term" tone="sky" />
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-lg border border-white/10 p-3">
                    <p className="text-muted-foreground">Confidence</p>
                    <p className="mt-1 font-semibold">{stock.confidence}</p>
                  </div>
                  <div className="rounded-lg border border-white/10 p-3">
                    <p className="text-muted-foreground">Risk level</p>
                    <p className="mt-1 font-semibold">{stock.riskLevel}</p>
                  </div>
                  <div className="rounded-lg border border-white/10 p-3">
                    <p className="text-muted-foreground">Market cap</p>
                    <p className="mt-1 font-mono font-semibold">{formatMarketCap(stock.marketCap)}</p>
                  </div>
                  <div className="rounded-lg border border-white/10 p-3">
                    <p className="text-muted-foreground">Best for</p>
                    <p className="mt-1 font-semibold">{stock.bestFor}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="rounded-lg border-white/10 bg-zinc-950/70">
            <CardHeader>
              <CardTitle>Why This Pick?</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-5">
              <p className="text-lg leading-8 text-zinc-200">{stock.whyThisPick}</p>
              <div className="grid gap-3">
                <p className="font-medium text-emerald-200">Bull case</p>
                {stock.bullCase.map((item) => (
                  <p key={item} className="rounded-lg border border-emerald-400/15 bg-emerald-400/10 p-3 text-sm leading-6 text-zinc-300">
                    {item}
                  </p>
                ))}
              </div>
              <div className="grid gap-3">
                <p className="font-medium text-amber-200">Why not?</p>
                {stock.whyNot.map((item) => (
                  <p key={item} className="rounded-lg border border-amber-400/15 bg-amber-400/10 p-3 text-sm leading-6 text-zinc-300">
                    {item}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-lg border-white/10 bg-zinc-950/70">
            <CardHeader>
              <CardTitle>Explainable Scoring</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="long">
                <TabsList>
                  <TabsTrigger value="long">Long-term</TabsTrigger>
                  <TabsTrigger value="short">Short-term</TabsTrigger>
                </TabsList>
                <TabsContent value="long" className="mt-4">
                  <ScoreBreakdown factors={longFactors} />
                </TabsContent>
                <TabsContent value="short" className="mt-4">
                  <ScoreBreakdown factors={shortFactors} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
          <NewsFeed news={stock.news} />
          <Card className="rounded-lg border-white/10 bg-zinc-950/70">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="size-5 text-sky-300" aria-hidden />
                Key Dates & Sources
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-5">
              <div className="grid gap-2">
                {stock.upcomingDates.map((date) => (
                  <div key={date} className="rounded-lg border border-white/10 p-3 text-sm">
                    {date}
                  </div>
                ))}
              </div>
              <div className="grid gap-2">
                <p className="flex items-center gap-2 text-sm font-medium">
                  <ShieldAlert className="size-4 text-amber-300" aria-hidden />
                  Source trace
                </p>
                {stock.sourceLinks.map((source) => (
                  <a
                    key={source.label}
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between gap-3 rounded-lg border border-white/10 p-3 text-sm hover:border-sky-400/30"
                  >
                    <span>{source.label}</span>
                    <span className="flex items-center gap-2 text-muted-foreground">
                      {source.reliability}
                      <ExternalLink className="size-3.5" aria-hidden />
                    </span>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </AppShell>
  );
}
