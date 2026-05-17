import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { ScoreFactor } from "@/lib/types";

export function ScoreBreakdown({ factors }: { factors: ScoreFactor[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Factor</TableHead>
          <TableHead className="text-right">Weight</TableHead>
          <TableHead className="text-right">Score</TableHead>
          <TableHead>Why</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {factors.map((factor) => (
          <TableRow key={factor.label}>
            <TableCell className="font-medium">{factor.label}</TableCell>
            <TableCell className="text-right font-mono">{Math.round(factor.weight * 100)}%</TableCell>
            <TableCell className="text-right font-mono">{factor.score}</TableCell>
            <TableCell className="max-w-md text-muted-foreground">{factor.rationale}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
