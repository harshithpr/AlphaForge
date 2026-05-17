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

const yahooSearchSchema = z.object({
  quotes: z
    .array(
      z.object({
        symbol: z.string().optional(),
        shortname: z.string().optional(),
        longname: z.string().optional(),
        exchDisp: z.string().optional(),
        quoteType: z.string().optional(),
      })
    )
    .optional(),
});

const fmpSearchSchema = z.array(
  z.object({
    symbol: z.string().optional(),
    name: z.string().optional(),
    exchangeShortName: z.string().optional(),
    stockExchange: z.string().optional(),
  })
);

const yahooChartSchema = z.object({
  chart: z.object({
    result: z
      .array(
        z.object({
          meta: z.object({
            symbol: z.string(),
            currency: z.string().optional(),
            exchangeName: z.string().optional(),
            fullExchangeName: z.string().optional(),
            instrumentType: z.string().optional(),
            regularMarketPrice: z.number().optional(),
            chartPreviousClose: z.number().optional(),
            regularMarketVolume: z.number().optional(),
            marketCap: z.number().optional(),
            fiftyTwoWeekHigh: z.number().optional(),
            fiftyTwoWeekLow: z.number().optional(),
            longName: z.string().optional(),
            shortName: z.string().optional(),
          }),
        })
      )
      .nullable(),
  }),
});

type ChartExplainData = {
  symbol: string;
  name: string;
  price: number | null;
  changePercent: number;
  marketCap: string;
  pe: string | number;
  volume: string | number;
  marketState: string;
  risk: string;
  pros: string[];
  cons: string[];
  shortTerm: string;
  longTerm: string;
  keyNewsFactors: string[];
  warning: string;
  updatedAt: string;
  currency?: string;
  exchange?: string;
  source?: string;
  resolutionNote?: string;
};

function formatMarketCap(value?: number) {
  if (!value) return "Unknown";
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  return `$${value.toLocaleString()}`;
}

