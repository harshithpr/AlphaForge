import { AppShell } from "@/components/market/app-shell";
import { ScreenerClient } from "@/components/market/screener-client";
import { stocks } from "@/lib/mock-data";

export default function ScreenerPage() {
  return (
    <AppShell>
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 md:px-6 md:py-8">
        <div>
          <h1 className="text-4xl font-semibold">Screener</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Filter by sector, risk, timeframe, and score. The production version can add market cap,
            P/E, revenue growth, dividend yield, liquidity, and data-source health filters.
          </p>
        </div>
        <ScreenerClient stocks={stocks} />
      </div>
    </AppShell>
  );
}
