import { InsightPage } from "@/components/market/insight-page";
import { marketState } from "@/lib/mock-data";

export default function MarketStatePage() {
  return (
    <InsightPage
      eyebrow="Market state"
      title={marketState.regime}
      description="Daily regime classification combining breadth, volatility, trend, macro stress, and sentiment."
      metrics={[
        { label: "Trend score", value: `${marketState.trendScore}`, detail: "Composite trend and breadth pressure." },
        { label: "Breadth", value: `${marketState.breadth}`, detail: "Participation across leadership groups." },
        { label: "Mood", value: marketState.fearGreedLabel, detail: "Fear & Greed context for confidence." },
      ]}
      notes={marketState.drivers}
    />
  );
}
