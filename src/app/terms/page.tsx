import type { Metadata } from "next";
import { cookies } from "next/headers";

import { LegacyPage } from "@/components/legacy-page";
import { BETA_ACCESS_COOKIE, hasValidBetaAccess } from "@/lib/beta-access";

export const metadata: Metadata = {
  title: "Terms of Service | Openbase",
  description: "Terms of service and software risk notices for Openbase.",
};

export default async function TermsPage() {
  const cookieStore = await cookies();
  const accessGranted = hasValidBetaAccess(cookieStore.get(BETA_ACCESS_COOKIE)?.value);

  return (
    <LegacyPage
      accessGranted={accessGranted}
      bodyClass="page-body"
      file="terms.html"
      script="pages.js"
    />
  );
}
