import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { LegacyPage } from "@/components/legacy-page";
import { BETA_ACCESS_COOKIE, hasValidBetaAccess } from "@/lib/beta-access";

export const metadata: Metadata = {
  title: "Openbase Beta Downloads",
  description:
    "Access the Openbase beta downloads for Mac and iOS, plus Discord help and Openbase events.",
  openGraph: {
    title: "Openbase Beta Downloads",
    description: "Download the Openbase beta for Mac and iOS and meet the community.",
    type: "website",
    url: "/install",
    images: ["/assets/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default async function InstallPage() {
  const cookieStore = await cookies();
  const accessGranted = hasValidBetaAccess(cookieStore.get(BETA_ACCESS_COOKIE)?.value);

  if (!accessGranted) {
    redirect("/?join=beta&next=/install");
  }

  return (
    <LegacyPage
      accessGranted
      bodyClass="page-body"
      file="install.html"
      script="pages.js"
    />
  );
}
