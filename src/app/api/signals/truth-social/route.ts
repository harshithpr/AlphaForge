import { fetchTruthSocialSignals } from "@/lib/source-adapters";

export const dynamic = "force-dynamic";

export async function GET() {
  const feed = await fetchTruthSocialSignals();

  return Response.json({
    ok: true,
    ...feed,
    disclaimer:
      "Experimental social feed for geopolitical awareness only. Do not use a single social source as a recommendation engine.",
  });
}
