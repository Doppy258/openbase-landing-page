import type { Metadata } from "next";

import { LegacyPage } from "@/components/legacy-page";

export const metadata: Metadata = {
  title: "Openbase — The Voice IDE",
  description:
    "Openbase lets you write code from voice with live coding calls, Codex threads, approvals, reports, and diff review.",
  openGraph: {
    title: "Openbase — The Voice IDE",
    description:
      "Write code from voice. Speak the task, keep a live coding call open, approve commands, and review the diff from one control surface.",
    type: "website",
    url: "/",
    images: ["/assets/openbase-icon.png"],
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function HomePage() {
  return <LegacyPage file="index.html" script="script.js" />;
}
