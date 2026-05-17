import { InsightPage } from "@/components/market/insight-page";
import { marketState, sectors } from "@/lib/mock-data";

export default function MarketBreadthPage() {
  const averageSectorStrength = Math.round(
    sectors.reduce(
      (total, sector) => total + sector.relativeStrength * 0.45 + sector.sentiment * 0.25 + sector.flow * 0.3,
      0
    ) / sectors.length
  );

  return (
    <InsightPage
      eyebrow="Breadth intelligence"
      title="Market Breadth"
      description="Breadth measures whether market strength is broad and durable or concentrated in a narrow set of leaders."
      metrics={[
        { label: "Breadth score", value: `${marketState.breadth}`, detail: "Higher readings mean more stocks are participating." },
        { label: "Sector composite", value: `${averageSectorStrength}`, detail: "Average of relative strength, sentiment, and flow." },
        { label: "Weakest area", value: marketState.mostBearishSector, detail: "A warning signal when weakness spreads." },
      ]}
      notes={[
        "Strong breadth can increase confidence in long-term rankings because more capital is participating.",
        "Narrow leadership can make momentum setups fragile even when headline indexes look strong.",
        "AlphaForge treats breadth as context, not as a standalone recommendation.",
      ]}
    />
  );
}
