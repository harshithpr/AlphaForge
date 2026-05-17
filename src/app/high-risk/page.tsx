import { InsightPage } from "@/components/market/insight-page";
import { speculativeSignals } from "@/lib/mock-data";

export default function HighRiskPage() {
  const bubbleRisk = Math.round(
    speculativeSignals.reduce((total, signal) => total + signal.bubbleRisk, 0) / speculativeSignals.length
  );
  const hypeLeader = [...speculativeSignals].sort((a, b) => b.hypeScore - a.hypeScore)[0];

  return (
    <InsightPage
      eyebrow="High risk lane"
      title="High Risk / High Reward"
      description="Separated from normal recommendations so exciting setups stay visible without making the app feel promotional."
      metrics={[
        { label: "Bubble risk", value: `${bubbleRisk}`, detail: "Composite of valuation excess, momentum stretch, and sentiment heat." },
        { label: "Hype leader", value: hypeLeader.symbol, detail: `${hypeLeader.hypeScore}/100 hype vs ${hypeLeader.fundamentalsScore}/100 fundamentals.` },
        { label: "Risk rule", value: "Separated", detail: "Speculative research never mixes with safer long-term rankings." },
      ]}
      notes={[
        "High reward potential comes with elevated uncertainty, financing risk, and rapid sentiment reversals.",
        "AlphaForge should show why a setup is risky as prominently as why it is interesting.",
        "This page is a foundation for possible squeeze indicators, short interest, and survival probability timelines.",
      ]}
    />
  );
}
