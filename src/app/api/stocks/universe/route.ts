import { z } from "zod";
import { stocks } from "@/lib/mock-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const fmpStockSchema = z.object({
  symbol: z.string().optional(),
  name: z.string().optional(),
  price: z.number().optional(),
  exchange: z.string().optional(),
  exchangeShortName: z.string().optional(),
  type: z.string().optional(),
});

export async function GET() {
  const apiKey = process.env.FMP_API_KEY;

  if (!apiKey) {
    return Response.json({
      ok: true,
      provider: "demo-fallback",
      count: stocks.length,
      updatedAt: new Date().toISOString(),
      warning: "Set FMP_API_KEY to enable the live global stock universe.",
      stocks: stocks.map((stock) => ({
        symbol: stock.symbol,
        name: stock.name,
        price: stock.price,
        exchange: "Demo",
        exchangeShortName: "DEMO",
        type: "stock",
        sector: stock.sector,
      })),
    });
  }

  try {
    const response = await fetch(
      `https://financialmodelingprep.com/api/v3/stock/list?apikey=${apiKey}`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      return Response.json({
        ok: false,
        provider: "financial-modeling-prep",
        count: 0,
        updatedAt: new Date().toISOString(),
        warning: `Financial Modeling Prep returned ${response.status}.`,
        stocks: [],
      });
    }

    const raw = await response.json();
    const parsed = z.array(fmpStockSchema).safeParse(raw);
    const universe = parsed.success
      ? parsed.data
          .filter((stock) => stock.symbol && stock.name)
          .slice(0, 500)
      : [];

    return Response.json({
      ok: true,
      provider: "financial-modeling-prep",
      count: Array.isArray(raw) ? raw.length : universe.length,
      returned: universe.length,
      updatedAt: new Date().toISOString(),
      warning: "Global universe is capped to 500 symbols per response. Add database pagination before rendering larger sets.",
      stocks: universe,
    });
  } catch (error) {
    return Response.json({
      ok: false,
      provider: "financial-modeling-prep",
      count: 0,
      updatedAt: new Date().toISOString(),
      warning: error instanceof Error ? error.message : "Global stock universe unavailable.",
      stocks: [],
    });
  }
}
