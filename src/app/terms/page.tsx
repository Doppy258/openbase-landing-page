import type { Metadata } from "next";

import { LegacyPage } from "@/components/legacy-page";

export const metadata: Metadata = {
  title: "Terms of Service | Openbase",
  description: "Terms of service and software risk notices for Openbase.",
};

export default function TermsPage() {
  return <LegacyPage bodyClass="page-body" file="terms.html" script="pages.js" />;
}
