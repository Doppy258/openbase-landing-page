import Image from "next/image";
import Reveal from "./Reveal";

export default function FinalCTA() {
  return (
    <section className="px-4 pt-28 sm:pt-36">
      <div className="mx-auto max-w-[1180px]">
        <Reveal>
          <div className="relative grid items-center gap-8 overflow-hidden rounded-3xl border border-white/[0.06] bg-[#0c0b0a] p-8 sm:p-12 lg:grid-cols-2">
            <div className="max-w-md">
              <h2 className="font-display text-[30px] leading-[1.1] font-normal tracking-[-0.03em] text-white sm:text-[36px]">
                Start coding with precision today
              </h2>
              <p className="mt-4 text-[15px] leading-[1.5] text-muted">
                Free forever. Install in seconds.
                <br />
                Start building immediately.
              </p>
              <a
                href="#"
                className="mt-7 inline-flex rounded-lg bg-white px-5 py-2.5 text-[13px] font-medium text-black transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Download for macOS
              </a>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-white/[0.06]">
              <Image
                src="/assets/painting-cta.png"
                alt=""
                width={2912}
                height={1632}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="relative px-6 pt-8 sm:px-10 sm:pt-10">
                <Image
                  src="/assets/ide-full.jpg"
                  alt="Exact code editor"
                  width={2880}
                  height={1840}
                  className="w-full rounded-t-xl border border-black/40 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]"
                />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
