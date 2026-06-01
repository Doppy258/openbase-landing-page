import StaticImage from "./StaticImage";
import { Logo } from "./ui";

const NAV = [
  { label: "Features", href: "#features" },
  { label: "Use cases", href: "#use-cases" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

function Social({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <a
      href="#"
      aria-label={label}
      className="grid h-9 w-9 place-items-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-white/70 transition-colors hover:bg-white/[0.07] hover:text-white"
    >
      {children}
    </a>
  );
}

export default function Footer() {
  return (
    <footer className="mt-28 border-t border-white/[0.06] bg-[#0b0a09] px-4 pt-14 pb-10 sm:mt-36">
      <div className="mx-auto max-w-[1180px]">
        <div className="grid gap-10 sm:grid-cols-2">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-4 text-[14px] leading-[1.5] text-muted">
              The AI code editor built for precision. Write less, build more,
              ship faster.
            </p>
            <div className="mt-6 flex gap-2.5">
              <Social label="X">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644z" />
                </svg>
              </Social>
              <Social label="Community">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </Social>
              <Social label="LinkedIn">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </Social>
            </div>
          </div>

          <div className="sm:justify-self-end">
            <p className="text-[13px] font-medium text-white">Navigation</p>
            <ul className="mt-4 flex flex-col gap-3">
              {NAV.map((n) => (
                <li key={n.label}>
                  <a
                    href={n.href}
                    className="text-[14px] text-muted transition-colors hover:text-white"
                  >
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex items-center gap-2 text-[13px] text-muted-2">
          <span>Created by</span>
          <StaticImage
            src="/assets/avatar-arthur.jpg"
            alt="Arthur"
            width={20}
            height={20}
            className="h-5 w-5 rounded-full object-cover grayscale"
          />
          <span className="text-white/70">Arthur</span>
          <span>in</span>
          <span className="text-white/70">Framer</span>
        </div>
      </div>
    </footer>
  );
}
