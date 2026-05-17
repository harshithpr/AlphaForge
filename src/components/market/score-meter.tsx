import { cn } from "@/lib/utils";

type ScoreMeterProps = {
  score: number;
  label: string;
  tone?: "emerald" | "sky" | "amber" | "rose" | "zinc";
  size?: "sm" | "md";
};

const toneMap = {
  emerald: "#34d399",
  sky: "#38bdf8",
  amber: "#fbbf24",
  rose: "#fb7185",
  zinc: "#d4d4d8",
};

export function ScoreMeter({ score, label, tone = "emerald", size = "md" }: ScoreMeterProps) {
  const dimension = size === "sm" ? "size-20" : "size-28";
  const textSize = size === "sm" ? "text-xl" : "text-3xl";

  return (
    <div className="flex items-center gap-3">
      <div
        className={cn("grid shrink-0 place-items-center rounded-full", dimension)}
        style={{
          background: `conic-gradient(${toneMap[tone]} ${score * 3.6}deg, rgba(255,255,255,0.08) 0deg)`,
        }}
        aria-label={`${label}: ${score} out of 100`}
      >
        <div className="grid size-[78%] place-items-center rounded-full bg-background ring-1 ring-white/10">
          <span className={cn("font-semibold tabular-nums", textSize)}>{score}</span>
        </div>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">0-100 explainable score</p>
      </div>
    </div>
  );
}
