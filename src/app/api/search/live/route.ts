import { z } from "zod";

export const dynamic = "force-dynamic";

const yahooSearchSchema = z.object({
  quotes: z
    .array(
      z.object({
        symbol: z.string().optional(),
        shortname: z.string().optional(),
        longname: z.string().optional(),
        exchDisp: z.string().optional(),
        quoteType: z.string().optional(),
        sector: z.string().optional(),
        industry: z.string().optional(),
        marketCap: z.number().optional(),
      })
    )
    .optional(),
  news: z
    .array(
      z.object({
        title: z.string().optional(),
        publisher: z.string().optional(),
        link: z.string().optional(),
        providerPublishTime: z.number().optional(),
      })
    )
    .optional(),
});

const yahooChartSchema = z.object({
  chart: z.object({
    result: z
      .array(
        z.object({
          meta: z.object({
            symbol: z.string(),
            exchangeName: z.string().optional(),
            instrumentType: z.string().optional(),
            regularMarketPrice: z.number().optional(),
            chartPreviousClose: z.number().optional(),
            regularMarketVolume: z.number().optional(),
            marketCap: z.number().optional(),
          }),
        })
      )
      .nullable(),
  }),
});

const braveSchema = z.object({
  web: z
    .object({
      results: z
        .array(
          z.object({
            title: z.string(),
            url: z.string(),
            description: z.string().optional(),
          })
        )
        .optional(),
    })
    .optional(),
});

type YahooSearchQuote = NonNullable<z.infer<typeof yahooSearchSchema>["quotes"]>[number];
type YahooSearchNews = NonNullable<z.infer<typeof yahooSearchSchema>["news"]>[number];
type BraveWebResult = NonNullable<NonNullable<z.infer<typeof braveSchema>["web"]>["results"]>[number];
type QuoteDetail = {
  symbol: string;
  shortName?: string;
  longName?: string;
  regularMarketPrice?: number;
  regularMarketChangePercent?: number;
  regularMarketVolume?: number;
  marketCap?: number;
  exchange?: string;
  quoteType?: string;
  sector?: string;
  industry?: string;
};

type LiveSearchPayload = {
  ok: true;
  query: string;
  updatedAt: string;
  sources: string[];
  yahooError: string | null;
  webSearchNote: string;
  quotes: YahooSearchQuote[];
  quoteDetails: QuoteDetail[];
  news: YahooSearchNews[];
  webResults: BraveWebResult[];
  disclaimer: string;
};

const CACHE_TTL_MS = 45_000;
const liveSearchCache = new Map<string, { expiresAt: number; payload: LiveSearchPayload }>();

function isQuoteDetail(value: QuoteDetail | null): value is QuoteDetail {
  return Boolean(value);
}

