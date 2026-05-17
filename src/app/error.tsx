"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="grid min-h-screen place-items-center bg-background px-4 py-16 text-foreground">
      <section className="w-full max-w-xl rounded-lg border border-white/10 bg-[#0E1628]/80 p-6">
        <AlertTriangle className="size-8 text-amber-300" aria-hidden />
        <h1 className="mt-5 text-3xl font-semibold">Something went wrong.</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          AlphaForge could not load this section. No market conclusion should be drawn from a
          failed data load.
        </p>
        <Button onClick={reset} className="mt-5">
          <RotateCcw className="size-4" aria-hidden />
          Try again
        </Button>
      </section>
    </main>
  );
}
