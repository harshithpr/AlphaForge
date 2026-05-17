import { cn } from "@/lib/utils";

export function AlphaForgeMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      role="img"
      aria-label="AlphaForge mark"
      className={cn("size-9", className)}
    >
      <defs>
        <linearGradient id="alphaforge-mark-gradient" x1="8" y1="8" x2="40" y2="40">
          <stop offset="0" stopColor="#00C2FF" />
          <stop offset="0.56" stopColor="#E8F1FF" />
          <stop offset="1" stopColor="#7A5CFF" />
        </linearGradient>
      </defs>
      <rect
        x="4"
        y="4"
        width="40"
        height="40"
        rx="10"
        fill="#070B14"
        stroke="rgba(232, 241, 255, 0.16)"
      />
      <path
        d="M14 31.5 24 11l10 20.5M18.5 25.5h11"
        fill="none"
        stroke="url(#alphaforge-mark-gradient)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.4"
      />
      <path
        d="M13 17.5 20 24l-7 6.5M35 17.5 28 24l7 6.5"
        fill="none"
        stroke="#00C2FF"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity="0.62"
        strokeWidth="1.4"
      />
      <circle cx="24" cy="11" r="2" fill="#E8F1FF" />
      <circle cx="14" cy="31.5" r="1.7" fill="#00C2FF" />
      <circle cx="34" cy="31.5" r="1.7" fill="#7A5CFF" />
      <circle cx="24" cy="25.5" r="1.5" fill="#E8F1FF" />
    </svg>
  );
}

export function AlphaForgeWordmark({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center", className)}>
      <span className="brand text-[0.78rem] font-semibold tracking-[0.24em] text-[#E8F1FF]">
        ALPHAFORGE
      </span>
    </span>
  );
}
