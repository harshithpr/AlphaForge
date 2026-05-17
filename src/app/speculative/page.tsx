import { InsightPage } from "@/components/market/insight-page";
import { pennyStockSignals, speculativeSignals } from "@/lib/mock-data";

export default function SpeculativePage() {
  const highestVolatility = [...speculativeSignals].sort((a, b) => b.volatility - a.volatility)[0];
  const highestDilution = [...pennyStockSignals].sort((a, b) => b.dilutionProbability - a.dilutionProbability)[0];

  return (
    <InsightPage
      eyebrow="Speculative intelligence"
      title="Penny Stocks & Speculative Setups"
      description="A clearly separated research lane for unstable companies, unusual volume, dilution risk, hype cycles, and survival probability."
      metrics={[
        { label: "Highest volatility", value: highestVolatility.symbol, detail: `${highestVolatility.volatility}/100 volatility meter.` },
        { label: "Dilution watch", value: highestDilution.symbol, detail: `${highestDilution.dilutionProbability}/100 dilution probability.` },
        { label: "Coverage", value: `${pennyStockSignals.length + speculativeSignals.length}`, detail: "Demo watchlist signals ready for provider data." },
      ]}
      notes={[
        "Extremely speculative. High volatility. High failure probability.",
        "A speculative signal is never a buy instruction; it is a research prompt with risk labels attached.",
        "The production version should add financing history, reverse split history, float size, and filing freshness.",
      ]}
    />
  );
}
