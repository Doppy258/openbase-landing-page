import Script from "next/script";

import { BodyClass } from "@/components/body-class";
import { getLegacyBody, type LegacyPageFile } from "@/lib/legacy-html";

type LegacyPageProps = {
  bodyClass?: string;
  file: LegacyPageFile;
  script: "script.js" | "pages.js";
};

export function LegacyPage({ bodyClass = "", file, script }: LegacyPageProps) {
  return (
    <>
      <BodyClass value={bodyClass} />
      <div
        data-legacy-page={file}
        style={{ display: "contents" }}
        dangerouslySetInnerHTML={{ __html: getLegacyBody(file) }}
      />
      <Script id={`legacy-${script}`} src={`/${script}`} type="module" strategy="afterInteractive" />
    </>
  );
}
