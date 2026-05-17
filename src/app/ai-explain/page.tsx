import { BrainCircuit, CheckCircle2, CircleSlash, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/market/app-shell";
import { ScoreBreakdown } from "@/components/market/score-breakdown";
import { StockExplainBox } from "@/components/market/stock-explain-box";
import { TruthSocialPanel } from "@/components/market/truth-social-panel";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { stocks } from "@/lib/mock-data";

export default function AiExplanationPage() {
  const stock = stocks[0];

  return (
    <AppShell>
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 md:px-6 md:py-8">
        <StockExplainBox />

        <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
          <Card className="rounded-lg border-white/10 bg-zinc-950/70">
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <CardTitle className="flex items-center gap-2 text-3xl">
                    <BrainCircuit className="size-7 text-emerald-300" aria-hidden />
                    AI Explanation Layer
                  </CardTitle>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                    AI reads the scoring output and source summaries. It does not pick stocks,
                    override rules, invent data, or personalize allocation advice.
                  </p>
                </div>
                <Badge className="border-emerald-400/35 bg-emerald-400/10 text-emerald-200" variant="outline">
                  Explain only
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="grid gap-5">
              <div className="rounded-lg border border-white/10 p-4">
                <p className="text-sm text-muted-foreground">Example explanation</p>
                <p className="mt-3 text-lg leading-8">
                  {stock.symbol} ranks high because revenue growth, earnings strength, and sector
                  momentum are strong, but valuation risk and volatility keep confidence from becoming
                  automatic.
                </p>
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-lg border border-emerald-400/20 bg-emerald-400/10 p-4">
                  <CheckCircle2 className="size-5 text-emerald-300" aria-hidden />
                  <p className="mt-3 text-sm font-medium">Allowed</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">Summaries, bull/bear cases, risk themes, and readable explanations.</p>
                </div>
                <div className="rounded-lg border border-rose-400/20 bg-rose-400/10 p-4">
                  <CircleSlash className="size-5 text-rose-300" aria-hidden />
                  <p className="mt-3 text-sm font-medium">Blocked</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">Guaranteed picks, personalized allocations, raw AI rankings, or profit promises.</p>
                </div>
                <div className="rounded-lg border border-sky-400/20 bg-sky-400/10 p-4">
                  <ShieldCheck className="size-5 text-sky-300" aria-hidden />
                  <p className="mt-3 text-sm font-medium">Audited</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">Every output should cite inputs, weights, data age, and confidence limitations.</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <TruthSocialPanel />
        </div>

        <Card className="rounded-lg border-white/10 bg-zinc-950/70">
          <CardHeader>
            <CardTitle>What The Model Sees</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="long">
              <TabsList>
                <TabsTrigger value="long">Long-term factors</TabsTrigger>
                <TabsTrigger value="short">Short-term factors</TabsTrigger>
              </TabsList>
              <TabsContent value="long" className="mt-4">
                <ScoreBreakdown factors={Object.values(stock.longTermBreakdown)} />
              </TabsContent>
              <TabsContent value="short" className="mt-4">
                <ScoreBreakdown factors={Object.values(stock.shortTermBreakdown)} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
