import Image from "next/image";
import Reveal from "./Reveal";
import { Eyebrow, SplitHeading } from "./ui";

type Author = { name: string; role: string; avatar: string };
type Card = { quote: string; author?: Author; faded?: boolean };

const COLUMNS: Card[][] = [
  [
    {
      quote:
        "Exact cut my development time in half. The AI actually understands what I'm building and suggests exactly what I need. No more wading through irrelevant completions.",
      author: {
        name: "Sarah Chen",
        role: "Senior Engineer",
        avatar: "/assets/avatar-sarah.png",
      },
    },
    {
      quote:
        "Zero setup, instant productivity. I switched from Cursor and never looked back. Exact just works, and it's noticeably faster. The refactoring feature alone is worth it.",
    },
    {
      quote:
        "Get the exact answer with line numbers and context. My productivity has skyrocketed.",
      faded: true,
    },
  ],
  [
    {
      quote:
        "Finally, an AI editor that doesn't feel like it's guessing. Context-aware suggestions that actually make sense. It's like pair programming with someone who knows your codebase.",
    },
    {
      quote:
        "Best AI autocomplete I've ever used. It's like Exact reads my mind—one suggestion, always the right one. And the privacy-first approach gives me peace of mind.",
      author: {
        name: "Ethan R",
        role: "Devops",
        avatar: "/assets/avatar-ethan.jpg",
      },
    },
    {
      quote: "No more wading through irrelevant completions.",
      faded: true,
    },
  ],
  [
    {
      quote:
        "I was skeptical about AI coding tools until Exact. The precision is unmatched—it gets my code style, understands dependencies, and never breaks my builds. Game changer.",
      author: {
        name: "Emma Larsson",
        role: "Full-stack Developer",
        avatar: "/assets/avatar-emma.png",
      },
    },
    {
      quote:
        "Exact eliminated the back-and-forth I had with other AI assistants. Ask once, get the exact answer with line numbers and context. My productivity has skyrocketed.",
    },
    {
      quote: "The privacy-first approach gives me peace of mind.",
      faded: true,
    },
  ],
];

function TestimonialCard({ card }: { card: Card }) {
  return (
    <div
      className={`rounded-2xl border border-white/[0.06] bg-[#0c0b0a] p-5 ${
        card.faded ? "opacity-40" : ""
      }`}
    >
      <p className="text-[14px] leading-[1.5] text-white/80">{card.quote}</p>
      {card.author && (
        <div className="mt-5 flex items-center gap-3 border-t border-white/[0.06] pt-4">
          <Image
            src={card.author.avatar}
            alt={card.author.name}
            width={40}
            height={40}
            className="h-9 w-9 rounded-full object-cover"
          />
          <div>
            <p className="text-[13px] font-medium text-white">
              {card.author.name}
            </p>
            <p className="text-[12px] text-muted-2">{card.author.role}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section id="testimonials" className="px-4 pt-28 sm:pt-36">
      <div className="mx-auto max-w-[1180px]">
        <Reveal>
          <Eyebrow>Testimonials</Eyebrow>
          <SplitHeading
            className="mt-3"
            lead="Loved by developers."
            trail="Built for productivity."
          />
        </Reveal>

        <div className="relative mt-14">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {COLUMNS.map((col, ci) => (
              <div key={ci} className="flex flex-col gap-4">
                {col.map((card, i) => (
                  <Reveal key={i} delay={i * 0.05}>
                    <TestimonialCard card={card} />
                  </Reveal>
                ))}
              </div>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0a0908] to-transparent" />
        </div>
      </div>
    </section>
  );
}
