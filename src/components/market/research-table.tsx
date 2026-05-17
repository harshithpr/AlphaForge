import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatMarketCap, formatPercent, labelTone } from "@/lib/format";
import type { ResearchStock } from "@/lib/types";

export type LiveQuote = {
  symbol: string;
  name?: string;
  price: number | null;
  change: number | null;
  changePercent: number | null;
  volume: number | null;
  marketState: string;
  updatedAt: string;
  isLive?: boolean;
};

export function ResearchTable({
  stocks,
  quotes,
}: {
  stocks: ResearchStock[];
  quotes?: Record<string, LiveQuote>;
}) {
  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Stock</TableHead>
            <TableHead>Sector</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Change</TableHead>
            <TableHead className="text-right">Volume</TableHead>
            <TableHead className="text-right">Long</TableHead>
            <TableHead className="text-right">Short</TableHead>
            <TableHead>Label</TableHead>
            <TableHead>Confidence</TableHead>
            <TableHead className="text-right">Market cap</TableHead>
            <TableHead className="w-14" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {stocks.map((stock) => {
            const quote = quotes?.[stock.symbol];
            const price = quote?.price ?? stock.price;
            const changePercent = quote?.changePercent ?? stock.changePercent;

            return (
              <TableRow key={stock.symbol}>
                <TableCell>
                  <div className="font-medium">{stock.symbol}</div>
                  <div className="text-xs text-muted-foreground">{quote?.name ?? stock.name}</div>
                  {quote?.updatedAt ? (
                    <div className="mt-1 text-[0.68rem] text-muted-foreground/70">
                      {quote.isLive === false ? "Research fallback" : "Updated"}{" "}
                      {new Date(quote.updatedAt).toLocaleTimeString()}
                    </div>
                  ) : null}
                </TableCell>
                <TableCell>{stock.sector}</TableCell>
                <TableCell className="text-right font-mono">
                  {typeof price === "number" ? `$${price.toFixed(2)}` : "N/A"}
                </TableCell>
                <TableCell
                  className={
                    typeof changePercent === "number" && changePercent >= 0
                      ? "text-right font-mono text-emerald-300"
                      : "text-right font-mono text-rose-300"
                  }
                >
                  {typeof changePercent === "number" ? formatPercent(changePercent) : "N/A"}
                </TableCell>
                <TableCell className="text-right font-mono">
                  {typeof quote?.volume === "number" ? quote.volume.toLocaleString() : "N/A"}
                </TableCell>
                <TableCell className="text-right font-mono">{stock.longTermScore}</TableCell>
                <TableCell className="text-right font-mono">{stock.shortTermScore}</TableCell>
                <TableCell>
                  <Badge className={labelTone(stock.recommendationLabel)} variant="outline">
                    {stock.recommendationLabel}
                  </Badge>
                </TableCell>
                <TableCell>{stock.confidence}</TableCell>
                <TableCell className="text-right font-mono">{formatMarketCap(stock.marketCap)}</TableCell>
                <TableCell>
                  <Button asChild size="icon-sm" variant="ghost" aria-label={`Open ${stock.symbol}`}>
                    <Link href={`/stocks/${encodeURIComponent(stock.symbol)}`}>
                      <ArrowUpRight className="size-4" aria-hidden />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
