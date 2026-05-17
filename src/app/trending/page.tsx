import { InsightPage } from "@/components/market/insight-page";
import { emergingNarratives, speculativeSignals } from "@/lib/mock-data";

export default function TrendingPage() {
  const strongestNarrative = [...emergingNarratives].sort((a, b) => b.strength - a.strength)[0];
  const strongestSignal = [...speculativeSignals].sort((a, b) => b.narrativeStrength - a.narrativeStrength)[0];

  return (
    <InsightPage
      eyebrow="Narrative radar"
      title="Trending Stocks & Themes"
      description="Tracks narrative strength, sector momentum, and unusual attention without letting hype override risk controls."
      metrics={[
        { label: "Strongest theme", value: strongestNarrative.theme, detail: `${strongestNarrative.strength}/100 narrative strength.` },
        { label: "Top signal", value: strongestSignal.symbol, detail: strongestSignal.signal },
        { label: "Momentum state", value: strongestNarrative.momentum, detail: "Narratives are monitored for acceleration and fatigue." },
      ]}
      notes={[
        "Trending does not mean safe. Narrative strength can reverse quickly when liquidity or earnings expectations change.",
        "AlphaForge separates retail hype from fundamental evidence before raising confidence.",
        "This page is the foundation for future news clustering and narrative momentum timelines.",
      ]}
    />
  );
}
