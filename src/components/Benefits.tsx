import {
  Target,
  Package,
  Lock,
  Zap,
  Braces,
  RefreshCw,
  type LucideIcon,
} from "lucide-react";
import Reveal from "./Reveal";
import { Eyebrow, SplitHeading } from "./ui";

type Benefit = { icon: LucideIcon; title: string; body: string };

const BENEFITS: Benefit[] = [
  {
    icon: Target,
    title: "Full codebase understanding",
    body: "AI that understands your entire project, not just the current file.",
  },
  {
    icon: Package,
    title: "Works out of the box",
    body: "Install once, start coding. Zero configuration required.",
  },
  {
    icon: Lock,
    title: "Your code stays yours",
    body: "100% private by default. Your code never leaves your machine.",
  },
  {
    icon: Zap,
    title: "Instant responses",
    body: "Sub-50ms autocomplete and real-time AI. No lag, ever.",
  },
  {
    icon: Braces,
    title: "Every language you use",
    body: "50+ languages supported with the same precision.",
  },
  {
    icon: RefreshCw,
    title: "Refactor with confidence",
    body: "Change once, update everywhere. Zero broken imports.",
  },
];

export default function Benefits() {
  return (
    <section className="px-4 pt-28 sm:pt-36">
      <div className="mx-auto max-w-[1180px]">
        <Reveal>
          <Eyebrow>Benefits</Eyebrow>
          <SplitHeading
            className="mt-3"
            lead="Ship faster."
            trail="Code better."
          />
        </Reveal>

        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.06] sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((b, i) => {
            const Icon = b.icon;
            return (
              <Reveal key={b.title} delay={(i % 3) * 0.06}>
                <div className="h-full bg-[#0c0b0a] p-7">
                  <span className="grid h-10 w-10 place-items-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-white/80">
                    <Icon size={17} strokeWidth={1.6} />
                  </span>
                  <h3 className="mt-5 text-[15px] font-medium text-white">
                    {b.title}
                  </h3>
                  <p className="mt-2 text-[14px] leading-[1.5] text-muted">
                    {b.body}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
