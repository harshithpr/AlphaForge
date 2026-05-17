import { generateStockExplanation } from "@/lib/ai";
import { stocks } from "@/lib/mock-data";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { symbol?: string };
  const symbol = body.symbol?.toUpperCase() || stocks[0]?.symbol;
  const stock = stocks.find((candidate) => candidate.symbol === symbol);

  if (!stock) {
    return Response.json({ ok: false, error: "Stock not found" }, { status: 404 });
  }

  const explanation = await generateStockExplanation(stock);

  return Response.json({
    ok: true,
    symbol: stock.symbol,
    explanation,
    guardrails: [
      "AI summarizes data only.",
      "The scoring engine produces rankings.",
      "No personalized allocation or guaranteed outcome is provided.",
    ],
  });
}
