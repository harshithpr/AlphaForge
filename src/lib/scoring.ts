import type {
  ConfidenceLevel,
  LongTermBreakdown,
  MarketState,
  RecommendationLabel,
  ResearchStock,
  RiskLevel,
  ScoreFactor,
  ShortTermBreakdown,
  RawStockSignal,
} from "@/lib/types";

const clamp = (value: number, min = 0, max = 100) =>
  Math.min(max, Math.max(min, value));

const inverse = (value: number, best: number, worst: number) => {
  if (value <= best) return 100;
  if (value >= worst) return 0;
  return clamp(100 - ((value - best) / (worst - best)) * 100);
};

const weightedAverage = (factors: ScoreFactor[]) =>
  Math.round(
    factors.reduce((total, factor) => total + factor.score * factor.weight, 0)
  );

const factor = (
  label: string,
  score: number,
  weight: number,
  rationale: string
): ScoreFactor => ({
  label,
  score: Math.round(clamp(score)),
  weight,
  rationale,
});

const confidenceLabel = (score: number): ConfidenceLevel => {
  if (score >= 85) return "High";
  if (score >= 72) return "Medium-high";
  if (score >= 55) return "Medium";
  return "Low";
};

const riskLevel = (volatility: number, beta: number, negativeNewsRisk: number): RiskLevel => {
  const composite = volatility * 0.45 + beta * 18 + negativeNewsRisk * 0.35;
  if (composite >= 78) return "Extreme Volatility";
  if (composite >= 58) return "Aggressive";
  if (composite >= 38) return "Moderate Risk";
  return "Low Risk";
};

const recommendationLabel = (
  longTermScore: number,
  shortTermScore: number,
  risk: RiskLevel,
  confidence: ConfidenceLevel
): RecommendationLabel => {
  const best = Math.max(longTermScore, shortTermScore);
  if (risk === "Extreme Volatility" && best < 82) return "High Risk";
  if (best < 45) return "Avoid for Now";
  if (best < 62) return "Neutral";
  if (shortTermScore >= 76 && confidence !== "Low") return "Bullish Setup";
  if (longTermScore >= 78 && confidence !== "Low") return "Strong Watch";
  return risk === "Aggressive" ? "High Risk" : "Neutral";
};

