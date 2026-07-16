import type { Metadata } from "next";
import { cookies } from "next/headers";

import { LegacyPage } from "@/components/legacy-page";
import { BETA_ACCESS_COOKIE, hasValidBetaAccess } from "@/lib/beta-access";

export const metadata: Metadata = {
  title: "Openbase — The Screenless Control Surface",
  description:
    "Openbase is the screenless control surface for AI coding work: speak the task, keep agents running, approve commands, and review the diff.",
  openGraph: {
    title: "Openbase — The Screenless Control Surface",
    description:
      "Speak the task, keep a live coding call open, approve commands, and review the diff without staying pinned to your desktop.",
    type: "website",
    url: "/",
    images: ["/assets/openbase-icon.png"],
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default async function HomePage() {
  const cookieStore = await cookies();
  const accessGranted = hasValidBetaAccess(cookieStore.get(BETA_ACCESS_COOKIE)?.value);

  return (
    <LegacyPage
      accessGranted={accessGranted}
      file="index.html"
      script="script.js"
      showBetaSignup
    />
  );
}
