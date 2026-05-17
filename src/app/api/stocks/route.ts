import { marketState, stocks } from "@/lib/mock-data";

export async function GET() {
  return Response.json({
    ok: true,
    marketState,
    stocks,
    disclaimer:
      "AlphaForge provides automated market research for educational purposes only. This is not financial advice.",
  });
}
