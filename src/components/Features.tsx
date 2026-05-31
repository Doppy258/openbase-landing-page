import Image from "next/image";
import Reveal from "./Reveal";
import { Eyebrow, SplitHeading } from "./ui";

type Feature = {
  title: string;
  body: string;
  cta: string;
  painting: string;
  mock: string;
};

const FEATURES: Feature[] = [
  {
    title: "Context-perfect AI chat",
    body: "Ask once, get exactly what you need. Our AI understands your entire codebase and gives you precise answers with exact line references.",
    cta: "Try AI chat",
    painting: "/assets/painting-feature-1.png",
    mock: "/assets/mock-chat.jpg",
  },
  {
    title: "Precision autocomplete",
    body: "Stop choosing between 10 suggestions. Exact gives you one perfect completion that matches your code style and intent.",
    cta: "See it in action",
    painting: "/assets/painting-feature-2.png",
    mock: "/assets/mock-editor.jpg",
  },
  {
    title: "AI-powered terminal",
    body: "Debug smarter with instant error detection, suggested fixes, and command optimization. Let Exact handle the terminal heavy lifting.",
    cta: "Explore terminal",
    painting: "/assets/painting-feature-3.png",
    mock: "/assets/mock-terminal.jpg",
  },
];

function Arrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FeatureRow({ feature, flip }: { feature: Feature; flip: boolean }) {
  return (
    <Reveal>
      <div
        className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-12 ${
          flip ? "lg:[&>*:first-child]:order-2" : ""
        }`}
      >
        {/* Mockup card */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/[0.06]">
          <Image
            src={feature.painting}
            alt=""
            fill
            sizes="(max-width: 1024px) 100vw, 560px"
            className="object-cover"
          />
          <div className="absolute inset-0 flex items-end justify-center px-8 pt-10">
            <Image
              src={feature.mock}
              alt={feature.title}
              width={1536}
              height={1536}
              className="w-[88%] translate-y-2 rounded-t-xl border border-black/40 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]"
            />
          </div>
        </div>

        {/* Copy */}
        <div className="max-w-md">
          <h3 className="font-display text-[24px] font-normal tracking-[-0.02em] text-white">
            {feature.title}
          </h3>
          <p className="mt-3 text-[15px] leading-[1.5] text-muted">
            {feature.body}
          </p>
          <a
            href="#"
            className="mt-6 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-white/[0.07]"
          >
            {feature.cta}
            <Arrow />
          </a>
        </div>
      </div>
    </Reveal>
  );
}

export default function Features() {
  return (
    <section id="features" className="px-4 pt-28 sm:pt-36">
      <div className="mx-auto max-w-[1180px]">
        <Reveal>
          <Eyebrow>Core features</Eyebrow>
          <SplitHeading
            className="mt-3 max-w-xl"
            lead="Code with precision."
            trail="Ship with confidence."
          />
        </Reveal>

        <div className="mt-16 flex flex-col gap-20 sm:gap-28">
          {FEATURES.map((feature, i) => (
            <FeatureRow key={feature.title} feature={feature} flip={i % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
