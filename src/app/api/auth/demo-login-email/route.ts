export const dynamic = "force-dynamic";
export const revalidate = 0;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function buildEmail({ name }: { name: string }) {
  const safeName = escapeHtml(name || "there");

  return {
    subject: "You're in AlphaForge",
    text: `Hi ${name || "there"},\n\nYou're logged in to AlphaForge. You can now track global markets, screen stocks, research live charts, and monitor risk signals from your workspace.\n\nAlphaForge is for educational market research only and is not financial advice.\n\nOpen AlphaForge: https://apforges.vercel.app`,
    html: `<!doctype html>
<html>
  <body style="margin:0;background:#070B14;color:#E8F1FF;font-family:Inter,Arial,sans-serif;">
    <div style="max-width:640px;margin:0 auto;padding:40px 24px;">
      <div style="border:1px solid rgba(232,241,255,0.12);border-radius:18px;background:#0E1628;padding:28px;box-shadow:0 24px 80px rgba(0,194,255,0.12);">
        <p style="margin:0 0 18px;color:#00C2FF;font-size:13px;letter-spacing:0.24em;text-transform:uppercase;">AlphaForge access confirmed</p>
        <h1 style="margin:0;color:#E8F1FF;font-size:34px;line-height:1.05;">You're logged in, ${safeName}.</h1>
        <p style="margin:20px 0 0;color:rgba(232,241,255,0.74);font-size:16px;line-height:1.65;">
          Your AlphaForge workspace is ready. You can now track global markets, screen stocks, open the live research terminal, and monitor risk signals from one clean dashboard.
        </p>
        <div style="margin:26px 0;padding:18px;border-radius:14px;background:rgba(0,194,255,0.08);border:1px solid rgba(0,194,255,0.22);">
          <p style="margin:0;color:#9BEAFF;font-size:15px;line-height:1.6;">
            Start with the Global Market Screener, then use Research for charts and Explain for risk-aware summaries.
          </p>
        </div>
        <a href="https://apforges.vercel.app" style="display:inline-block;background:#00C2FF;color:#031018;text-decoration:none;font-weight:700;padding:13px 18px;border-radius:12px;">Open AlphaForge</a>
        <p style="margin:24px 0 0;color:rgba(232,241,255,0.45);font-size:12px;line-height:1.55;">
          Educational market research only. AlphaForge does not provide financial advice or guarantee outcomes.
        </p>
      </div>
    </div>
  </body>
</html>`,
  };
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: unknown; name?: unknown };
    const email = String(body.email ?? "").trim().toLowerCase();
    const name = String(body.name ?? "").trim();

    if (!emailPattern.test(email)) {
      return Response.json({ ok: false, error: "A valid email is required." }, { status: 400 });
    }

    if (!process.env.RESEND_API_KEY) {
      return Response.json({
        ok: true,
        sent: false,
        warning: "Set RESEND_API_KEY and RESEND_FROM_EMAIL to send login confirmation emails.",
      });
    }

    const from = process.env.RESEND_FROM_EMAIL ?? "AlphaForge <onboarding@resend.dev>";
    const emailContent = buildEmail({ name });
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [email],
        subject: emailContent.subject,
        text: emailContent.text,
        html: emailContent.html,
      }),
    });

    if (!response.ok) {
      return Response.json({
        ok: true,
        sent: false,
        warning: `Email provider returned ${response.status}.`,
      });
    }

    return Response.json({ ok: true, sent: true });
  } catch {
    return Response.json({ ok: true, sent: false, warning: "Email confirmation failed." });
  }
}
