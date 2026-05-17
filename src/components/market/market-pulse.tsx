import Link from "next/link";
import { Activity, Gauge, LineChart, ShieldAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { MarketState } from "@/lib/types";

export function MarketPulse({ market }: { market: MarketState }) {
  const items = [
    { label: "Market State", value: market.regime, sub: market.mood, icon: Activity, href: "/market-state" },
    { label: "Fear & Greed", value: `${market.fearGreed}`, sub: market.fearGreedLabel, icon: Gauge, href: "/fear-greed" },
    { label: "Volatility", value: market.vix.toFixed(1), sub: "VIX proxy", icon: LineChart, href: "/volatility" },
    { label: "Macro Risk", value: `${market.macroRisk}`, sub: "Risk pressure", icon: ShieldAlert, href: "/macro-risk" },
  ];

  return (
    <section className="grid gap-3 md:grid-cols-4" aria-label="Market pulse">
      {items.map((item) => (
        <Link key={item.label} href={item.href} className="group block cursor-pointer rounded-lg">
          <Card className="h-full rounded-lg border-white/10 bg-zinc-950/70 transition duration-200 group-hover:-translate-y-0.5 group-hover:border-cyan-400/60 group-hover:bg-cyan-400/5 group-hover:shadow-[0_0_28px_rgba(0,194,255,0.12)]">
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm text-muted-foreground transition group-hover:text-cyan-100">
                {item.label}
              </CardTitle>
              <item.icon className="size-4 text-sky-300" aria-hidden />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold tabular-nums">{item.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{item.sub}</p>
              {item.label !== "Market State" ? (
                <Progress value={Number.parseFloat(item.value)} className="mt-3" aria-label={item.label} />
              ) : null}
            </CardContent>
          </Card>
        </Link>
      ))}
    </section>
  );
}
