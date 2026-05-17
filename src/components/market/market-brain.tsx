import Link from "next/link";
import { BrainCircuit, Clock, Database, Scale } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
        <div className="rounded-lg border border-white/10 p-4">
          <p className="flex items-center gap-2 text-sm font-medium">
            <Scale className="size-4 text-sky-300" aria-hidden />
            Primary Drivers
          </p>
          <ul className="mt-3 grid gap-2 text-sm leading-6 text-muted-foreground">
            {market.drivers.map((driver) => (
              <li key={driver}>{driver}</li>
            ))}
          </ul>
        </div>
        <Link
          href="/sectors/semiconductors"
          className="block cursor-pointer rounded-lg border border-white/10 p-4 transition duration-200 hover:-translate-y-0.5 hover:border-cyan-400/60 hover:bg-cyan-400/5 hover:shadow-[0_0_28px_rgba(0,194,255,0.12)]"
        >
          <p className="flex items-center gap-2 text-sm font-medium">
            <Database className="size-4 text-emerald-300" aria-hidden />
            Attractive Areas
          </p>
          <h3 className="text-sector-title mt-3 font-bold">{market.mostBullishSector}</h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Weakest breadth today: {market.mostBearishSector}. Ranking confidence falls when sector
            leadership narrows.
          </p>
        </Link>
        <Link
          href="/risk"
          className="block cursor-pointer rounded-lg border border-white/10 p-4 transition duration-200 hover:-translate-y-0.5 hover:border-cyan-400/60 hover:bg-cyan-400/5 hover:shadow-[0_0_28px_rgba(0,194,255,0.12)]"
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
        </Link>
      </CardContent>
    </Card>
  );
}
