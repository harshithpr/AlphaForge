import { z } from "zod";
import { stocks } from "@/lib/mock-data";
import type { ResearchStock } from "@/lib/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const yahooQuoteSchema = z.object({
  quoteResponse: z.object({
    result: z.array(
      z.object({
        symbol: z.string(),
        shortName: z.string().optional(),
        longName: z.string().optional(),
        regularMarketPrice: z.number().optional(),
        regularMarketChangePercent: z.number().optional(),
        regularMarketVolume: z.number().optional(),
        marketCap: z.number().optional(),
        fiftyTwoWeekHigh: z.number().optional(),
        fiftyTwoWeekLow: z.number().optional(),
        trailingPE: z.number().optional(),
        forwardPE: z.number().optional(),
        marketState: z.string().optional(),
      })
    ),
  }),
});

function formatMarketCap(value?: number) {
  if (!value) return "Unknown";
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  return `$${value.toLocaleString()}`;
}

function fallbackExplanation(symbol: string, warning?: string) {
  const stock: ResearchStock | undefined = stocks.find(
    (candidate) => candidate.symbol.toUpperCase() === symbol
  );

  if (!stock) return null;

  return {
    symbol: stock.symbol,
    name: stock.name,
    price: stock.price,
    changePercent: stock.changePercent,
    marketCap: formatMarketCap(stock.marketCap),
    pe: stock.metrics.pe,
    volume: "Research universe",
    marketState: "Research fallback",
    risk: stock.riskLevel,
    pros: stock.bullCase,
    cons: [...stock.bearCase, ...stock.whyNot].slice(0, 4),
    shortTerm:
      stock.shortTermScore >= 70
        ? "Short-term score is constructive, but timing risk still depends on live momentum, volume, and market state."
        : "Short-term score is not the main strength, so timing should be treated carefully.",
    longTerm:
      stock.longTermScore >= 70
        ? "Long-term score is supported by the current research model, with fundamentals and risk controls still requiring source review."
        : "Long-term quality needs more confirmation from fundamentals, debt, cash flow, valuation, and filings.",
    keyNewsFactors: stock.news.map((item) => item.title).slice(0, 3),
    warning:
      warning ??
      "This is automated market research for educational purposes only, not financial advice.",
    updatedAt: new Date().toISOString(),
  };
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { symbol?: unknown };
    const symbol = String(body.symbol ?? "").trim().toUpperCase();

    if (!symbol) {
      return Response.json({ error: "Missing stock symbol." }, { status: 400 });
    }

    const quoteResponse = await fetch(
      `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(symbol)}`,
      {
        cache: "no-store",
        headers: { "User-Agent": "Mozilla/5.0" },
      }
    );

    if (!quoteResponse.ok) {
      const fallback = fallbackExplanation(
        symbol,
        "Live quote data is unavailable, so this explanation uses AlphaForge's research universe fallback. This is educational research only, not financial advice."
      );

      return fallback
        ? Response.json(fallback)
        : Response.json({
            error: "Live quote data unavailable.",
            updatedAt: new Date().toISOString(),
          });
    }

    const quoteJson = await quoteResponse.json();
    const parsed = yahooQuoteSchema.safeParse(quoteJson);
    const quote = parsed.success ? parsed.data.quoteResponse.result[0] : undefined;

    if (!quote) {
      const fallback = fallbackExplanation(
        symbol,
        "No live quote was found, so this explanation uses AlphaForge's research universe fallback. This is educational research only, not financial advice."
      );

      return fallback
        ? Response.json(fallback)
        : Response.json({
            error: "No live quote found for that symbol.",
            updatedAt: new Date().toISOString(),
          });
    }

    const name = quote.longName ?? quote.shortName ?? quote.symbol;
    const change = quote.regularMarketChangePercent ?? 0;
    const pe = quote.trailingPE ?? quote.forwardPE ?? null;
    const volume = quote.regularMarketVolume ?? null;
    const pros: string[] = [];
    const cons: string[] = [];

    if (change > 1.5) pros.push("Positive short-term price momentum is visible today.");
    if (change < -1.5) cons.push("The stock is showing weak short-term price action today.");
    if (pe && pe < 25) pros.push("Valuation appears more reasonable compared with many high-growth names.");
    if (pe && pe > 45) cons.push("Valuation may be stretched, which increases downside risk if growth slows.");
    if (volume && volume > 5_000_000) pros.push("Trading volume is strong, meaning liquidity is likely healthy.");
    if (volume && volume < 500_000) cons.push("Lower volume can create higher liquidity risk and wider price swings.");
    if (quote.marketCap && quote.marketCap > 200_000_000_000) {
      pros.push("Large market cap suggests more stability than smaller speculative stocks.");
    }
    if (quote.marketCap && quote.marketCap < 2_000_000_000) {
      cons.push("Smaller market cap makes the stock more speculative and volatile.");
    }

    if (pros.length === 0) {
      pros.push("The stock has enough market data to research, but no major positive signal stands out from the current quote alone.");
    }
    if (cons.length === 0) {
      cons.push("Major risks may still exist, especially around earnings, valuation, competition, and broader market conditions.");
    }

    const risk =
      quote.marketCap && quote.marketCap < 2_000_000_000
        ? "High"
        : pe && pe > 45
          ? "Medium-high"
          : Math.abs(change) > 4
            ? "High"
            : "Medium";

    return Response.json({
      symbol: quote.symbol,
      name,
      price: quote.regularMarketPrice ?? null,
      changePercent: change,
      marketCap: formatMarketCap(quote.marketCap),
      pe: pe ?? "Unknown",
      volume: volume ?? "Unknown",
      marketState: quote.marketState ?? "Unknown",
      risk,
      pros,
      cons,
      shortTerm:
        change > 0
          ? "Short-term momentum is currently positive, but it can reverse quickly during active trading."
          : "Short-term momentum is currently weak or neutral, so timing risk is elevated.",
      longTerm:
        "Long-term quality should be judged using revenue growth, earnings consistency, debt, cash flow, valuation, and competitive advantage.",
      keyNewsFactors: [
        "Recent price action and volume can reflect changing sentiment.",
        "Earnings, guidance, analyst revisions, macro conditions, and sector rotation should be checked before forming a thesis.",
        "Single-quote data is incomplete without filings, news, and fundamentals.",
      ],
      warning: "This is automated market research for educational purposes only, not financial advice.",
      updatedAt: new Date().toISOString(),
    });
  } catch {
    return Response.json({ error: "Failed to generate explanation." }, { status: 500 });
  }
}
