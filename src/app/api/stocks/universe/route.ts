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

function readPaging(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get("q")?.trim().toLowerCase() ?? "";
  const offset = Math.max(Number(url.searchParams.get("offset") ?? 0) || 0, 0);
  const requestedLimit = Number(url.searchParams.get("limit") ?? 500) || 500;
  const limit = Math.min(Math.max(requestedLimit, 1), 5000);

  return { limit, offset, query };
}

export async function GET(request: Request) {
  const apiKey = process.env.FMP_API_KEY;
  const { limit, offset, query } = readPaging(request);

  if (!apiKey) {
    const filteredStocks = stocks.filter((stock) =>
      `${stock.symbol} ${stock.name} ${stock.sector}`.toLowerCase().includes(query)
    );
    const page = filteredStocks.slice(offset, offset + limit);

    return Response.json({
      ok: true,
      provider: "demo-fallback",
      count: filteredStocks.length,
      returned: page.length,
      offset,
      limit,
      updatedAt: new Date().toISOString(),
      warning: "Set FMP_API_KEY to enable the live global stock universe.",
      stocks: page.map((stock) => ({
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
          .filter((stock) =>
            query
              ? `${stock.symbol ?? ""} ${stock.name ?? ""} ${stock.exchange ?? ""} ${stock.exchangeShortName ?? ""} ${stock.type ?? ""}`
                  .toLowerCase()
                  .includes(query)
              : true
          )
      : [];
    const page = universe.slice(offset, offset + limit);

    return Response.json({
      ok: true,
      provider: "financial-modeling-prep",
      count: universe.length,
      providerCount: Array.isArray(raw) ? raw.length : universe.length,
      returned: page.length,
      offset,
      limit,
      updatedAt: new Date().toISOString(),
      warning:
        "Global universe is paginated to keep the app fast. Use q, offset, and limit to page through the provider universe.",
      stocks: page,
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
