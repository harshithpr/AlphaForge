import { fetchGeopoliticalFeed } from "@/lib/source-adapters";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  return Response.json(await fetchGeopoliticalFeed());
}
