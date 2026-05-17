# AlphaForge AI

AlphaForge AI is an explainable stock research assistant, not a guaranteed picker. It combines fundamentals, valuation, earnings quality, momentum, sentiment, macro conditions, and risk controls into transparent 0-100 scores. AI is used only to summarize and explain the evidence.

## What is built

- Next.js App Router + Tailwind + shadcn/ui
- Dashboard with market pulse, Market Brain, long-term rankings, short-term setups, sector heatmap, news inputs, and backtest summary
- A separated High Risk / High Reward speculative intelligence lane for AI, semiconductors, quantum, penny-stock risk checks, emerging narratives, and supply-chain mapping
- Stock detail pages with Recharts price chart, score breakdowns, bull/bear case, risk notes, dates, and source trace
- Screener with sector, risk, timeframe, and score filters
- Local watchlist MVP with change explanations
- API routes for stocks, market state, AI explanation, cron jobs, and an optional Truth Social geopolitical signal connector
- `/api/speculative-radar` for high-volatility watchlist signals, penny-stock warnings, emerging tech narratives, and semiconductor supply-chain links
- Neon/Supabase-compatible Postgres schema in `db/schema.sql`
- Vercel Cron configuration in `vercel.json`

## Guardrails

AlphaForge AI should never say:

- "Buy this now"
- "Guaranteed gains"
- "Put X% of your money here"
- Personalized portfolio advice without proper legal/compliance review

Use these labels instead:

- Strong Watch
- Bullish Setup
- Neutral
- High Risk
- Avoid for Now

The app includes this disclaimer: "This app is for educational research only and is not financial advice."

## Local setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Environment variables

Core:

- `DATABASE_URL`
- `CRON_SECRET`
- `OPENAI_API_KEY`
- `OPENAI_MODEL`

Market data adapters to wire next:

- `POLYGON_API_KEY`
- `FINNHUB_API_KEY`
- `TWELVE_DATA_API_KEY`
- `ALPHA_VANTAGE_API_KEY`
- `FMP_API_KEY`
- `NEWS_API_KEY`
- `FRED_API_KEY`

Optional geopolitical social feed:

- `TRUTH_SOCIAL_ACCOUNT_ID`
- `TRUTH_SOCIAL_API_BASE`
- `TRUTH_SOCIAL_BEARER_TOKEN`
- `TRUTH_SOCIAL_KEYWORDS`

Truth Social access is intentionally optional because official third-party API access is not a stable dependency. Treat it as an experimental headline/risk source, not a recommendation input by itself.

## Cron jobs

`vercel.json` configures:

- Every 15 minutes: `/api/cron/prices`
- Hourly: `/api/cron/news`
- Daily: `/api/cron/daily`
- Daily after refresh: `/api/cron/recalculate`

Each route checks `Authorization: Bearer $CRON_SECRET`. Frequent schedules may require a paid Vercel plan.

## Scoring model

Long-term:

- Financial Health: 25%
- Valuation: 20%
- Business Quality: 20%
- Earnings Strength: 20%
- Risk: 15%

Short-term:

- Momentum: 30%
- News Sentiment: 25%
- Market Sentiment: 20%
- Technical Setup: 15%
- Risk Control: 10%

Confidence is separate from score. It uses data completeness, source agreement, score conflict, macro risk, and negative news pressure.

## Production next steps

1. Replace demo data with licensed provider adapters.
2. Persist price, fundamental, news, sentiment, and score snapshots.
3. Add Clerk or Supabase Auth for user watchlists.
4. Add queue-backed refresh jobs when API volume grows.
5. Backtest every label and publish win rate, average return, drawdown, and Sharpe.
6. Add source freshness and provider disagreement warnings.
7. Add embeddings for news clustering and narrative detection.
