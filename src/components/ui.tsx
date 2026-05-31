import type { ReactNode } from "react";

/** Exact wordmark + terminal-glyph logo used in the navbar and footer. */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2 ${className}`}>
      <span className="grid h-6 w-6 place-items-center rounded-[6px] border border-white/15 bg-white/[0.03]">
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-white"
        >
          <path d="M5 8l4 4-4 4" />
          <path d="M12 16h7" />
        </svg>
      </span>
      <span className="text-[17px] font-medium tracking-[-0.02em] text-white">
        Exact
      </span>
    </span>
  );
}

/** "// Label" eyebrow shown above each section heading. */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="eyebrow flex items-center gap-1.5">
      <span className="text-white/25">{"//"}</span>
      <span>{children}</span>
    </p>
  );
}

/**
 * Two-tone section heading: leading sentence in white, trailing sentence
 * in muted gray, matching the original's split-color titles.
 */
export function SplitHeading({
  lead,
  trail,
  className = "",
}: {
  lead: string;
  trail: string;
  className?: string;
}) {
  return (
    <h2
      className={`font-display text-[32px] leading-[1.08] font-normal tracking-[-0.03em] sm:text-[36px] ${className}`}
    >
      <span className="text-white">{lead} </span>
      <span className="text-muted">{trail}</span>
    </h2>
  );
}
