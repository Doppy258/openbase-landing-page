"use client";

import { useState } from "react";
import Image from "next/image";
import { Copy, Check, Download, ExternalLink } from "lucide-react";
import Reveal from "./Reveal";
import { Eyebrow, SplitHeading } from "./ui";

function CopyCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard?.writeText(command);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="flex w-full items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-2.5 font-mono text-[13px] text-white/85 transition-colors hover:bg-white/[0.06]"
    >
      <span>{command}</span>
      {copied ? (
        <Check size={15} className="text-emerald-400" />
      ) : (
        <Copy size={15} className="text-white/50" />
      )}
    </button>
  );
}

function Card({
  image,
  title,
  body,
  children,
}: {
  image: string;
  title: string;
  body: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0c0b0a]">
      <div className="relative aspect-[16/10] overflow-hidden border-b border-white/[0.06]">
        <Image src={image} alt={title} fill sizes="380px" className="object-cover" />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-[16px] font-medium text-white">{title}</h3>
        <p className="mt-2 text-[14px] leading-[1.5] text-muted">{body}</p>
        <div className="mt-auto pt-5">{children}</div>
      </div>
    </div>
  );
}

export default function ThreeWays() {
  return (
    <section className="px-4 pt-28 sm:pt-36">
      <div className="mx-auto max-w-[1180px]">
        <Reveal>
          <Eyebrow>Three ways to code</Eyebrow>
          <SplitHeading
            className="mt-3"
            lead="Start coding your way."
            trail="Choose what works best."
          />
        </Reveal>

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          <Reveal>
            <Card
              image="/assets/mock-terminal.jpg"
              title="Command line"
              body="Install via npm and start coding instantly from your terminal."
            >
              <CopyCommand command="npm install -g exact" />
            </Card>
          </Reveal>

          <Reveal delay={0.06}>
            <Card
              image="/assets/mock-chat.jpg"
              title="Desktop app"
              body="Native macOS, Windows, and Linux app with full offline support."
            >
              <a
                href="#"
                className="flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-[13px] font-medium text-black transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <Download size={15} />
                Download for macOS
              </a>
            </Card>
          </Reveal>

          <Reveal delay={0.12}>
            <Card
              image="/assets/mock-editor.jpg"
              title="Browser"
              body="Try Exact instantly in your browser. No installation required."
            >
              <a
                href="#"
                className="flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-white/[0.07]"
              >
                Open in browser
                <ExternalLink size={14} />
              </a>
            </Card>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
