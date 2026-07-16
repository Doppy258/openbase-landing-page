import type { Metadata } from "next";
import { cookies } from "next/headers";

import { LegacyPage } from "@/components/legacy-page";
import { BETA_ACCESS_COOKIE, hasValidBetaAccess } from "@/lib/beta-access";

export const metadata: Metadata = {
  title: "Privacy Policy | Openbase",
  description: "Privacy policy for Openbase.",
};

export default async function PrivacyPage() {
  const cookieStore = await cookies();
  const accessGranted = hasValidBetaAccess(cookieStore.get(BETA_ACCESS_COOKIE)?.value);

  return (
    <LegacyPage
      accessGranted={accessGranted}
      bodyClass="page-body"
      file="privacy.html"
      script="pages.js"
    />
  );
}
