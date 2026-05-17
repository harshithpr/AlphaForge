import { z } from "zod";

const truthStatusSchema = z.object({
  id: z.string(),
  url: z.string().optional(),
  content: z.string(),
  created_at: z.string(),
  account: z
    .object({
      username: z.string().optional(),
      display_name: z.string().optional(),
    })
    .optional(),
});

const braveSearchSchema = z.object({
  web: z
    .object({
      results: z
        .array(
          z.object({
            title: z.string(),
            url: z.string().url().optional(),
            description: z.string().optional(),
          })
        )
        .optional(),
    })
    .optional(),
});

const stripHtml = (html: string) =>
  html
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

export type ExternalSocialSignal = {
  id: string;
  source: string;
  title: string;
  url: string;
  publishedAt: string;
  text: string;
  reliability: "experimental";
  matchedKeywords: string[];
};

export type GeopoliticalFeedItem = {
  title: string;
  description: string;
  url: string | null;
};

export type GeopoliticalFeed = {
  connected: boolean;
  source: string;
  warning: string;
  items: GeopoliticalFeedItem[];
  updatedAt: string;
};

export async function fetchGeopoliticalFeed(): Promise<GeopoliticalFeed> {
  const apiKey = process.env.BRAVE_SEARCH_API_KEY;
  const updatedAt = new Date().toISOString();

  if (!apiKey) {
    return {
      connected: false,
      source: "Demo feed",
      warning: "Add BRAVE_SEARCH_API_KEY to connect live geopolitical and market-risk search.",
      items: [
        {
          title: "Live geopolitical feed not connected",
          description:
            "AlphaForge will use a live web search provider here once a Brave Search key is added in Vercel Environment Variables.",
          url: null,
        },
        {
          title: "Risk themes tracked by this feed",
          description:
            "Markets, geopolitical risk, semiconductors, oil, rates, technology regulation, defense, and supply-chain disruption.",
          url: null,
        },
      ],
      updatedAt,
    };
  }

  const query = encodeURIComponent(
    "markets geopolitical risk semiconductors oil rates technology supply chain defense AI"
  );

  try {
    const response = await fetch(
      `https://api.search.brave.com/res/v1/web/search?q=${query}&count=10&freshness=pd`,
      {
        cache: "no-store",
        headers: {
          Accept: "application/json",
          "X-Subscription-Token": apiKey,
        },
      }
    );

    if (!response.ok) {
      return {
        connected: false,
        source: "Brave Search",
        warning: `Live geopolitical feed returned ${response.status}. Check the API key or provider limits.`,
        items: [],
        updatedAt,
      };
    }

    const raw = await response.json();
    const parsed = braveSearchSchema.safeParse(raw);

    if (!parsed.success) {
      return {
        connected: false,
        source: "Brave Search",
        warning: "Live geopolitical feed response did not match the expected shape.",
        items: [],
        updatedAt,
      };
    }

    return {
      connected: true,
      source: "Brave Search",
      warning: "Live geopolitical search is active. Treat headlines as risk context, not recommendations.",
      items:
        parsed.data.web?.results?.map((item) => ({
          title: stripHtml(item.title),
          description: stripHtml(item.description ?? "No summary available."),
          url: item.url ?? null,
        })) ?? [],
      updatedAt,
    };
  } catch (error) {
    return {
      connected: false,
      source: "Brave Search",
      warning: error instanceof Error ? error.message : "Live geopolitical feed unavailable.",
      items: [],
      updatedAt,
    };
  }
}

export async function fetchTruthSocialSignals() {
  const accountId = process.env.TRUTH_SOCIAL_ACCOUNT_ID;
  const baseUrl = process.env.TRUTH_SOCIAL_API_BASE || "https://truthsocial.com";
  const token = process.env.TRUTH_SOCIAL_BEARER_TOKEN;
  const keywords = (process.env.TRUTH_SOCIAL_KEYWORDS || "war,tariff,oil,china,ukraine,russia,iran,israel,fed")
    .split(",")
    .map((word) => word.trim().toLowerCase())
    .filter(Boolean);

  if (!accountId) {
    return {
      enabled: false,
      note: "Set TRUTH_SOCIAL_ACCOUNT_ID to enable the experimental geopolitical headline connector.",
      signals: [] as ExternalSocialSignal[],
    };
  }

  const response = await fetch(
    `${baseUrl}/api/v1/accounts/${accountId}/statuses?limit=12&exclude_replies=true`,
    {
      headers: {
        Accept: "application/json",
        "User-Agent": "AlphaForge research assistant",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      next: { revalidate: 60 },
    }
  );

  if (!response.ok) {
    return {
      enabled: true,
      note: `Truth Social connector returned ${response.status}. Treat this provider as optional because official third-party API access is not stable.`,
      signals: [] as ExternalSocialSignal[],
    };
  }

  const raw = await response.json();
  const parsed = z.array(truthStatusSchema).safeParse(raw);

  if (!parsed.success) {
    return {
      enabled: true,
      note: "Truth Social response shape did not match the expected public-status format.",
      signals: [] as ExternalSocialSignal[],
    };
  }

  const signals = parsed.data
    .map((status) => {
      const text = stripHtml(status.content);
      const matchedKeywords = keywords.filter((keyword) =>
        text.toLowerCase().includes(keyword)
      );

      return {
        id: status.id,
        source: "Truth Social",
        title: `${status.account?.display_name || status.account?.username || "Truth Social"} post`,
        url: status.url || `${baseUrl}/@realDonaldTrump/posts/${status.id}`,
        publishedAt: status.created_at,
        text,
        reliability: "experimental" as const,
        matchedKeywords,
      };
    })
    .filter((signal) => signal.matchedKeywords.length > 0);

  return {
    enabled: true,
    note: "Experimental geopolitical headline feed. It should inform risk monitoring, not raw recommendations.",
    signals,
  };
}
