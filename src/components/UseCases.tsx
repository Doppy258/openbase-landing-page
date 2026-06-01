"use client";

import { useState } from "react";
import Reveal from "./Reveal";
import StaticImage from "./StaticImage";
import CodeBlock from "./CodeBlock";
import { Eyebrow, SplitHeading } from "./ui";

type Tab = {
  label: string;
  heading: string;
  body: string;
  code: string;
};

const TABS: Tab[] = [
  {
    label: "Full-stack",
    heading: "Full-stack development",
    body: "Build frontend and backend seamlessly. Exact understands your entire stack—from React components to database queries—and helps you ship faster with context-aware suggestions.",
    code: `import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    // AI suggestion: Add pagination and filtering
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) return res.status(500).json({ error })
    return res.status(200).json(data)
  }
}`,
  },
  {
    label: "Debug & refactor",
    heading: "Debug and refactor",
    body: "Find the root cause in seconds. Exact traces errors across files, explains what went wrong, and refactors safely without breaking a single import.",
    code: `// Exact: detected a null reference on line 4
function getUserName(user) {
  // AI fix: add a safe fallback
  return user?.profile?.name ?? 'Guest'
}

export function greet(user) {
  const name = getUserName(user)
  return \`Welcome back, \${name}!\`
}`,
  },
  {
    label: "API integration",
    heading: "API integration",
    body: "Wire up any API with confidence. Exact generates typed clients, handles auth, and writes the fetch logic so you can focus on the product.",
    code: `import { z } from 'zod'

const User = z.object({
  id: z.string(),
  email: z.string().email(),
})

export async function getUser(id: string) {
  const res = await fetch(\`/api/users/\${id}\`)
  if (!res.ok) throw new Error('Request failed')
  return User.parse(await res.json())
}`,
  },
  {
    label: "Testing & CI/CD",
    heading: "Testing and CI/CD",
    body: "Ship with a safety net. Exact writes meaningful tests, keeps coverage high, and wires up pipelines that catch regressions before they merge.",
    code: `import { test, expect } from 'vitest'
import { greet } from './greet'

test('greets a known user', () => {
  const result = greet({ profile: { name: 'Ada' } })
  expect(result).toBe('Welcome back, Ada!')
})

test('falls back to Guest', () => {
  expect(greet(null)).toBe('Welcome back, Guest!')
})`,
  },
];

export default function UseCases() {
  const [active, setActive] = useState(0);
  const tab = TABS[active];

  return (
    <section id="use-cases" className="px-4 pt-28 sm:pt-36">
      <div className="mx-auto max-w-[1180px]">
        <Reveal>
          <Eyebrow>Use cases</Eyebrow>
          <SplitHeading
            className="mt-3"
            lead="One tool."
            trail="Every use case."
          />
        </Reveal>

        <Reveal delay={0.05}>
          <div className="mt-8 inline-flex flex-wrap gap-1.5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-1.5">
            {TABS.map((t, i) => (
              <button
                key={t.label}
                onClick={() => setActive(i)}
                className={`rounded-lg px-3.5 py-1.5 text-[13px] transition-colors ${
                  i === active
                    ? "bg-white/[0.08] text-white"
                    : "text-white/55 hover:text-white/80"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="relative mt-6 overflow-hidden rounded-2xl border border-white/[0.06]">
            <StaticImage
              src="/assets/painting-hero.png"
              alt=""
              width={1632}
              height={918}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="relative grid place-items-center px-4 py-16 sm:py-24">
              <div className="w-full max-w-[640px] overflow-hidden rounded-xl border border-white/10 bg-[#0c0c0e]/95 shadow-[0_40px_120px_-20px_rgba(0,0,0,0.8)] backdrop-blur-sm">
                <CodeBlock code={tab.code} />
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-[12px] text-muted-2">{tab.heading}</p>
              <p className="mt-2 text-[15px] leading-[1.5] text-white/80">
                {tab.body}
              </p>
            </div>
            <a
              href="#"
              className="shrink-0 self-start rounded-lg bg-white px-5 py-2.5 text-[13px] font-medium text-black transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Start building
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
