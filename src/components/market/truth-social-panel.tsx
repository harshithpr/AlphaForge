import { RadioTower } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchGeopoliticalFeed } from "@/lib/source-adapters";

export async function TruthSocialPanel() {
  const feed = await fetchGeopoliticalFeed();

  return (
    <Card className="rounded-lg border-white/10 bg-zinc-950/70">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RadioTower className="size-5 text-sky-300" aria-hidden />
          Geopolitical Social Feed
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        <p className="text-sm leading-6 text-muted-foreground">{feed.warning}</p>
        <div className="flex flex-wrap items-center gap-2">
          {feed.connected ? (
            <Badge className="w-fit border-amber-400/35 bg-amber-400/10 text-amber-200" variant="outline">
              Live source
            </Badge>
          ) : (
            <Badge className="w-fit" variant="secondary">Disabled until configured</Badge>
          )}
          <Badge className="w-fit" variant="outline">{feed.source}</Badge>
          <span className="text-xs text-muted-foreground">
            Updated {new Date(feed.updatedAt).toLocaleTimeString()}
          </span>
        </div>
        {feed.items.map((item) =>
          item.url ? (
            <a
              key={`${item.title}-${item.url}`}
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-white/10 p-3 transition hover:border-sky-400/30 hover:bg-sky-400/5"
            >
              <span className="text-sm font-medium">{item.title}</span>
              <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">{item.description}</p>
            </a>
          ) : (
            <div
              key={item.title}
              className="rounded-lg border border-white/10 p-3"
            >
              <span className="text-sm font-medium">{item.title}</span>
              <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">{item.description}</p>
            </div>
          )
        )}
      </CardContent>
    </Card>
  );
}