async function fetchJson(url: string, headers?: HeadersInit) {
  const response = await fetch(url, {
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "User-Agent": "AlphaForge live market search",
      ...headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed with ${response.status}`);
  }

  return response.json();
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get("q")?.trim();

  if (!query) {
    return Response.json({ ok: false, error: "Missing search query" }, { status: 400 });
  }

  const cacheKey = query.toLowerCase();
  const cached = liveSearchCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return Response.json({ ...cached.payload, cached: true });
  }

  const yahooSearchUrl = new URL("https://query1.finance.yahoo.com/v1/finance/search");
  yahooSearchUrl.searchParams.set("q", query);
  yahooSearchUrl.searchParams.set("quotesCount", "10");
  yahooSearchUrl.searchParams.set("newsCount", "8");
  yahooSearchUrl.searchParams.set("enableFuzzyQuery", "true");

  let quotes: YahooSearchQuote[] = [];
  let news: YahooSearchNews[] = [];
  let quoteDetails: QuoteDetail[] = [];
  let yahooError: string | null = null;

  try {
    const searchJson = await fetchJson(yahooSearchUrl.toString());
    const parsed = yahooSearchSchema.safeParse(searchJson);

    if (parsed.success) {
      quotes = parsed.data.quotes ?? [];
      news = parsed.data.news ?? [];
      const symbols = quotes
        .map((quote) => quote.symbol)
        .filter((symbol): symbol is string => Boolean(symbol))
        .filter((symbol) => /^[A-Z0-9.-]{1,12}$/.test(symbol))
        .slice(0, 6);

      if (symbols.length > 0) {
        quoteDetails = (
          await Promise.all(
            symbols.map(async (symbol): Promise<QuoteDetail | null> => {
              try {
                const chartUrl = new URL(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}`);
                chartUrl.searchParams.set("interval", "1d");
                chartUrl.searchParams.set("range", "1d");
                const chartJson = await fetchJson(chartUrl.toString());
                const parsedChart = yahooChartSchema.safeParse(chartJson);
                const meta = parsedChart.success ? parsedChart.data.chart.result?.[0]?.meta : undefined;
                const sourceQuote = quotes.find((quote) => quote.symbol === symbol);
                const price = meta?.regularMarketPrice;
                if (typeof price !== "number") return null;

                const previousClose = meta?.chartPreviousClose;
                const changePercent =
                  typeof previousClose === "number" && previousClose !== 0
                    ? ((price - previousClose) / previousClose) * 100
                    : undefined;

                return {
                  symbol,
                  regularMarketPrice: price,
                  ...(sourceQuote?.shortname ? { shortName: sourceQuote.shortname } : {}),
                  ...(sourceQuote?.longname ? { longName: sourceQuote.longname } : {}),
                  ...(typeof changePercent === "number" ? { regularMarketChangePercent: changePercent } : {}),
                  ...(typeof meta?.regularMarketVolume === "number" ? { regularMarketVolume: meta.regularMarketVolume } : {}),
                  ...(typeof sourceQuote?.marketCap === "number" || typeof meta?.marketCap === "number"
                    ? { marketCap: sourceQuote?.marketCap ?? meta?.marketCap }
                    : {}),
                  ...(sourceQuote?.exchDisp || meta?.exchangeName ? { exchange: sourceQuote?.exchDisp || meta?.exchangeName } : {}),
                  ...(sourceQuote?.quoteType || meta?.instrumentType ? { quoteType: sourceQuote?.quoteType || meta?.instrumentType } : {}),
                  ...(sourceQuote?.sector ? { sector: sourceQuote.sector } : {}),
                  ...(sourceQuote?.industry ? { industry: sourceQuote.industry } : {}),
                };
              } catch {
                return null;
              }
            })
          )
        ).filter(isQuoteDetail);
      }
    }
  } catch (error) {
    yahooError = error instanceof Error ? error.message : "Yahoo Finance lookup failed";
  }

  let webResults: BraveWebResult[] = [];
  let webSearchNote = "Set BRAVE_SEARCH_API_KEY to enable broader web search results.";

  if (process.env.BRAVE_SEARCH_API_KEY) {
    try {
      const braveUrl = new URL("https://api.search.brave.com/res/v1/web/search");
      braveUrl.searchParams.set("q", `${query} market news stock filings AI technology`);
      braveUrl.searchParams.set("count", "5");
      const braveJson = await fetchJson(braveUrl.toString(), {
        "X-Subscription-Token": process.env.BRAVE_SEARCH_API_KEY,
      });
      const parsedBrave = braveSchema.safeParse(braveJson);
      webResults = parsedBrave.success ? parsedBrave.data.web?.results ?? [] : [];
      webSearchNote = "Broad web search enabled through Brave Search API.";
    } catch (error) {
      webSearchNote = error instanceof Error ? error.message : "Broad web search failed.";
    }
  }

  const payload: LiveSearchPayload = {
    ok: true,
    query,
    updatedAt: new Date().toISOString(),
    sources: [
      "Yahoo Finance public search and quote endpoints",
      process.env.BRAVE_SEARCH_API_KEY ? "Brave Search API" : "Optional Brave Search API not configured",
    ],
    yahooError,
    webSearchNote,
    quotes,
    quoteDetails,
    news,
    webResults,
    disclaimer:
      "AlphaForge provides automated market research for educational purposes only. This is not financial advice. Verify prices, filings, and news with primary or licensed sources before relying on them.",
  };

  liveSearchCache.set(cacheKey, {
    expiresAt: Date.now() + CACHE_TTL_MS,
    payload,
  });

  return Response.json(payload);
}
