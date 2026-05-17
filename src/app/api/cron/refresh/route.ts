import { getCronAuthError } from "@/lib/cron";
import { databaseMode } from "@/lib/db";
import { marketState, stocks } from "@/lib/mock-data";

function refreshResponse() {
  return Response.json({
    ok: true,
    job: "hobby-daily-refresh",
    mode: databaseMode(),
    refreshedAt: new Date().toISOString(),
    marketState: {
      regime: marketState.regime,
      fearGreed: marketState.fearGreed,
      vix: marketState.vix,
      macroRisk: marketState.macroRisk,
    },
    rankedSymbols: stocks.slice(0, 6).map((stock) => ({
      symbol: stock.symbol,
      longTermScore: stock.longTermScore,
      shortTermScore: stock.shortTermScore,
      label: stock.recommendationLabel,
      confidence: stock.confidence,
    })),
    actions: [
      "Refresh prices, news, macro context, and fundamentals in one daily Hobby-safe job.",
      "Recalculate long-term, short-term, confidence, and risk scores.",
      "Store score snapshots when DATABASE_URL is configured.",
      "Keep 15-minute refreshes reserved for future GitHub Actions or Vercel Pro.",
    ],
  });
}

export async function GET(request: Request) {
  const authError = getCronAuthError(request);
  if (authError) return authError;

  return refreshResponse();
}

export async function POST(request: Request) {
  const authError = getCronAuthError(request);
  if (authError) return authError;

  return refreshResponse();
}
