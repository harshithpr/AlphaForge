import { z } from "zod";
import { pennyStockSignals, speculativeSignals, stocks } from "@/lib/mock-data";

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

const sparkQuoteSchema = z
  .object({
    symbol: z.string().optional(),
    close: z.array(z.number()).optional(),
    previousClose: z.number().nullable().optional(),
    chartPreviousClose: z.number().nullable().optional(),
    timestamp: z.array(z.number()).optional(),
  })
  .passthrough();

const sparkSchema = z.record(z.string(), sparkQuoteSchema);

function demoSource(symbol: string) {
  const upperSymbol = symbol.toUpperCase();
  const stock = stocks.find((candidate) => candidate.symbol.toUpperCase() === upperSymbol);
  const speculative = speculativeSignals.find(
    (candidate) => candidate.symbol.toUpperCase() === upperSymbol
  );
  const penny = pennyStockSignals.find((candidate) => candidate.symbol.toUpperCase() === upperSymbol);

  return stock ?? speculative ?? penny ?? null;
}

function seedChangePercent(source: ReturnType<typeof demoSource>) {
  return source && "changePercent" in source ? source.changePercent : null;
}

function fallbackQuotes(symbols: string[], updatedAt: string) {
  return symbols
    .map((symbol) => {
      const stock = demoSource(symbol);
      if (!stock) {
        return {
          symbol,
          name: symbol,
          price: null,
          change: null,
          changePercent: null,
          volume: null,
          marketState: "UNAVAILABLE",
          updatedAt,
          isLive: false,
          source: "No quote source",
        };
      }

      return {
        symbol: stock.symbol,
        name: stock.name,
        price: stock.price,
        change: null,
        changePercent: seedChangePercent(stock),
        volume: null,
        marketState: "RESEARCH_FALLBACK",
        updatedAt,
        isLive: false,
        source: "AlphaForge research fallback",
      };
    })
    .filter((quote) => quote !== null);
}

async function fetchYahooQuoteBatch(symbols: string[], updatedAt: string) {
  const response = await fetch(
    `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(symbols.join(","))}`,
    {
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "User-Agent": "Mozilla/5.0 AlphaForge live quotes",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Yahoo quote returned ${response.status}`);
  }

  const raw = await response.json();
  const parsed = quoteSchema.safeParse(raw);

  if (!parsed.success) {
    throw new Error("Yahoo quote response shape changed");
  }

  return parsed.data.quoteResponse.result.map((quote) => ({
    symbol: quote.symbol,
    name: quote.shortName ?? quote.longName ?? quote.symbol,
    price: quote.regularMarketPrice ?? null,
    change: quote.regularMarketChange ?? null,
    changePercent: quote.regularMarketChangePercent ?? null,
    volume: quote.regularMarketVolume ?? null,
    marketState: quote.marketState ?? "UNKNOWN",
    updatedAt,
    isLive: true,
    source: "Yahoo Finance quote",
  }));
}

async function fetchYahooSparkBatch(symbols: string[], updatedAt: string) {
  const response = await fetch(
    `https://query1.finance.yahoo.com/v8/finance/spark?symbols=${encodeURIComponent(symbols.join(","))}&range=1d&interval=1d`,
    {
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "User-Agent": "Mozilla/5.0 AlphaForge live quotes",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Yahoo spark returned ${response.status}`);
  }

  const raw = await response.json();
  const parsed = sparkSchema.safeParse(raw);

  if (!parsed.success) {
    throw new Error("Yahoo spark response shape changed");
  }

  return symbols.map((symbol) => {
    const spark = parsed.data[symbol];
    const source = demoSource(symbol);
    const price = spark?.close?.findLast((value) => typeof value === "number") ?? null;
    const previousClose = spark?.previousClose ?? spark?.chartPreviousClose ?? null;
    const change =
      typeof price === "number" && typeof previousClose === "number" ? price - previousClose : null;
    const changePercent =
      typeof change === "number" && typeof previousClose === "number" && previousClose !== 0
        ? (change / previousClose) * 100
        : null;

    if (typeof price !== "number" && source) {
      return {
        symbol: source.symbol,
        name: source.name,
        price: source.price,
        change: null,
        changePercent: seedChangePercent(source),
        volume: null,
        marketState: "RESEARCH_FALLBACK",
        updatedAt,
        isLive: false,
        source: "AlphaForge research fallback",
      };
    }

    return {
      symbol,
      name: source?.name ?? symbol,
      price,
      change,
      changePercent,
      volume: null,
      marketState: "SPARK",
      updatedAt,
      isLive: typeof price === "number",
      source: "Yahoo Finance chart",
    };
  });
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
    .slice(0, 20);

  if (cleanedSymbols.length === 0) {
    return Response.json({ error: "No valid symbols supplied" }, { status: 400 });
  }

  const now = new Date().toISOString();

  try {
    const quotes = await fetchYahooQuoteBatch(cleanedSymbols, now);

    return Response.json({
      quotes,
      updatedAt: now,
      source: "Yahoo Finance quote",
    });
  } catch (quoteError) {
    try {
      const quotes = await fetchYahooSparkBatch(cleanedSymbols, now);
      const missingLive = quotes.some((quote) => quote.price === null);

      return Response.json({
        warning: missingLive
          ? "Some quote prices were unavailable from the live chart provider."
          : quoteError instanceof Error
            ? `Primary quote provider failed; using chart prices. ${quoteError.message}`
            : "Primary quote provider failed; using chart prices.",
        quotes,
        updatedAt: now,
        source: "Yahoo Finance chart",
      });
    } catch {
      return Response.json({
        error: "Quote data unavailable",
        quotes: fallbackQuotes(cleanedSymbols, now),
        updatedAt: now,
      });
    }
  }
}
