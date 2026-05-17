import { AppShell } from "@/components/market/app-shell";
import { TradingViewTerminal } from "@/components/market/trading-view-terminal";

export default async function ResearchPage({
  searchParams,
}: {
  searchParams: Promise<{ symbol?: string }>;
}) {
  const { symbol } = await searchParams;
  const researchSymbol = symbol || "NASDAQ:NVDA";

  return (
    <AppShell>
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 md:px-6 md:py-8">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-cyan-200">
            Research tools
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
            Live Research Terminal
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">
            Use <span className="font-mono text-foreground">/research?symbol=NASDAQ:NVDA</span> to
            open a full charting workspace for any supported market symbol.
          </p>
        </div>
        <TradingViewTerminal key={researchSymbol} symbol={researchSymbol} />
      </div>
    </AppShell>
  );
}
