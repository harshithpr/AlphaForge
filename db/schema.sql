create extension if not exists pgcrypto;

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  auth_provider text not null default 'local',
  auth_subject text unique,
  email text,
  risk_profile text check (risk_profile in ('conservative', 'moderate', 'aggressive')),
  created_at timestamptz not null default now()
);

create table if not exists stocks (
  id uuid primary key default gen_random_uuid(),
  symbol text not null unique,
  name text not null,
  sector text not null,
  industry text,
  market_cap numeric,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists prices (
  id uuid primary key default gen_random_uuid(),
  stock_id uuid not null references stocks(id) on delete cascade,
  source text not null,
  observed_at timestamptz not null,
  open numeric,
  high numeric,
  low numeric,
  close numeric not null,
  volume numeric,
  source_url text,
  created_at timestamptz not null default now(),
  unique (stock_id, source, observed_at)
);

create table if not exists fundamentals (
  id uuid primary key default gen_random_uuid(),
  stock_id uuid not null references stocks(id) on delete cascade,
  fiscal_period text not null,
  source text not null,
  revenue_growth numeric,
  profit_margin numeric,
  free_cash_flow_margin numeric,
  debt_to_equity numeric,
  pe numeric,
  forward_pe numeric,
  peg numeric,
  price_to_sales numeric,
  roe numeric,
  eps_growth numeric,
  earnings_surprise numeric,
  guidance_score numeric,
  raw jsonb not null default '{}'::jsonb,
  source_url text,
  created_at timestamptz not null default now(),
  unique (stock_id, fiscal_period, source)
);

create table if not exists news (
  id uuid primary key default gen_random_uuid(),
  stock_id uuid references stocks(id) on delete cascade,
  source text not null,
  title text not null,
  url text not null unique,
  summary text,
  published_at timestamptz not null,
  credibility_score numeric not null default 50,
  relevance_score numeric not null default 50,
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists sentiment_scores (
  id uuid primary key default gen_random_uuid(),
  stock_id uuid references stocks(id) on delete cascade,
  news_id uuid references news(id) on delete cascade,
  source text not null,
  sentiment_score numeric not null,
  decay_weight numeric not null default 1,
  themes text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists market_states (
  id uuid primary key default gen_random_uuid(),
  observed_at timestamptz not null unique,
  regime text not null,
  fear_greed numeric,
  vix numeric,
  breadth numeric,
  trend_score numeric,
  macro_risk numeric,
  drivers text[] not null default '{}',
  risks text[] not null default '{}',
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists recommendation_scores (
  id uuid primary key default gen_random_uuid(),
  stock_id uuid not null references stocks(id) on delete cascade,
  market_state_id uuid references market_states(id) on delete set null,
  scored_at timestamptz not null default now(),
  long_term_score numeric not null,
  short_term_score numeric not null,
  confidence_score numeric not null,
  confidence_label text not null,
  recommendation_label text not null,
  risk_level text not null,
  breakdown jsonb not null,
  explanation text,
  source_snapshot jsonb not null default '{}'::jsonb
);

create table if not exists watchlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  stock_id uuid not null references stocks(id) on delete cascade,
  notes text,
  created_at timestamptz not null default now(),
  unique (user_id, stock_id)
);

create table if not exists backtests (
  id uuid primary key default gen_random_uuid(),
  engine text not null,
  period text not null,
  started_at timestamptz not null,
  ended_at timestamptz not null,
  win_rate numeric,
  average_return numeric,
  max_drawdown numeric,
  sharpe numeric,
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists speculative_signals (
  id uuid primary key default gen_random_uuid(),
  symbol text not null,
  theme text not null,
  observed_at timestamptz not null default now(),
  volatility_score numeric not null,
  hype_score numeric not null,
  fundamentals_score numeric not null,
  institutional_interest numeric,
  dilution_risk text,
  cash_runway_months numeric,
  survival_probability numeric,
  narrative_strength numeric,
  bubble_risk numeric,
  source_snapshot jsonb not null default '{}'::jsonb,
  unique (symbol, theme, observed_at)
);

create table if not exists emerging_narratives (
  id uuid primary key default gen_random_uuid(),
  theme text not null,
  observed_at timestamptz not null default now(),
  strength numeric not null,
  momentum text not null,
  tracked_areas text[] not null default '{}',
  risk_note text,
  source_snapshot jsonb not null default '{}'::jsonb,
  unique (theme, observed_at)
);

create index if not exists prices_stock_time_idx on prices (stock_id, observed_at desc);
create index if not exists fundamentals_stock_period_idx on fundamentals (stock_id, fiscal_period desc);
create index if not exists news_stock_published_idx on news (stock_id, published_at desc);
create index if not exists sentiment_stock_created_idx on sentiment_scores (stock_id, created_at desc);
create index if not exists recommendation_stock_scored_idx on recommendation_scores (stock_id, scored_at desc);
create index if not exists recommendation_label_idx on recommendation_scores (recommendation_label, scored_at desc);
create index if not exists speculative_symbol_observed_idx on speculative_signals (symbol, observed_at desc);
create index if not exists speculative_theme_observed_idx on speculative_signals (theme, observed_at desc);
create index if not exists emerging_narrative_observed_idx on emerging_narratives (theme, observed_at desc);
