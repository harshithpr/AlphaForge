import { z } from "zod";
import { stocks } from "@/lib/mock-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const quoteSchema = z.object({
  quoteResponse: z.object({
    result: z.array(
      z.object({
        symbol: z.string(),
        shortName: z.string().optional(),
        longName: z.string().optional(),
        regularMarketPrice: z.number().nullable().optional(),
        regularMarketChange: z.number().nullable().optional(),
        regularMarketChangePercent: z.number().nullable().optional(),
        regularMarketVolume: z.number().nullable().optional(),
        marketState: z.string().optional(),
      })
    ),
  }),
});

function fallbackQuotes(symbols: string[], updatedAt: string) {
  return symbols
    .map((symbol) => {
      const stock = stocks.find((candidate) => candidate.symbol.toUpperCase() === symbol);
      if (!stock) return null;

      return {
        symbol: stock.symbol,
        name: stock.name,
        price: stock.price,
        change: null,
        changePercent: stock.changePercent,
        volume: null,
        marketState: "RESEARCH_FALLBACK",
        updatedAt,
        isLive: false,
      };
    })
    .filter((quote) => quote !== null);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbols = searchParams.get("symbols");

  if (!symbols) {
    return Response.json({ error: "Missing symbols" }, { status: 400 });
  }

  const cleanedSymbols = symbols
    .split(",")
    .map((symbol) => symbol.trim().toUpperCase())
    .filter((symbol) => /^[A-Z0-9.\-^=]{1,20}$/.test(symbol))
    .slice(0, 80);

  if (cleanedSymbols.length === 0) {
    return Response.json({ error: "No valid symbols supplied" }, { status: 400 });
  }

  const response = await fetch(
    `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(cleanedSymbols.join(","))}`,
    {
      cache: "no-store",
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    }
  );

  if (!response.ok) {
    const now = new Date().toISOString();

    return Response.json({
      error: "Quote data unavailable",
      quotes: fallbackQuotes(cleanedSymbols, now),
      updatedAt: now,
    });
  }

  const raw = await response.json();
  const parsed = quoteSchema.safeParse(raw);
  const now = new Date().toISOString();

  if (!parsed.success) {
    return Response.json({
      error: "Quote response shape changed",
      quotes: fallbackQuotes(cleanedSymbols, now),
      updatedAt: now,
    });
  }

  const quotes = parsed.data.quoteResponse.result.map((quote) => ({
    symbol: quote.symbol,
    name: quote.shortName ?? quote.longName ?? quote.symbol,
    price: quote.regularMarketPrice ?? null,
    change: quote.regularMarketChange ?? null,
    changePercent: quote.regularMarketChangePercent ?? null,
    volume: quote.regularMarketVolume ?? null,
    marketState: quote.marketState ?? "UNKNOWN",
    updatedAt: now,
    isLive: true,
  }));

  return Response.json({
    quotes,
    updatedAt: now,
  });
}
