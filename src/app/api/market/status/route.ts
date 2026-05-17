export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const now = new Date();
  const nyTime = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    hour: "numeric",
    minute: "numeric",
    weekday: "short",
    hour12: false,
  }).formatToParts(now);

  const weekday = nyTime.find((part) => part.type === "weekday")?.value;
  const hour = Number(nyTime.find((part) => part.type === "hour")?.value);
  const minute = Number(nyTime.find((part) => part.type === "minute")?.value);

  const totalMinutes = hour * 60 + minute;
  const isWeekday = !["Sat", "Sun"].includes(weekday ?? "");
  const isOpen = isWeekday && totalMinutes >= 9 * 60 + 30 && totalMinutes < 16 * 60;

  return Response.json({
    isOpen,
    status: isOpen ? "Market Open" : "Market Closed",
    timezone: "America/New_York",
    updatedAt: now.toISOString(),
    warning: isOpen
      ? "Live market data may change quickly."
      : "Market is closed. Prices may reflect delayed or last available data.",
  });
}
