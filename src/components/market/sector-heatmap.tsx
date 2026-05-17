import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SectorSignal } from "@/lib/types";

function tileClass(score: number) {
  if (score >= 76) return "border-emerald-400/25 bg-emerald-400/15 text-emerald-100";
  if (score >= 60) return "border-sky-400/25 bg-sky-400/10 text-sky-100";
  if (score >= 45) return "border-amber-400/25 bg-amber-400/10 text-amber-100";
  return "border-rose-400/25 bg-rose-400/10 text-rose-100";
}

export function SectorHeatmap({ sectors }: { sectors: SectorSignal[] }) {
  return (
    <Card className="rounded-lg border-white/10 bg-zinc-950/70">
      <CardHeader>
        <CardTitle>Sector Rotation Radar</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {sectors.map((sector) => {
            const composite = Math.round(
              sector.relativeStrength * 0.45 + sector.sentiment * 0.25 + sector.flow * 0.3
            );

            return (
              <Link
                key={sector.sector}
                href={sector.sector === "Semiconductors" ? "/sectors/semiconductors" : "/market-breadth"}
                className={`block min-h-28 min-w-0 overflow-hidden rounded-lg border p-3 transition hover:-translate-y-0.5 hover:border-cyan-400/60 ${tileClass(composite)}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="min-w-0 break-words text-sm font-medium">{sector.sector}</p>
                  <p className="font-mono text-lg">{composite}</p>
                </div>
                <p className="mt-6 text-xs text-current/75">{sector.label}</p>
                <div className="mt-3 h-1 rounded-full bg-white/10">
                  <div className="h-1 rounded-full bg-current" style={{ width: `${composite}%` }} />
                </div>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
