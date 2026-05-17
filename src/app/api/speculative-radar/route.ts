import {
  emergingNarratives,
  pennyStockSignals,
  speculativeSignals,
  supplyChainLinks,
} from "@/lib/mock-data";

export async function GET() {
  return Response.json({
    ok: true,
    speculativeSignals,
    pennyStockSignals,
    emergingNarratives,
    supplyChainLinks,
    disclaimer:
      "High risk / high reward signals are separated from normal recommendations and are not buy instructions.",
  });
}
