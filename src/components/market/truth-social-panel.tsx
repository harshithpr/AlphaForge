import { RadioTower } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchTruthSocialSignals } from "@/lib/source-adapters";

export async function TruthSocialPanel() {
  const feed = await fetchTruthSocialSignals();

  return (
    <Card className="rounded-lg border-white/10 bg-zinc-950/70">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RadioTower className="size-5 text-sky-300" aria-hidden />
          Geopolitical Social Feed
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        <p className="text-sm leading-6 text-muted-foreground">{feed.note}</p>
        {feed.enabled ? (
          <Badge className="w-fit border-amber-400/35 bg-amber-400/10 text-amber-200" variant="outline">
            Experimental source
          </Badge>
        ) : (
          <Badge className="w-fit" variant="secondary">Disabled until configured</Badge>
        )}
        {feed.signals.map((signal) => (
          <a
            key={signal.id}
            href={signal.url}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-white/10 p-3 hover:border-sky-400/30"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium">{signal.title}</span>
              {signal.matchedKeywords.map((keyword) => (
                <Badge key={keyword} variant="outline">{keyword}</Badge>
              ))}
            </div>
            <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">{signal.text}</p>
          </a>
        ))}
      </CardContent>
    </Card>
  );
}