async function fetchJson(url: string) {
  const response = await fetch(url, {
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "User-Agent": "Mozilla/5.0 AlphaForge research assistant",
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed with ${response.status}`);
  }

  return response.json();
}

async function fetchYahooChart(symbol: string, resolutionNote?: string): Promise<ChartExplainData | null> {
  try {
    const chartUrl = new URL(
      `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}`
    );
    chartUrl.searchParams.set("interval", "1d");
    chartUrl.searchParams.set("range", "1d");
    const raw = await fetchJson(chartUrl.toString());
    const parsed = yahooChartSchema.safeParse(raw);
    const meta = parsed.success ? parsed.data.chart.result?.[0]?.meta : undefined;

    if (!meta || typeof meta.regularMarketPrice !== "number") return null;

    const change =
      typeof meta.chartPreviousClose === "number" && meta.chartPreviousClose !== 0
        ? ((meta.regularMarketPrice - meta.chartPreviousClose) / meta.chartPreviousClose) * 100
        : 0;
    const name = meta.longName ?? meta.shortName ?? meta.symbol;
    const exchange = meta.fullExchangeName ?? meta.exchangeName ?? "Unknown exchange";
    const instrumentType = meta.instrumentType ?? "security";
    const pros: string[] = [];
    const cons: string[] = [];

    if (change > 1.5) pros.push("Current price action is positive versus the previous close.");
    if (change < -1.5) cons.push("Current price action is weak versus the previous close.");
    if (typeof meta.regularMarketVolume === "number" && meta.regularMarketVolume > 1_000_000) {
      pros.push("Trading volume appears liquid enough for normal research screening.");
    }
    if (typeof meta.regularMarketVolume === "number" && meta.regularMarketVolume < 100_000) {
      cons.push("Lower visible volume can increase liquidity and spread risk.");
    }
    if (
      typeof meta.fiftyTwoWeekHigh === "number" &&
      meta.fiftyTwoWeekHigh > 0 &&
      meta.regularMarketPrice >= meta.fiftyTwoWeekHigh * 0.9
    ) {
      cons.push("Price is near its 52-week high, so overextension and valuation risk should be checked.");
    }
    if (
      typeof meta.fiftyTwoWeekLow === "number" &&
      meta.fiftyTwoWeekLow > 0 &&
      meta.regularMarketPrice > meta.fiftyTwoWeekLow * 1.2
    ) {
      pros.push("Price is meaningfully above its 52-week low, suggesting the market has stabilized from prior weakness.");
    }

    if (pros.length === 0) {
      pros.push("A current global market quote was found, giving AlphaForge enough live metadata to start research.");
    }
    cons.push("Fundamentals, filings, local exchange disclosures, and recent news still need verification from primary or licensed sources.");

    const risk =
      instrumentType.toUpperCase().includes("CRYPTO") || Math.abs(change) > 5
        ? "High"
        : Math.abs(change) > 2.5
          ? "Medium-high"
          : "Medium";

    return {
      symbol: meta.symbol,
      name,
      price: meta.regularMarketPrice,
      changePercent: change,
      marketCap: formatMarketCap(meta.marketCap),
      pe: "Unknown",
      volume: meta.regularMarketVolume ?? "Unknown",
      marketState: exchange,
      risk,
      pros,
      cons,
      shortTerm:
        change > 0
          ? "Short-term price action is currently constructive, but it can reverse quickly around local market hours, currency moves, and macro headlines."
          : "Short-term price action is neutral or weak, so timing risk is elevated until momentum improves.",
      longTerm:
        "Long-term quality should be judged with revenue growth, earnings consistency, debt, cash flow, valuation, competitive position, and local filing disclosures.",
      keyNewsFactors: [
        `Resolved through Yahoo Finance chart metadata for ${meta.symbol}.`,
        "Use the stock's local exchange suffix for best global coverage, such as 7203.T, ASML.AS, RELIANCE.NS, 0700.HK, or BHP.AX.",
        "Check local filings, currency exposure, sector trend, and recent company news before forming a thesis.",
      ],
      warning: "This is automated global market research for educational purposes only, not financial advice.",
      updatedAt: new Date().toISOString(),
      currency: meta.currency,
      exchange,
      source: "Yahoo Finance chart metadata",
      resolutionNote,
    };
  } catch {
    return null;
  }
}

async function resolveGlobalChart(query: string) {
  const trimmed = query.trim();
  const directSymbol = trimmed.toUpperCase();

  if (/^[A-Z0-9.\-^=]{1,24}$/.test(directSymbol)) {
    const direct = await fetchYahooChart(directSymbol, "Matched as an exact global ticker symbol.");
    if (direct) return direct;
  }

  try {
    const searchUrl = new URL("https://query1.finance.yahoo.com/v1/finance/search");
    searchUrl.searchParams.set("q", trimmed);
    searchUrl.searchParams.set("quotesCount", "8");
    searchUrl.searchParams.set("newsCount", "0");
    searchUrl.searchParams.set("enableFuzzyQuery", "true");
    const raw = await fetchJson(searchUrl.toString());
    const parsed = yahooSearchSchema.safeParse(raw);
    const symbols =
      parsed.success
        ? (parsed.data.quotes ?? [])
            .map((quote) => quote.symbol)
            .filter((symbol): symbol is string => Boolean(symbol))
            .filter((symbol) => /^[A-Z0-9.\-^=]{1,24}$/.test(symbol.toUpperCase()))
            .slice(0, 5)
        : [];

    for (const symbol of symbols) {
      const resolved = await fetchYahooChart(
        symbol.toUpperCase(),
        `Resolved "${trimmed}" to ${symbol} through Yahoo Finance search.`
      );
      if (resolved) return resolved;
    }
  } catch {
    // Yahoo search can rate-limit; continue to any configured licensed search provider.
  }

  if (process.env.FMP_API_KEY) {
    try {
      const fmpUrl = new URL("https://financialmodelingprep.com/api/v3/search");
      fmpUrl.searchParams.set("query", trimmed);
      fmpUrl.searchParams.set("limit", "8");
      fmpUrl.searchParams.set("apikey", process.env.FMP_API_KEY);
      const raw = await fetchJson(fmpUrl.toString());
      const parsed = fmpSearchSchema.safeParse(raw);
      const symbols =
        parsed.success
          ? parsed.data
              .map((item) => item.symbol)
              .filter((symbol): symbol is string => Boolean(symbol))
              .filter((symbol) => /^[A-Z0-9.\-^=]{1,24}$/.test(symbol.toUpperCase()))
              .slice(0, 5)
          : [];

      for (const symbol of symbols) {
        const resolved = await fetchYahooChart(
          symbol.toUpperCase(),
          `Resolved "${trimmed}" to ${symbol} through Financial Modeling Prep search.`
        );
        if (resolved) return resolved;
      }
    } catch {
      return null;
    }
  }

  return null;
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

    const globalChart = await resolveGlobalChart(symbol);

    if (globalChart) {
      return Response.json(globalChart);
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