export function scoreStock(
  raw: RawStockSignal,
  marketState: MarketState
): ResearchStock {
  const m = raw.metrics;
  const financialHealth = factor(
    "Financial Health",
    clamp(
      m.revenueGrowth * 1.4 +
        m.profitMargin * 1.1 +
        m.freeCashFlowMargin * 1.2 +
        inverse(m.debtToEquity, 0.15, 2.2) * 0.35
    ),
    0.25,
    "Revenue growth, margin durability, free cash flow, and debt load."
  );
  const valuation = factor(
    "Valuation",
    inverse(m.pe, 14, 65) * 0.3 +
      inverse(m.forwardPe, 12, 55) * 0.3 +
      inverse(m.peg, 0.8, 3.5) * 0.25 +
      inverse(m.priceToSales, 2, 18) * 0.15,
    0.2,
    "Compares P/E, forward P/E, PEG, and price-to-sales against risk-aware ranges."
  );
  const businessQuality = factor(
    "Business Quality",
    m.roe * 0.9 + m.moat * 0.42 + m.consistency * 0.38,
    0.2,
    "Rewards return on equity, consistency, and durable competitive position."
  );
  const earningsStrength = factor(
    "Earnings Strength",
    m.epsGrowth * 1.25 + m.earningsSurprise * 0.75 + m.guidanceScore * 0.35,
    0.2,
    "Looks for EPS growth, surprise history, and guidance tone."
  );
  const longRisk = factor(
    "Risk",
    inverse(m.volatility, 12, 72) * 0.35 +
      inverse(m.debtToEquity, 0.2, 2.4) * 0.3 +
      inverse(m.negativeNewsRisk, 10, 90) * 0.25 +
      inverse(Math.abs(m.beta - 1) * 50, 0, 60) * 0.1,
    0.15,
    "Penalizes high volatility, debt exposure, negative news pressure, and market sensitivity."
  );

  const longTermBreakdown: LongTermBreakdown = {
    financialHealth,
    valuation,
    businessQuality,
    earningsStrength,
    risk: longRisk,
  };

  const momentum = factor(
    "Momentum",
    m.momentum30d * 0.35 +
      m.aboveMovingAverages * 0.25 +
      m.rsiQuality * 0.2 +
      m.volumeSpike * 0.2,
    0.3,
    "Measures trend, moving average confirmation, RSI quality, and volume expansion."
  );
  const newsSentiment = factor(
    "News Sentiment",
    m.newsSentimentScore,
    0.25,
    "Uses recent headlines with recency weighting and source relevance."
  );
  const marketSentiment = factor(
    "Market Sentiment",
    marketState.trendScore * 0.38 +
      marketState.breadth * 0.25 +
      inverse(marketState.vix, 12, 38) * 0.2 +
      inverse(marketState.macroRisk, 10, 90) * 0.17,
    0.2,
    "Adapts to Fear & Greed, volatility, breadth, and macro stress."
  );
  const technicalSetup = factor(
    "Technical Setup",
    m.breakoutQuality * 0.55 + m.supportQuality * 0.45,
    0.15,
    "Scores breakout quality, support strength, and trend structure."
  );
  const riskControl = factor(
    "Risk Control",
    inverse(m.stopLossDistance, 3, 18) * 0.55 +
      inverse(m.volatility, 12, 72) * 0.3 +
      inverse(m.beta, 0.7, 2.1) * 0.15,
    0.1,
    "Prefers cleaner invalidation levels and lower volatility drag."
  );

  const shortTermBreakdown: ShortTermBreakdown = {
    momentum,
    newsSentiment,
    marketSentiment,
    technicalSetup,
    riskControl,
  };

  const longTermScore = weightedAverage(Object.values(longTermBreakdown));
  const shortTermScore = weightedAverage(Object.values(shortTermBreakdown));
  const blendedScore = Math.round(longTermScore * 0.55 + shortTermScore * 0.45);
  const confidenceScore = Math.round(
    clamp(
      m.dataCompleteness * 0.34 +
        m.sourceAgreement * 0.28 +
        inverse(Math.abs(longTermScore - shortTermScore), 0, 45) * 0.18 +
        inverse(marketState.macroRisk, 15, 85) * 0.1 +
        inverse(m.negativeNewsRisk, 5, 85) * 0.1
    )
  );
  const confidence = confidenceLabel(confidenceScore);
  const risk = riskLevel(m.volatility, m.beta, m.negativeNewsRisk);
  const label = recommendationLabel(longTermScore, shortTermScore, risk, confidence);
  const bestFor = longTermScore >= shortTermScore ? "Long-term" : "Short-term";

  return {
    ...raw,
    longTermScore,
    shortTermScore,
    blendedScore,
    recommendationLabel: label,
    riskLevel: risk,
    confidence,
    confidenceScore,
    longTermBreakdown,
    shortTermBreakdown,
    bestFor,
    bullCase: [
      `${raw.name} screens well on ${bestFor.toLowerCase()} quality with a ${Math.max(longTermScore, shortTermScore)}/100 top score.`,
      `Institutional and insider signals contribute ${Math.round((m.institutionalFlow + m.insiderSignal) / 2)}/100 to the quality layer.`,
      `Recent news sentiment is ${m.newsSentimentScore >= 70 ? "constructive" : m.newsSentimentScore >= 50 ? "mixed but usable" : "soft"}, so the AI layer should explain rather than overrule the score.`,
    ],
    bearCase: [
      `Valuation score is ${valuation.score}/100, which keeps upside assumptions grounded.`,
      `Risk control is ${riskControl.score}/100, so position sizing and invalidation levels matter.`,
      `Macro regime is ${marketState.regime}, which can compress confidence in aggressive setups.`,
    ],
    whyThisPick: `${raw.symbol} ranks as ${label} because ${bestFor.toLowerCase()} signals lead, with ${confidence.toLowerCase()} confidence and visible risks.`,
    whyNot: [
      valuation.score < 55 ? "Valuation is not cheap enough to call this a clean bargain." : "Valuation is acceptable, but not a guarantee of future returns.",
      riskControl.score < 55 ? "Short-term risk control is weak, so timing can matter more than thesis quality." : "Risk controls look manageable, but volatility can still change quickly.",
      marketState.macroRisk > 58 ? "Macro risk is elevated, which can overwhelm stock-specific positives." : "Macro conditions are not the main blocker today.",
    ],
  };
}
