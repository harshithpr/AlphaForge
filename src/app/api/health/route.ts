export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  return Response.json({
    status: "ok",
    version: "1.0.0",
    updatedAt: new Date().toISOString(),
    service: "AlphaForge",
  });
}
