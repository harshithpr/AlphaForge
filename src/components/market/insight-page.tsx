import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { AppShell } from "@/components/market/app-shell";
import { ClickableCard } from "@/components/market/clickable-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type InsightPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  metrics: { label: string; value: string; detail: string }[];
  notes: string[];
};

export function InsightPage({ eyebrow, title, description, metrics, notes }: InsightPageProps) {
  return (
    <AppShell>
      <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-6 md:px-6 md:py-8">
        <Button asChild variant="ghost" size="sm" className="w-fit">
          <Link href="/dashboard">
            <ArrowLeft className="size-4" aria-hidden />
            Dashboard
          </Link>
        </Button>
        <section className="rounded-lg border border-white/10 bg-[#0E1628]/70 p-6">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-cyan-200">{eyebrow}</p>
          <h1 className="mt-4 max-w-4xl break-words text-3xl font-semibold tracking-tight sm:text-4xl xl:text-4xl">{title}</h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-muted-foreground md:text-lg">
            {description}
          </p>
        </section>
        <div className="grid gap-4 md:grid-cols-3">
          {metrics.map((metric) => (
            <ClickableCard key={metric.label} href="/dashboard">
              <Card className="h-full border-0 bg-transparent shadow-none">
                <CardHeader>
                  <CardTitle className="text-sm text-muted-foreground">{metric.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="break-words text-3xl font-semibold tabular-nums">{metric.value}</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{metric.detail}</p>
                </CardContent>
              </Card>
            </ClickableCard>
          ))}
        </div>
        <Card className="rounded-lg border-white/10 bg-zinc-950/70">
          <CardHeader>
            <CardTitle>Why It Matters</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {notes.map((note) => (
              <p key={note} className="rounded-lg border border-white/10 p-3 text-sm leading-6 text-muted-foreground">
                {note}
              </p>
            ))}
            <a
              href="/api/market-state"
              className="mt-2 flex w-fit items-center gap-2 text-sm text-cyan-200 hover:text-cyan-100"
            >
              View live API payload
              <ExternalLink className="size-4" aria-hidden />
            </a>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
