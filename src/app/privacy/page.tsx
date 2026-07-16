import type { Metadata } from "next";

import { LegacyPage } from "@/components/legacy-page";

export const metadata: Metadata = {
  title: "Privacy Policy | Openbase",
  description: "Privacy policy for Openbase.",
};

export default function PrivacyPage() {
  return <LegacyPage bodyClass="page-body" file="privacy.html" script="pages.js" />;
}
