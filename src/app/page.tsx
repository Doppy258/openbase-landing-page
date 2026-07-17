import type { Metadata } from "next";
import { cookies } from "next/headers";

import { LegacyPage } from "@/components/legacy-page";
import { BETA_ACCESS_COOKIE, hasValidBetaAccess } from "@/lib/beta-access";

export const metadata: Metadata = {
  title: "Openbase — The Voice IDE",
  description:
    "Openbase lets you run coding agents by voice with live calls, command approvals, reports, and diff review.",
  openGraph: {
    title: "Openbase — The Voice IDE",
    description:
      "Write code from voice. Keep a live coding call open, approve commands, review diffs, and send the next instruction.",
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
