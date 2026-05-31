"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;

export default function Hero() {
  return (
    <section id="top" className="relative px-4 pt-36 sm:pt-40">
      <div className="mx-auto max-w-[1180px]">
        {/* Headline */}
        <div className="mx-auto max-w-3xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease }}
            className="font-display text-[44px] leading-[1.0] font-normal tracking-[-0.03em] text-white sm:text-[56px]"
          >
            Code with exact precision.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.08, ease }}
            className="mx-auto mt-5 max-w-md text-[15px] leading-[1.5] text-muted"
          >
            The AI-native code editor that gets it exactly right.
            <br />
            No approximation. No bloat. Just perfect code, every time.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.16, ease }}
            className="mt-7 flex items-center justify-center gap-3"
          >
            <a
              href="#"
              className="rounded-lg bg-white px-5 py-2.5 text-[13px] font-medium text-black transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Download for macOs
            </a>
            <a
              href="#features"
              className="rounded-lg border border-white/10 bg-white/[0.03] px-5 py-2.5 text-[13px] font-medium text-white/90 transition-colors hover:bg-white/[0.07]"
            >
              Discover product
            </a>
          </motion.div>
        </div>

        {/* IDE mockup over painted backdrop */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.25, ease }}
          className="relative mx-auto mt-14 max-w-[1040px] overflow-hidden rounded-2xl border border-white/[0.06]"
        >
          <Image
            src="/assets/painting-hero.png"
            alt=""
            width={2912}
            height={1632}
            priority
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="relative px-6 pt-10 sm:px-16 sm:pt-16">
            <Image
              src="/assets/ide-full.jpg"
              alt="Exact code editor interface"
              width={2880}
              height={1840}
              priority
              className="w-full rounded-t-xl border border-black/40 shadow-[0_40px_120px_-20px_rgba(0,0,0,0.7)]"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
