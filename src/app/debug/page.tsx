import Link from "next/link";
import { Activity, ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import { AppShell } from "@/components/market/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const checks = [
  { label: "Database URL", present: Boolean(process.env.DATABASE_URL) },
  { label: "Cron secret", present: Boolean(process.env.CRON_SECRET) },
  { label: "OpenAI key", present: Boolean(process.env.OPENAI_API_KEY) },
  { label: "Clerk publishable key", present: Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) },
  { label: "Clerk secret key", present: Boolean(process.env.CLERK_SECRET_KEY) },
  { label: "FMP API key", present: Boolean(process.env.FMP_API_KEY) },
  { label: "Brave Search API key", present: Boolean(process.env.BRAVE_SEARCH_API_KEY) },
];

export default function DebugPage() {
  return (
    <AppShell>
      <div className="mx-auto grid w-full max-w-5xl gap-6 px-4 py-6 md:px-6 md:py-8">
        <Button asChild variant="ghost" size="sm" className="w-fit">
          <Link href="/dashboard">
            <ArrowLeft className="size-4" aria-hidden />
            Dashboard
          </Link>
        </Button>
        <section className="rounded-lg border border-white/10 bg-[#0E1628]/70 p-6">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-cyan-200">QA checklist</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">AlphaForge Debug</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
            Shows configuration presence only. It never prints secret values.
          </p>
        </section>
        <Card className="rounded-lg border-white/10 bg-zinc-950/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="size-5 text-cyan-300" aria-hidden />
              Runtime Checks
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            {checks.map((check) => (
              <div key={check.label} className="flex items-center justify-between rounded-lg border border-white/10 p-3 text-sm">
                <span>{check.label}</span>
                <span className={check.present ? "flex items-center gap-2 text-emerald-300" : "flex items-center gap-2 text-amber-300"}>
                  {check.present ? <CheckCircle2 className="size-4" aria-hidden /> : <XCircle className="size-4" aria-hidden />}
                  {check.present ? "Present" : "Missing"}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
