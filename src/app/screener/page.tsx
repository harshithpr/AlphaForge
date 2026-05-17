import { AppShell } from "@/components/market/app-shell";
import { ScreenerClient } from "@/components/market/screener-client";
import { stocks } from "@/lib/mock-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function ScreenerPage() {
  return (
    <AppShell>
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 md:px-6 md:py-8">
        <div>
          <h1 className="text-4xl font-semibold">Global Market Screener</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Search equities across major global exchanges using live market data. Results may vary
            during active trading hours. Demo rankings remain visible until a global provider key is
            connected.
          </p>
        </div>
        <ScreenerClient stocks={stocks} />
      </div>
    </AppShell>
  );
}
