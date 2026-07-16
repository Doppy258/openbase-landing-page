import Script from "next/script";

import { BetaSignup } from "@/components/beta-signup";
import { BodyClass } from "@/components/body-class";
import { getLegacyBody, type LegacyPageFile } from "@/lib/legacy-html";

type LegacyPageProps = {
  accessGranted?: boolean;
  bodyClass?: string;
  file: LegacyPageFile;
  script: "script.js" | "pages.js";
  showBetaSignup?: boolean;
};

export function LegacyPage({
  accessGranted = false,
  bodyClass = "",
  file,
  script,
  showBetaSignup = false,
}: LegacyPageProps) {
  return (
    <>
      <BodyClass value={bodyClass} />
      <div
        data-beta-access={accessGranted ? "true" : "false"}
        data-legacy-page={file}
        style={{ display: "contents" }}
        dangerouslySetInnerHTML={{ __html: getLegacyBody(file) }}
      />
      {showBetaSignup ? <BetaSignup accessGranted={accessGranted} /> : null}
      <Script id={`legacy-${script}`} src={`/${script}`} type="module" strategy="afterInteractive" />
    </>
  );
}
