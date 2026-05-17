import { InsightPage } from "@/components/market/insight-page";
import { marketState } from "@/lib/mock-data";

export default function FearGreedPage() {
  return (
    <InsightPage
      eyebrow="Sentiment"
      title="Fear & Greed"
      description="A sentiment input used to reduce confidence when the market becomes too fearful or too euphoric."
      metrics={[
        { label: "Index", value: `${marketState.fearGreed}`, detail: marketState.fearGreedLabel },
        { label: "Regime", value: marketState.regime, detail: "Used as a market-state input, not a trade trigger." },
        { label: "Macro risk", value: `${marketState.macroRisk}`, detail: "Sentiment is interpreted with macro pressure." },
      ]}
      notes={[
        "High greed can mean momentum is strong, but it also raises overextension risk.",
        "Extreme fear can surface opportunities, but the engine requires fundamentals and risk support.",
        "Sentiment never overrides source quality, score explainability, or risk controls.",
      ]}
    />
  );
}
