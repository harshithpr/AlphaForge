import { getCronAuthError } from "@/lib/cron";
import { databaseMode } from "@/lib/db";
import { stocks } from "@/lib/mock-data";

export async function GET(request: Request) {
  const authError = getCronAuthError(request);
  if (authError) return authError;

  return Response.json({
    ok: true,
    job: "score-recalculation",
    mode: databaseMode(),
    refreshedAt: new Date().toISOString(),
    rankedSymbols: stocks.map((stock) => ({
      symbol: stock.symbol,
      longTermScore: stock.longTermScore,
      shortTermScore: stock.shortTermScore,
      label: stock.recommendationLabel,
    })),
    actions: [
      "Recalculate long-term and short-term scores.",
      "Store historical score snapshots.",
      "Queue backtest and performance tracking updates.",
    ],
  });
}
