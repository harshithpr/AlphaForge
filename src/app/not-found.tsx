import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-background px-4 py-16 text-foreground">
      <section className="w-full max-w-xl rounded-lg border border-white/10 bg-[#0E1628]/80 p-6">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-cyan-200">404</p>
        <h1 className="mt-4 text-3xl font-semibold">Page not found.</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          This AlphaForge route does not exist yet. Use the dashboard to keep researching.
        </p>
        <Button asChild className="mt-5">
          <Link href="/dashboard">
            <ArrowLeft className="size-4" aria-hidden />
            Back to dashboard
          </Link>
        </Button>
      </section>
    </main>
  );
}
