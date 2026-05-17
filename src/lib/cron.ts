export function getCronAuthError(request: Request): Response | null {
  const expected = process.env.CRON_SECRET;

  if (!expected) {
    return Response.json(
      { ok: false, error: "CRON_SECRET is not configured" },
      { status: 500 }
    );
  }

  if (request.headers.get("authorization") !== `Bearer ${expected}`) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  return null;
}
