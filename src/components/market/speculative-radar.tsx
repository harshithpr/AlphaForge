import {
  AlertTriangle,
  Atom,
  BrainCircuit,
  Cpu,
  Flame,
  GitBranch,
  Radar,
  ShieldAlert,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ClickableCard } from "@/components/market/clickable-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatMarketCap, formatPercent } from "@/lib/format";
import type {
  EmergingNarrative,
  PennyStockSignal,
  SpeculativeSignal,
  SupplyChainLink,
} from "@/lib/types";

function riskTone(value: number) {
  if (value >= 80) return "text-rose-300";
  if (value >= 65) return "text-amber-200";
  if (value >= 45) return "text-sky-200";
  return "text-emerald-300";
}

function convictionTone(value: SpeculativeSignal["aiConviction"]) {
  if (value === "High") return "border-emerald-400/35 bg-emerald-400/10 text-emerald-200";
  if (value === "Medium") return "border-sky-400/35 bg-sky-400/10 text-sky-200";
  if (value === "Speculative") return "border-amber-400/35 bg-amber-400/10 text-amber-200";
  return "border-zinc-400/35 bg-zinc-400/10 text-zinc-200";
}

function MetricBar({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: number;
  tone?: "default" | "risk";
}) {
  return (
    <div className="grid gap-1.5">
      <div className="flex items-center justify-between gap-3 text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className={tone === "risk" ? riskTone(value) : "font-mono text-foreground"}>{value}</span>
      </div>
      <Progress value={value} aria-label={`${label}: ${value} out of 100`} />
    </div>
  );
}

