export type RecommendationLabel =
  | "Strong Watch"
  | "Bullish Setup"
  | "Neutral"
  | "High Risk"
  | "Avoid for Now";

export type RiskLevel =
  | "Low Risk"
  | "Moderate Risk"
  | "Aggressive"
  | "Extreme Volatility";

export type ConfidenceLevel = "Low" | "Medium" | "Medium-high" | "High";

export type Timeframe = "Long-term" | "Short-term";

export type ScoreFactor = {
  label: string;
  score: number;
  weight: number;
  rationale: string;
};

export type LongTermBreakdown = {
  financialHealth: ScoreFactor;
  valuation: ScoreFactor;
  businessQuality: ScoreFactor;
  earningsStrength: ScoreFactor;
  risk: ScoreFactor;
};

export type ShortTermBreakdown = {
  momentum: ScoreFactor;
  newsSentiment: ScoreFactor;
  marketSentiment: ScoreFactor;
  technicalSetup: ScoreFactor;
  riskControl: ScoreFactor;
};

export type PricePoint = {
  date: string;
  close: number;
  volume: number;
};

export type NewsItem = {
  id: string;
  symbol?: string;
  title: string;
  source: string;
  url: string;
  sentiment: "positive" | "neutral" | "negative";
  relevance: number;
  publishedAt: string;
  summary: string;
};

export type StockMetrics = {
  revenueGrowth: number;
  profitMargin: number;
  freeCashFlowMargin: number;
  debtToEquity: number;
  pe: number;
  forwardPe: number;
  peg: number;
  priceToSales: number;
  roe: number;
  moat: number;
  consistency: number;
  epsGrowth: number;
  earningsSurprise: number;
  guidanceScore: number;
  volatility: number;
  beta: number;
  negativeNewsRisk: number;
  momentum30d: number;
  aboveMovingAverages: number;
  rsiQuality: number;
  volumeSpike: number;
  newsSentimentScore: number;
  breakoutQuality: number;
  supportQuality: number;
  stopLossDistance: number;
  institutionalFlow: number;
  insiderSignal: number;
  dataCompleteness: number;
  sourceAgreement: number;
};

export type RawStockSignal = {
  symbol: string;
  name: string;
  sector: string;
  industry: string;
  marketCap: number;
  price: number;
  changePercent: number;
  dividendYield?: number;
  metrics: StockMetrics;
  priceHistory: PricePoint[];
  news: NewsItem[];
  upcomingDates: string[];
  sourceLinks: { label: string; url: string; reliability: "primary" | "licensed" | "experimental" | "demo" }[];
};

export type ResearchStock = RawStockSignal & {
  longTermScore: number;
  shortTermScore: number;
  blendedScore: number;
  recommendationLabel: RecommendationLabel;
  riskLevel: RiskLevel;
  confidence: ConfidenceLevel;
  confidenceScore: number;
  longTermBreakdown: LongTermBreakdown;
  shortTermBreakdown: ShortTermBreakdown;
  bullCase: string[];
  bearCase: string[];
  whyThisPick: string;
  whyNot: string[];
  bestFor: Timeframe;
};

export type MarketState = {
  regime: "Bullish" | "Bearish" | "High Volatility" | "Risk-On" | "Risk-Off" | "Panic" | "Euphoria" | "Sideways";
  mood: string;
  fearGreed: number;
  fearGreedLabel: "Extreme Fear" | "Fear" | "Neutral" | "Greed" | "Extreme Greed";
  vix: number;
  breadth: number;
  trendScore: number;
  macroRisk: number;
  mostBullishSector: string;
  mostBearishSector: string;
  updatedAt: string;
  drivers: string[];
  risks: string[];
};

export type SectorSignal = {
  sector: string;
  relativeStrength: number;
  sentiment: number;
  flow: number;
  label: string;
};

export type BacktestSummary = {
  engine: "Long-term" | "Short-term";
  period: string;
  winRate: number;
  averageReturn: number;
  maxDrawdown: number;
  sharpe: number;
};

export type SpeculativeSignal = {
  symbol: string;
  name: string;
  theme: string;
  marketCap: number;
  price: number;
  changePercent: number;
  volatility: number;
  hypeScore: number;
  fundamentalsScore: number;
  institutionalInterest: number;
  dilutionRisk: "Low" | "Moderate" | "High" | "Extreme";
  cashRunwayMonths: number;
  survivalProbability: number;
  aiConviction: "Low" | "Medium" | "High" | "Speculative";
  narrative: string;
  narrativeStrength: number;
  bubbleRisk: number;
  signal: string;
};

export type PennyStockSignal = {
  symbol: string;
  name: string;
  price: number;
  volumeSpike: number;
  socialMomentum: number;
  financingRisk: number;
  reverseSplitRisk: number;
  dilutionProbability: number;
  survivalProbability: number;
  warning: string;
};

export type EmergingNarrative = {
  theme: string;
  strength: number;
  momentum: "Increasing" | "Stable" | "Fading";
  trackedAreas: string[];
  riskNote: string;
};

export type SupplyChainLink = {
  chain: string;
  theme: string;
  strength: number;
  risk: string;
};
