import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatMarketCap, labelTone } from "@/lib/format";
import type { ResearchStock } from "@/lib/types";

export function ResearchTable({ stocks }: { stocks: ResearchStock[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Stock</TableHead>
          <TableHead>Sector</TableHead>
          <TableHead className="text-right">Long</TableHead>
          <TableHead className="text-right">Short</TableHead>
          <TableHead>Label</TableHead>
          <TableHead>Confidence</TableHead>
          <TableHead className="text-right">Market cap</TableHead>
          <TableHead className="w-14" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {stocks.map((stock) => (
          <TableRow key={stock.symbol}>
            <TableCell>
              <div className="font-medium">{stock.symbol}</div>
              <div className="text-xs text-muted-foreground">{stock.name}</div>
            </TableCell>
            <TableCell>{stock.sector}</TableCell>
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
                <Link href={`/stocks/${stock.symbol}`}>
                  <ArrowUpRight className="size-4" aria-hidden />
                </Link>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
