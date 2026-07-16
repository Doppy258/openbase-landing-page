import type { Metadata } from "next";

import { LegacyPage } from "@/components/legacy-page";

export const metadata: Metadata = {
  title: "Install Openbase",
  description:
    "Download Openbase for Mac, join the iOS beta, and connect with the community on Discord and Luma.",
  openGraph: {
    title: "Install Openbase",
    description: "Download the Mac companion, join the iOS beta, and connect with the community.",
    type: "website",
    url: "/install",
    images: ["/assets/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function InstallPage() {
  return <LegacyPage bodyClass="page-body" file="install.html" script="pages.js" />;
}
