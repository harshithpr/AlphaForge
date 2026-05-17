import { AppShell } from "@/components/market/app-shell";
import { LiveMarketSearch } from "@/components/market/live-market-search";
import { ScreenerClient } from "@/components/market/screener-client";
import { stocks } from "@/lib/mock-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function ScreenerPage() {
  return (
    <AppShell>
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 md:px-6 md:py-8">
        <div>
          <h1 className="break-words text-3xl font-semibold sm:text-4xl xl:text-4xl">Global Market Screener</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Search global symbols across major exchanges. Use the live lookup for the broad provider
            universe; the ranked table below is the fast scored research sample until a licensed
            full-universe database is connected.
          </p>
        </div>
        <LiveMarketSearch />
        <ScreenerClient stocks={stocks} />
      </div>
    </AppShell>
  );
}
