import { InsightPage } from "@/components/market/insight-page";
import { marketState } from "@/lib/mock-data";

export default function VolatilityPage() {
  return (
    <InsightPage
      eyebrow="Risk conditions"
      title="Volatility"
      description="Volatility changes confidence, stop-distance assumptions, and which setups deserve attention."
      metrics={[
        { label: "VIX proxy", value: marketState.vix.toFixed(1), detail: "Higher readings penalize aggressive setups." },
        { label: "Macro risk", value: `${marketState.macroRisk}`, detail: "Macro pressure can amplify volatility." },
        { label: "Breadth", value: `${marketState.breadth}`, detail: "Weak breadth plus high volatility reduces conviction." },
      ]}
      notes={[
        "Volatility is useful only when paired with trend and liquidity context.",
        "The system avoids turning a volatility spike into an automatic bullish signal.",
        "High-volatility stocks remain separated in the speculative radar lane.",
      ]}
    />
  );
}
