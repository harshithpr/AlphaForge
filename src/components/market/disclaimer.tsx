import { ShieldCheck } from "lucide-react";

export function Disclaimer() {
  return (
    <div className="flex items-start gap-3 border-t border-white/10 bg-zinc-950/80 px-4 py-3 text-xs leading-5 text-zinc-400 md:px-6">
      <ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-300" aria-hidden />
      <p>
        AlphaForge provides automated market research for educational purposes only. This is not
        financial advice. Scores are general, impersonal research signals with visible assumptions,
        source links, risk notes, and no promise of profit.
      </p>
    </div>
  );
}
