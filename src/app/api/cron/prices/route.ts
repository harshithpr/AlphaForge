import { getCronAuthError } from "@/lib/cron";
import { databaseMode } from "@/lib/db";

export async function GET(request: Request) {
  const authError = getCronAuthError(request);
  if (authError) return authError;

  return Response.json({
    ok: true,
    job: "prices",
    mode: databaseMode(),
    refreshedAt: new Date().toISOString(),
    actions: [
      "Fetch latest bars from Polygon/Finnhub/Twelve Data adapters.",
      "Cross-check stale or divergent quotes.",
      "Persist price snapshots and volume anomalies.",
    ],
  });
}
