import { InsightPage } from "@/components/market/insight-page";
import { marketState } from "@/lib/mock-data";

export default function RiskPage() {
  return (
    <InsightPage
      eyebrow="Risk dashboard"
      title="Biggest Risks"
      description="The risk dashboard keeps downside pressure visible so AlphaForge AI does not become a hype engine."
      metrics={[
        { label: "Macro risk", value: `${marketState.macroRisk}`, detail: "Rates, inflation, labor, and geopolitical pressure." },
        { label: "Volatility", value: marketState.vix.toFixed(1), detail: "Expected market turbulence proxy." },
        { label: "Weakest sector", value: marketState.mostBearishSector, detail: "Breadth pressure warning." },
      ]}
      notes={marketState.risks}
    />
  );
}
