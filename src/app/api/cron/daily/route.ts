import { getCronAuthError } from "@/lib/cron";
import { databaseMode } from "@/lib/db";

export async function GET(request: Request) {
  const authError = getCronAuthError(request);
  if (authError) return authError;

  return Response.json({
    ok: true,
    job: "daily-fundamentals",
    mode: databaseMode(),
    refreshedAt: new Date().toISOString(),
    actions: [
      "Refresh fundamentals, filings, macro series, and sector leadership.",
      "Rebuild market state classification.",
      "Store explainability artifacts and source freshness metadata.",
    ],
  });
}
