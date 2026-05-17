import { stocks } from "@/lib/mock-data";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ symbol: string }> }
) {
  const { symbol } = await params;
  const stock = stocks.find((candidate) => candidate.symbol === symbol.toUpperCase());

  if (!stock) {
    return Response.json({ ok: false, error: "Stock not found" }, { status: 404 });
  }

  return Response.json({
    ok: true,
    stock,
    disclaimer:
      "AlphaForge provides automated market research for educational purposes only. This is not financial advice.",
  });
}
