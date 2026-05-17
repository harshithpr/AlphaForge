import { BrainCircuit, Clock, Database, Scale } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ClickableCard } from "@/components/market/clickable-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MarketState } from "@/lib/types";

export function MarketBrain({ market }: { market: MarketState }) {
  return (
    <Card className="rounded-lg border-white/10 bg-zinc-950/70">
      <CardHeader className="flex-row items-start justify-between gap-4">
        <div>
          <CardTitle className="flex items-center gap-2">
            <BrainCircuit className="size-5 text-emerald-300" aria-hidden />
            Market Brain
          </CardTitle>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
            Current state is {market.regime.toLowerCase()}: selective momentum is allowed, but
            confidence is capped when volatility, rates, or geopolitical headlines deteriorate.
          </p>
        </div>
        <Badge variant="outline" className="border-sky-400/35 bg-sky-400/10 text-sky-200">
          {market.mood}
        </Badge>
      </CardHeader>
      <CardContent className="grid gap-4 2xl:grid-cols-3">
        <ClickableCard href="/market-breadth" className="p-4">
          <p className="flex items-center gap-2 text-sm font-medium">
            <Scale className="size-4 text-sky-300" aria-hidden />
            Primary Drivers
          </p>
          <ul className="mt-3 grid gap-2 text-sm leading-6 text-muted-foreground">
            {market.drivers.map((driver) => (
              <li key={driver}>{driver}</li>
            ))}
          </ul>
        </ClickableCard>
        <ClickableCard
          href="/sectors/semiconductors"
          className="min-w-0 overflow-hidden p-4"
        >
          <p className="flex items-center gap-2 text-sm font-medium">
            <Database className="size-4 text-emerald-300" aria-hidden />
            Attractive Areas
          </p>
          <h3 className="mt-3 min-w-0 break-words text-3xl font-semibold leading-tight tracking-tight sm:text-4xl xl:text-3xl 2xl:text-4xl">
            {market.mostBullishSector}
          </h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Weakest breadth today: {market.mostBearishSector}. Ranking confidence falls when sector
            leadership narrows.
          </p>
        </ClickableCard>
        <ClickableCard
          href="/risk"
          className="p-4"
        >
          <p className="flex items-center gap-2 text-sm font-medium">
            <Clock className="size-4 text-amber-300" aria-hidden />
            Biggest Risks
          </p>
          <ul className="mt-3 grid gap-2 text-sm leading-6 text-muted-foreground">
            {market.risks.map((risk) => (
              <li key={risk}>{risk}</li>
            ))}
          </ul>
        </ClickableCard>
      </CardContent>
    </Card>
  );
}
