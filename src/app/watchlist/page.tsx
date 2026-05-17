import { AppShell } from "@/components/market/app-shell";
import { WatchlistClient } from "@/components/market/watchlist-client";
import { stocks } from "@/lib/mock-data";

export default function WatchlistPage() {
  return (
    <AppShell>
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 md:px-6 md:py-8">
        <div>
          <h1 className="text-4xl font-semibold">Watchlist</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Saved symbols get daily change explanations, risk drift, confidence shifts, and source
            freshness checks. This MVP stores the list locally; auth-backed persistence is ready for
            Clerk, Supabase Auth, or database users.
          </p>
        </div>
        <WatchlistClient stocks={stocks} />
      </div>
    </AppShell>
  );
}
