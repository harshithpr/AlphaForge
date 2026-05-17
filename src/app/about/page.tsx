import { AlphaForgeMark, AlphaForgeWordmark } from "@/components/market/brand-mark";
import { AppShell } from "@/components/market/app-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <AppShell>
      <div className="mx-auto grid min-h-[calc(100vh-7rem)] w-full max-w-5xl place-items-center px-4 py-10 md:px-6">
        <Card className="w-full rounded-lg border-white/10 bg-[#0E1628]/80">
          <CardContent className="grid gap-8 p-6 md:grid-cols-[0.8fr_1.2fr] md:p-8">
            <div className="flex flex-col justify-between gap-8 rounded-lg border border-white/10 bg-[#070B14]/70 p-5">
              <div>
                <AlphaForgeMark className="size-16" />
                <AlphaForgeWordmark className="mt-5" />
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge className="border-cyan-400/35 bg-cyan-400/10 text-cyan-100" variant="outline">
                  Student developer
                </Badge>
                <Badge className="border-violet-400/35 bg-violet-400/10 text-violet-100" variant="outline">
                  Aerospace
                </Badge>
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-cyan-200">
                About the builder
              </p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
                Harshith Praveen
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-[#E8F1FF]/78">
                Harshith Praveen is a student developer and aspiring aerospace engineer building
                AI-powered systems for market intelligence, advanced technology, and futuristic
                software design.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
