import { InsightPage } from "@/components/market/insight-page";
import { marketState } from "@/lib/mock-data";

export default function MacroRiskPage() {
  return (
    <InsightPage
      eyebrow="Macro intelligence"
      title="Macro Risk"
      description="Macro risk tracks rate pressure, inflation sensitivity, labor-market stress, yields, and geopolitical headlines."
      metrics={[
        { label: "Macro risk", value: `${marketState.macroRisk}`, detail: "Current cross-asset stress level." },
        { label: "Market regime", value: marketState.regime, detail: "Regime context for score weighting." },
        { label: "VIX proxy", value: marketState.vix.toFixed(1), detail: "Volatility confirmation layer." },
      ]}
      notes={marketState.risks}
    />
  );
}
