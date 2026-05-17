export function formatMarketCap(value: number) {
  if (value >= 1_000_000_000_000) return `$${(value / 1_000_000_000_000).toFixed(2)}T`;
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(0)}B`;
  return `$${(value / 1_000_000).toFixed(0)}M`;
}

export function formatPercent(value: number) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

export function sentimentClass(score: number) {
  if (score >= 72) return "text-emerald-300";
  if (score >= 52) return "text-sky-200";
  if (score >= 40) return "text-amber-200";
  return "text-rose-300";
}

export function labelTone(label: string) {
  if (label === "Strong Watch") return "border-emerald-400/35 bg-emerald-400/10 text-emerald-200";
  if (label === "Bullish Setup") return "border-sky-400/35 bg-sky-400/10 text-sky-200";
  if (label === "High Risk") return "border-amber-400/35 bg-amber-400/10 text-amber-200";
  if (label === "Avoid for Now") return "border-rose-400/35 bg-rose-400/10 text-rose-200";
  return "border-zinc-400/25 bg-zinc-400/10 text-zinc-200";
}
