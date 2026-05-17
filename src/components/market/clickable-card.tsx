import Link from "next/link";
import { cn } from "@/lib/utils";

type ClickableCardProps = {
  href: string;
  className?: string;
  children: React.ReactNode;
};

export function ClickableCard({ href, className, children }: ClickableCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group block min-w-0 overflow-hidden rounded-lg border border-white/10 bg-zinc-950/70 transition duration-200 hover:-translate-y-0.5 hover:border-cyan-400/60 hover:bg-cyan-400/5 hover:shadow-[0_0_28px_rgba(0,194,255,0.12)]",
        className
      )}
    >
      {children}
    </Link>
  );
}
