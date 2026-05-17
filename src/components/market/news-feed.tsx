import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { NewsItem } from "@/lib/types";

const tone = {
  positive: "border-emerald-400/35 bg-emerald-400/10 text-emerald-200",
  neutral: "border-sky-400/35 bg-sky-400/10 text-sky-200",
  negative: "border-rose-400/35 bg-rose-400/10 text-rose-200",
};

export function NewsFeed({ news }: { news: NewsItem[] }) {
  return (
    <Card className="rounded-lg border-white/10 bg-zinc-950/70">
      <CardHeader>
        <CardTitle>Latest Research Inputs</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {news.map((item) => (
          <article key={item.id} className="border-b border-white/10 pb-4 last:border-0 last:pb-0">
            <div className="flex flex-wrap items-center gap-2">
              {item.symbol ? <Badge variant="secondary">{item.symbol}</Badge> : null}
              <Badge className={tone[item.sentiment]} variant="outline">
                {item.sentiment}
              </Badge>
              <span className="text-xs text-muted-foreground">{item.source}</span>
            </div>
            <a
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="mt-2 flex items-start gap-2 text-sm font-medium hover:text-sky-200"
            >
              {item.title}
              <ExternalLink className="mt-0.5 size-3.5 shrink-0" aria-hidden />
            </a>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.summary}</p>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}
