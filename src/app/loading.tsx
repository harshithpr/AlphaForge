export default function Loading() {
  return (
    <main className="grid min-h-screen place-items-center bg-background px-4 py-16 text-foreground">
      <div className="w-full max-w-xl rounded-lg border border-white/10 bg-[#0E1628]/80 p-6">
        <div className="h-4 w-32 animate-pulse rounded bg-cyan-300/20" />
        <div className="mt-6 h-8 w-3/4 animate-pulse rounded bg-white/10" />
        <div className="mt-4 grid gap-2">
          <div className="h-3 animate-pulse rounded bg-white/10" />
          <div className="h-3 w-5/6 animate-pulse rounded bg-white/10" />
        </div>
        <p className="mt-5 text-sm text-muted-foreground">Loading market data...</p>
      </div>
    </main>
  );
}
