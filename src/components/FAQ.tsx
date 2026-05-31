"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import Reveal from "./Reveal";
import { Eyebrow } from "./ui";

const ITEMS = [
  {
    q: "Is Exact really free?",
    a: "Yes. The Free plan includes all core features with no time limit, no credit card, and unlimited local projects. Upgrade to Pro only when you need unlimited AI requests and advanced context.",
  },
  {
    q: "How does Exact compare to Cursor or GitHub Copilot?",
    a: "Exact focuses on precision over volume—one perfect completion instead of ten guesses—and ships with deep, full-codebase context out of the box, with no configuration required.",
  },
  {
    q: "Is my code private?",
    a: "Completely. Exact is 100% private by default. Your code stays on your machine and never leaves it unless you explicitly opt in to cloud features.",
  },
  {
    q: "What languages does Exact support?",
    a: "Exact supports 50+ languages with the same precision, including TypeScript, JavaScript, Python, Go, Rust, Java, C#, Ruby, PHP, and many more.",
  },
  {
    q: "Can I use Exact offline?",
    a: "Yes. The desktop app offers full offline support, so you can keep coding with local AI even without an internet connection.",
  },
  {
    q: "How do I migrate from my current editor?",
    a: "Migration takes seconds. Exact imports your settings, keybindings, and extensions automatically so you feel at home from the first launch.",
  },
];

function FaqRow({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-[#0c0b0a]">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="text-[14.5px] font-medium text-white">{q}</span>
        <Plus
          size={17}
          className={`shrink-0 text-white/50 transition-transform duration-300 ${
            open ? "rotate-45" : ""
          }`}
        />
      </button>
      <div
        className={`grid transition-all duration-300 ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="px-5 pb-5 text-[14px] leading-[1.55] text-muted">{a}</p>
        </div>
      </div>
    </div>
  );
}

export default function FAQ() {
  return (
    <section id="faq" className="px-4 pt-28 sm:pt-36">
      <div className="mx-auto max-w-[1180px]">
        <Reveal className="text-center">
          <div className="flex justify-center">
            <Eyebrow>FAQ</Eyebrow>
          </div>
          <h2 className="mt-3 font-display text-[32px] leading-[1.08] font-normal tracking-[-0.03em] text-white sm:text-[36px]">
            Questions? We&apos;ve got answers.
          </h2>
        </Reveal>

        <div className="mx-auto mt-12 flex max-w-[640px] flex-col gap-3">
          {ITEMS.map((item, i) => (
            <Reveal key={item.q} delay={i * 0.04}>
              <FaqRow q={item.q} a={item.a} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
