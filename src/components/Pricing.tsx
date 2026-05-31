"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import Reveal from "./Reveal";
import { Eyebrow, SplitHeading } from "./ui";

type Plan = {
  name: string;
  priceMonthly: string;
  priceYearly: string;
  suffix?: string;
  blurb: string;
  cta: string;
  features: string[];
  popular?: boolean;
  custom?: boolean;
};

const PLANS: Plan[] = [
  {
    name: "Free",
    priceMonthly: "€0",
    priceYearly: "€0",
    suffix: "/month",
    blurb: "Perfect for trying Exact. All core features included, forever.",
    cta: "Get started",
    features: [
      "Unlimited local projects",
      "AI autocomplete (basic)",
      "Code chat assistant",
      "50+ languages support",
      "Terminal integration",
    ],
  },
  {
    name: "Pro",
    priceMonthly: "€29",
    priceYearly: "€23",
    suffix: "/month",
    blurb:
      "For developers who need advanced features and unlimited AI requests.",
    cta: "Start 14-day trial",
    popular: true,
    features: [
      "Everything in Free",
      "Unlimited AI requests",
      "Advanced context (full codebase)",
      "Priority AI responses",
      "Smart refactoring tools",
      "Multi-file editing",
    ],
  },
  {
    name: "Enterprise",
    priceMonthly: "Custom",
    priceYearly: "Custom",
    blurb:
      "For teams that need dedicated support, custom deployment, and advanced security.",
    cta: "Contact sales",
    custom: true,
    features: [
      "Everything in Pro",
      "Unlimited team members",
      "Self-hosted deployment",
      "SSO & SAML",
      "Custom AI model training",
      "Dedicated support manager",
      "SLA guarantees",
    ],
  },
];

function PlanCard({ plan, yearly }: { plan: Plan; yearly: boolean }) {
  const price = yearly ? plan.priceYearly : plan.priceMonthly;
  return (
    <div
      className={`relative flex h-full flex-col rounded-2xl border p-7 ${
        plan.popular
          ? "border-white/15 bg-white/[0.05]"
          : "border-white/[0.06] bg-[#0c0b0a]"
      }`}
    >
      <div className="flex items-center justify-between">
        <p className="text-[15px] font-medium text-white">{plan.name}</p>
        {plan.popular && (
          <span className="rounded-full border border-white/15 bg-white/[0.06] px-2.5 py-0.5 text-[11px] text-white/80">
            Popular
          </span>
        )}
      </div>

      <div className="mt-5 flex items-end gap-1">
        <span className="font-display text-[40px] leading-none font-normal tracking-[-0.03em] text-white">
          {price}
        </span>
        {!plan.custom && (
          <span className="mb-1 text-[13px] text-muted-2">{plan.suffix}</span>
        )}
      </div>

      <p className="mt-4 text-[14px] leading-[1.5] text-muted">{plan.blurb}</p>

      <a
        href="#"
        className={`mt-6 rounded-lg px-4 py-2.5 text-center text-[13px] font-medium transition-colors ${
          plan.popular
            ? "bg-white text-black hover:bg-white/90"
            : "border border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.07]"
        }`}
      >
        {plan.cta}
      </a>

      <div className="mt-7 border-t border-white/[0.06] pt-6">
        <p className="text-[12px] text-muted-2">Features</p>
        <ul className="mt-4 flex flex-col gap-3">
          {plan.features.map((f) => (
            <li key={f} className="flex items-center gap-2.5 text-[13.5px] text-white/75">
              <Check size={15} className="shrink-0 text-white/50" strokeWidth={2} />
              {f}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function Pricing() {
  const [yearly, setYearly] = useState(false);

  return (
    <section id="pricing" className="px-4 pt-28 sm:pt-36">
      <div className="mx-auto max-w-[1180px]">
        <Reveal>
          <Eyebrow>Pricing</Eyebrow>
          <SplitHeading
            className="mt-3"
            lead="Start free."
            trail="Scale as you grow."
          />
        </Reveal>

        <Reveal delay={0.05}>
          <div className="mt-8 inline-flex items-center gap-1.5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-1.5">
            <button
              onClick={() => setYearly(false)}
              className={`rounded-lg px-3.5 py-1.5 text-[13px] transition-colors ${
                !yearly ? "bg-white/[0.08] text-white" : "text-white/55 hover:text-white/80"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`rounded-lg px-3.5 py-1.5 text-[13px] transition-colors ${
                yearly ? "bg-white/[0.08] text-white" : "text-white/55 hover:text-white/80"
              }`}
            >
              Yearly
            </button>
            <span className="px-2 text-[12px] text-muted-2">Save 20%</span>
          </div>
        </Reveal>

        <div className="mt-10 grid items-start gap-5 lg:grid-cols-3">
          {PLANS.map((plan, i) => (
            <Reveal key={plan.name} delay={i * 0.06}>
              <PlanCard plan={plan} yearly={yearly} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
