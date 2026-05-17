import { getCronAuthError } from "@/lib/cron";
import { databaseMode } from "@/lib/db";

export async function GET(request: Request) {
  const authError = getCronAuthError(request);
  if (authError) return authError;

  return Response.json({
    ok: true,
    job: "news",
    mode: databaseMode(),
    refreshedAt: new Date().toISOString(),
    actions: [
      "Fetch licensed news feeds and RSS fallbacks.",
      "Apply source credibility, relevance, and sentiment decay.",
      "Update social/geopolitical signals when optional connectors are configured.",
    ],
  });
}
