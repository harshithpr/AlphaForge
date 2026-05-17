import { InsightPage } from "@/components/market/insight-page";
import { sectors, supplyChainLinks } from "@/lib/mock-data";

export default function SemiconductorsPage() {
  const sector = sectors.find((item) => item.sector === "Semiconductors");

  return (
    <InsightPage
      eyebrow="Sector intelligence"
      title="Semiconductors"
      description="Semiconductor leadership is tracked through relative strength, institutional flow, supply-chain depth, AI infrastructure demand, and valuation risk."
      metrics={[
        { label: "Relative strength", value: `${sector?.relativeStrength ?? 0}`, detail: "Leadership versus other sectors." },
        { label: "Sentiment", value: `${sector?.sentiment ?? 0}`, detail: "Narrative and news intensity." },
        { label: "Flow", value: `${sector?.flow ?? 0}`, detail: "Capital-flow proxy." },
      ]}
      notes={supplyChainLinks.map((link) => `${link.chain}: ${link.risk}`)}
    />
  );
}
