import { marketState, stocks } from "@/lib/mock-data";

export async function GET() {
  return Response.json({
    ok: true,
    marketState,
    stocks,
    disclaimer: "Educational research only. Not financial advice.",
  });
}
