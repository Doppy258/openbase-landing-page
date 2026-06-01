import StaticImage from "./StaticImage";

export default function Hero() {
  return (
    <section id="top" className="relative px-4 pt-36 sm:pt-40">
      <div className="mx-auto max-w-[1180px]">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="hero-in font-display text-[44px] leading-[1.0] font-normal tracking-[-0.03em] text-white sm:text-[56px]">
            Code with exact precision.
          </h1>

          <p className="hero-in hero-in-d1 mx-auto mt-5 max-w-md text-[15px] leading-[1.5] text-muted">
            The AI-native code editor that gets it exactly right.
            <br />
            No approximation. No bloat. Just perfect code, every time.
          </p>

          <div className="hero-in hero-in-d2 mt-7 flex items-center justify-center gap-3">
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
          </div>
        </div>

        <div className="hero-in hero-in-d3 relative mx-auto mt-14 max-w-[1040px] overflow-hidden rounded-2xl border border-white/[0.06]">
          <StaticImage
            src="/assets/painting-hero.png"
            alt=""
            width={1632}
            height={918}
            priority
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="relative px-6 pt-10 sm:px-16 sm:pt-16">
            <StaticImage
              src="/assets/ide-full.jpg"
              alt="Exact code editor interface"
              width={1840}
              height={1160}
              priority
              className="w-full rounded-t-xl border border-black/40 shadow-[0_40px_120px_-20px_rgba(0,0,0,0.7)]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
