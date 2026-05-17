import { Activity, BarChart3, Database, History, Radar } from "lucide-react";
import { AppShell } from "@/components/market/app-shell";
import { AlphaForgeMark, AlphaForgeWordmark } from "@/components/market/brand-mark";
import { ClickableCard } from "@/components/market/clickable-card";
import { LiveMarketSearch } from "@/components/market/live-market-search";
import { MarketBrain } from "@/components/market/market-brain";
import { MarketPulse } from "@/components/market/market-pulse";
import { MarketStatusBanner } from "@/components/market/market-status-banner";
import { NewsFeed } from "@/components/market/news-feed";
import { ResearchTable } from "@/components/market/research-table";
import { SectorHeatmap } from "@/components/market/sector-heatmap";
import { SpeculativeRadar } from "@/components/market/speculative-radar";
import { StockCard } from "@/components/market/stock-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  backtests,
  emergingNarratives,
  latestNews,
  marketState,
  pennyStockSignals,
  sectors,
  speculativeSignals,
  stocks,
  supplyChainLinks,
} from "@/lib/mock-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function Home() {
  const longTerm = [...stocks].sort((a, b) => b.longTermScore - a.longTermScore).slice(0, 3);
  const shortTerm = [...stocks].sort((a, b) => b.shortTermScore - a.shortTermScore).slice(0, 3);

  return (
    <AppShell>
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 md:px-6 md:py-8">
        <MarketStatusBanner />

        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="hero-intelligence-field relative flex min-h-[470px] flex-col justify-between overflow-hidden rounded-lg border border-white/10 p-6">
            <div className="relative z-10 flex flex-wrap items-center gap-2">
              <Badge className="border-cyan-400/35 bg-cyan-400/10 text-cyan-100" variant="outline">
                Market intelligence operating system
              </Badge>
              <Badge variant="outline">Demo data · API-ready</Badge>
            </div>
            <div className="relative z-10">
              <div className="mb-8 flex items-center gap-4">
                <AlphaForgeMark className="size-14" />
                <AlphaForgeWordmark />
              </div>
              <h1 className="max-w-3xl text-3xl font-semibold leading-tight sm:text-4xl lg:text-4xl">
                Understand the market before the market understands itself.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-300 md:text-lg">
                AlphaForge scores fundamentals, momentum, sentiment, macro context, and risk
                controls, then separates stable research ideas from speculative emerging-tech
                signals.
              </p>
            </div>
            <div className="relative z-10 grid gap-3 md:grid-cols-3">
              <ClickableCard href="/screener" className="bg-[#070B14]/55 p-4 backdrop-blur">
                <Database className="size-5 text-cyan-300" aria-hidden />
                <p className="mt-3 text-sm font-medium">Multi-source inputs</p>
                <p className="mt-1 text-xs leading-5 text-zinc-400">Prices, fundamentals, filings, news, sentiment, and macro.</p>
              </ClickableCard>
              <ClickableCard href="/market-state" className="bg-[#070B14]/55 p-4 backdrop-blur">
                <Radar className="size-5 text-[#7A5CFF]" aria-hidden />
                <p className="mt-3 text-sm font-medium">Market state aware</p>
                <p className="mt-1 text-xs leading-5 text-zinc-400">Dynamic confidence changes with volatility and breadth.</p>
              </ClickableCard>
              <ClickableCard href="/research" className="bg-[#070B14]/55 p-4 backdrop-blur">
                <History className="size-5 text-amber-300" aria-hidden />
                <p className="mt-3 text-sm font-medium">Tracked outcomes</p>
                <p className="mt-1 text-xs leading-5 text-zinc-400">Scores are stored, backtested, and performance-audited.</p>
              </ClickableCard>
            </div>
          </div>
          <div className="grid gap-3">
            <MarketPulse market={marketState} />
            <MarketBrain market={marketState} />
          </div>
        </section>

        <LiveMarketSearch />

        <Tabs defaultValue="long" className="grid gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-semibold">Main Research Sections</h2>
              <p className="mt-1 text-sm text-muted-foreground">Core recommendations stay separate from speculative radar signals.</p>
            </div>
            <TabsList>
              <TabsTrigger value="long">Long-Term Investments</TabsTrigger>
              <TabsTrigger value="short">Short-Term Momentum</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="long" className="grid gap-4 md:grid-cols-3">
            {longTerm.map((stock) => <StockCard key={stock.symbol} stock={stock} mode="long" />)}
          </TabsContent>
          <TabsContent value="short" className="grid gap-4 md:grid-cols-3">
            {shortTerm.map((stock) => <StockCard key={stock.symbol} stock={stock} mode="short" />)}
          </TabsContent>
        </Tabs>

        <SpeculativeRadar
          signals={speculativeSignals}
          pennyStocks={pennyStockSignals}
          narratives={emergingNarratives}
          supplyChains={supplyChainLinks}
        />

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <SectorHeatmap sectors={sectors} />
          <NewsFeed news={latestNews.slice(0, 5)} />
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <Card className="rounded-lg border-white/10 bg-zinc-950/70">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="size-5 text-sky-300" aria-hidden />
                Full Ranking Table
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResearchTable stocks={stocks} />
            </CardContent>
          </Card>
          <Card className="rounded-lg border-white/10 bg-zinc-950/70">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="size-5 text-emerald-300" aria-hidden />
                Predictive Testing
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              {backtests.map((test) => (
                <ClickableCard key={`${test.engine}-${test.period}`} href="/research" className="p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium">{test.engine}</p>
                    <Badge variant="outline">{test.period}</Badge>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                    <p className="text-muted-foreground">Win rate <span className="font-mono text-foreground">{test.winRate}%</span></p>
                    <p className="text-muted-foreground">Avg return <span className="font-mono text-foreground">{test.averageReturn}%</span></p>
                    <p className="text-muted-foreground">Drawdown <span className="font-mono text-foreground">{test.maxDrawdown}%</span></p>
                    <p className="text-muted-foreground">Sharpe <span className="font-mono text-foreground">{test.sharpe}</span></p>
                  </div>
                </ClickableCard>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