export function SpeculativeRadar({
  signals,
  pennyStocks,
  narratives,
  supplyChains,
}: {
  signals: SpeculativeSignal[];
  pennyStocks: PennyStockSignal[];
  narratives: EmergingNarrative[];
  supplyChains: SupplyChainLink[];
}) {
  const multibaggers = signals
    .filter((signal) => signal.marketCap < 5_000_000_000 && signal.narrativeStrength >= 70)
    .slice(0, 3);
  const undervaluedAi = signals
    .filter((signal) => signal.hypeScore - signal.fundamentalsScore < 35 && signal.survivalProbability >= 55)
    .slice(0, 3);
  const bubbleRisk = Math.round(
    signals.reduce((total, signal) => total + signal.bubbleRisk, 0) / signals.length
  );

  return (
    <section className="grid gap-5 rounded-lg border border-amber-400/20 bg-[linear-gradient(180deg,rgba(251,191,36,0.10),rgba(9,9,11,0.72))] p-4 md:p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="border-amber-400/35 bg-amber-400/10 text-amber-200" variant="outline">
              Separate speculative lane
            </Badge>
            <Badge className="border-rose-400/35 bg-rose-400/10 text-rose-200" variant="outline">
              Not normal recommendations
            </Badge>
          </div>
          <h2 className="mt-3 text-2xl font-semibold">AI & Semiconductor High Risk / High Reward</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
            This area tracks exciting but unstable themes: small AI companies, semiconductor
            suppliers, robotics, quantum, AI infrastructure, GPU ecosystem exposure, and edge AI.
          </p>
        </div>
        <div className="rounded-lg border border-rose-400/25 bg-rose-400/10 p-3 text-sm text-rose-100">
          <p className="font-medium">Speculation warning</p>
          <p className="mt-1 max-w-sm text-xs leading-5 text-rose-100/75">
            High volatility, financing risk, hype cycles, and high failure probability. These are
            watchlist signals, not buy instructions.
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {signals.slice(0, 6).map((signal) => (
          <ClickableCard key={signal.symbol} href={`/stocks/${signal.symbol}`} className="bg-zinc-950/72 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xl font-semibold">{signal.symbol}</p>
                <p className="mt-1 text-sm text-muted-foreground">{signal.name}</p>
              </div>
              <Badge className={convictionTone(signal.aiConviction)} variant="outline">
                AI Conviction: {signal.aiConviction}
              </Badge>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="secondary">{signal.theme}</Badge>
              <span>{formatMarketCap(signal.marketCap)}</span>
              <span className={signal.changePercent >= 0 ? "text-emerald-300" : "text-rose-300"}>
                {formatPercent(signal.changePercent)}
              </span>
            </div>
            <div className="mt-4 grid gap-3">
              <MetricBar label="Volatility meter" value={signal.volatility} tone="risk" />
              <MetricBar label="Hype score" value={signal.hypeScore} tone="risk" />
              <MetricBar label="Fundamentals" value={signal.fundamentalsScore} />
              <MetricBar label="Institutional interest" value={signal.institutionalInterest} />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
              <div className="rounded-lg border border-white/10 p-2">
                <p className="text-muted-foreground">Runway</p>
                <p className="mt-1 font-mono">{signal.cashRunwayMonths} mo</p>
              </div>
              <div className="rounded-lg border border-white/10 p-2">
                <p className="text-muted-foreground">Dilution</p>
                <p className="mt-1">{signal.dilutionRisk}</p>
              </div>
              <div className="rounded-lg border border-white/10 p-2">
                <p className="text-muted-foreground">Survival</p>
                <p className="mt-1 font-mono">{signal.survivalProbability}</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-zinc-300">{signal.signal}</p>
            <div className="mt-4 rounded-lg border border-white/10 p-3">
              <div className="flex items-center justify-between gap-3 text-xs">
                <span className="text-muted-foreground">Hype vs Fundamentals</span>
                <span className="font-mono">
                  {signal.hypeScore}/{signal.fundamentalsScore}
                </span>
              </div>
              <div className="mt-2 grid gap-1">
                <Progress value={signal.hypeScore} aria-label={`${signal.symbol} hype score`} />
                <Progress value={signal.fundamentalsScore} aria-label={`${signal.symbol} fundamentals score`} />
              </div>
            </div>
          </ClickableCard>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <Card className="rounded-lg border-rose-400/20 bg-zinc-950/72">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="size-5 text-rose-300" aria-hidden />
              Penny Stock Scanner
            </CardTitle>
            <p className="text-sm leading-6 text-muted-foreground">
              Extremely speculative. High volatility. High failure probability.
            </p>
          </CardHeader>
          <CardContent className="grid gap-3">
            {pennyStocks.map((stock) => (
              <ClickableCard key={stock.symbol} href={`/stocks/${stock.symbol}`} className="p-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{stock.symbol}</p>
                    <p className="text-xs text-muted-foreground">{stock.name}</p>
                  </div>
                  <Badge className="border-rose-400/35 bg-rose-400/10 text-rose-200" variant="outline">
                    ${stock.price.toFixed(2)}
                  </Badge>
                </div>
                <div className="mt-3 grid gap-2 md:grid-cols-2">
                  <MetricBar label="Volume spike" value={stock.volumeSpike} />
                  <MetricBar label="Social momentum" value={stock.socialMomentum} />
                  <MetricBar label="Financing risk" value={stock.financingRisk} tone="risk" />
                  <MetricBar label="Dilution probability" value={stock.dilutionProbability} tone="risk" />
                </div>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{stock.warning}</p>
              </ClickableCard>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-lg border-white/10 bg-zinc-950/72">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Radar className="size-5 text-sky-300" aria-hidden />
              Emerging Tech Radar
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {narratives.map((narrative) => (
              <ClickableCard key={narrative.theme} href="/trending" className="p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium">{narrative.theme}</p>
                  <Badge variant="outline">{narrative.momentum}</Badge>
                </div>
                <div className="mt-3">
                  <MetricBar label="Narrative strength" value={narrative.strength} />
                </div>
                <p className="mt-3 text-xs leading-5 text-muted-foreground">
                  Tracks: {narrative.trackedAreas.join(", ")}.
                </p>
                <p className="mt-2 text-xs leading-5 text-amber-100/80">{narrative.riskNote}</p>
              </ClickableCard>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <ClickableCard href="/high-risk" className="bg-zinc-950/72 p-4">
          <p className="flex items-center gap-2 font-medium">
            <ShieldAlert className="size-5 text-amber-300" aria-hidden />
            AI Bubble Risk Detector
          </p>
          <p className="mt-3 text-4xl font-semibold tabular-nums">{bubbleRisk}</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Watches valuation excess, unsustainable momentum, and extreme sentiment. High readings
            lower confidence instead of boosting hype.
          </p>
          <div className="mt-4">
            <MetricBar label="Sector overheating" value={bubbleRisk} tone="risk" />
          </div>
        </ClickableCard>

        <ClickableCard href="/high-risk" className="bg-zinc-950/72 p-4">
          <p className="flex items-center gap-2 font-medium">
            <TrendingUp className="size-5 text-emerald-300" aria-hidden />
            Possible Multibagger Watch
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Filters for small market cap, strong narrative momentum, volume expansion, and improving
            evidence. Failure probability remains high.
          </p>
          <div className="mt-4 grid gap-2">
            {multibaggers.map((signal) => (
              <div key={signal.symbol} className="flex items-center justify-between rounded-lg border border-white/10 p-2 text-sm">
                <span>{signal.symbol}</span>
                <span className="font-mono text-amber-200">{signal.narrativeStrength}</span>
              </div>
            ))}
          </div>
        </ClickableCard>

        <ClickableCard href="/speculative" className="bg-zinc-950/72 p-4">
          <p className="flex items-center gap-2 font-medium">
            <BrainCircuit className="size-5 text-sky-300" aria-hidden />
            Undervalued AI Scanner
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Looks for AI exposure where hype is not wildly ahead of fundamentals and survival risk
            is not the dominant variable.
          </p>
          <div className="mt-4 grid gap-2">
            {undervaluedAi.map((signal) => (
              <div key={signal.symbol} className="flex items-center justify-between rounded-lg border border-white/10 p-2 text-sm">
                <span>{signal.symbol}</span>
                <span className="font-mono text-emerald-200">
                  {signal.hypeScore}/{signal.fundamentalsScore}
                </span>
              </div>
            ))}
          </div>
        </ClickableCard>
      </div>

      <Card className="rounded-lg border-white/10 bg-zinc-950/72">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="size-5 text-emerald-300" aria-hidden />
            Semiconductor Supply Chain Map
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 lg:grid-cols-3">
          {supplyChains.map((link) => (
            <ClickableCard key={link.chain} href="/sectors/semiconductors" className="p-3">
              <p className="font-mono text-sm text-emerald-200">{link.chain}</p>
              <p className="mt-2 flex items-center gap-2 text-sm font-medium">
                <Cpu className="size-4 text-sky-300" aria-hidden />
                {link.theme}
              </p>
              <div className="mt-3">
                <MetricBar label="Chain strength" value={link.strength} />
              </div>
              <p className="mt-3 flex gap-2 text-xs leading-5 text-muted-foreground">
                <Flame className="mt-0.5 size-3.5 shrink-0 text-amber-300" aria-hidden />
                {link.risk}
              </p>
            </ClickableCard>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <ClickableCard href="/speculative" className="bg-zinc-950/72 p-4">
          <p className="flex items-center gap-2 font-medium">
            <Atom className="size-5 text-sky-300" aria-hidden />
            Quantum Computing Watchlist
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            IonQ, Rigetti, D-Wave, and Quantum Computing Inc. should be tracked by contracts,
            research milestones, government funding, runway, and dilution risk.
          </p>
        </ClickableCard>
        <ClickableCard href="/sectors/semiconductors" className="bg-zinc-950/72 p-4">
          <p className="flex items-center gap-2 font-medium">
            <Cpu className="size-5 text-emerald-300" aria-hidden />
            AI Infrastructure Tracker
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Watch data centers, cooling, power demand, networking chips, fiber optics, and AI
            server supply chains. This is where quieter capital flow can show up first.
          </p>
        </ClickableCard>
      </div>
    </section>
  );
}
