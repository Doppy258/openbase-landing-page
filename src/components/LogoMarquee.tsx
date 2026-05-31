import Reveal from "./Reveal";

type Logo = { name: string; icon: "spark" | "orbit" | "wave" | "burst" };

const ROW_ONE: Logo[] = [
  { name: "SignFlow", icon: "orbit" },
  { name: "CloudSync", icon: "spark" },
  { name: "NotionKit", icon: "wave" },
  { name: "DataStream", icon: "burst" },
];

const ROW_TWO: Logo[] = [
  { name: "NotionKit", icon: "wave" },
  { name: "DataStream", icon: "burst" },
  { name: "SignFlow", icon: "orbit" },
  { name: "CloudSync", icon: "spark" },
];

function Glyph({ icon }: { icon: Logo["icon"] }) {
  const common = { width: 18, height: 18, viewBox: "0 0 24 24" } as const;
  switch (icon) {
    case "orbit":
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="3.2" fill="currentColor" stroke="none" />
          <ellipse cx="12" cy="12" rx="10" ry="4.5" />
        </svg>
      );
    case "spark":
      return (
        <svg {...common} fill="currentColor">
          <path d="M12 2c.6 4.8 2.4 6.6 7.2 7.2C14.4 9.8 12.6 11.6 12 16.4 11.4 11.6 9.6 9.8 4.8 9.2 9.6 8.6 11.4 6.8 12 2z" />
        </svg>
      );
    case "wave":
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M3 14c2-4 4-4 6 0s4 4 6 0 4-4 6 0" />
          <path d="M3 9c2-4 4-4 6 0s4 4 6 0 4-4 6 0" opacity="0.6" />
        </svg>
      );
    case "burst":
    default:
      return (
        <svg {...common} fill="currentColor">
          <path d="M12 2l1.8 6.5L20 5.6l-3.9 5.4L22 13l-6.2 1L17 20l-5-3.6L7 20l1.2-6L2 13l5.9-2L4 5.6l6.2 2.9L12 2z" />
        </svg>
      );
  }
}

function LogoMark({ logo }: { logo: Logo }) {
  return (
    <div className="flex items-center justify-center gap-2 text-white/45">
      <Glyph icon={logo.icon} />
      <span className="text-[15px] font-medium tracking-tight">{logo.name}</span>
    </div>
  );
}

export default function LogoMarquee() {
  return (
    <section className="px-4 pt-24 sm:pt-28">
      <Reveal className="mx-auto max-w-[820px] text-center">
        <p className="text-[15px] text-white/80">
          Trusted by developers at leading companies
        </p>
        <p className="mt-1.5 text-[12px] text-muted-2">Used by developers at</p>

        <div className="mt-9 flex flex-col gap-7">
          <div className="grid grid-cols-2 gap-x-8 gap-y-7 sm:grid-cols-4">
            {ROW_ONE.map((logo, i) => (
              <LogoMark key={`r1-${i}`} logo={logo} />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-7 sm:grid-cols-4">
            {ROW_TWO.map((logo, i) => (
              <LogoMark key={`r2-${i}`} logo={logo} />
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
