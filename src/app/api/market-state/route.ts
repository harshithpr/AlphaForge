import { marketState, sectors } from "@/lib/mock-data";

export async function GET() {
  return Response.json({
    ok: true,
    marketState,
    sectors,
    disclaimer: "Market regime is a research classification, not a trading instruction.",
  });
}
