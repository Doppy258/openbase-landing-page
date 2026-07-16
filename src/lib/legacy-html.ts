import { readFileSync } from "node:fs";
import { join } from "node:path";

export type LegacyPageFile =
  | "index.html"
  | "install.html"
  | "terms.html"
  | "privacy.html";

export function getLegacyBody(file: LegacyPageFile): string {
  const source = readFileSync(join(process.cwd(), "legacy", file), "utf8");
  const bodyTag = source.match(/<body(?:\s[^>]*)?>/i);
  const bodyEnd = source.lastIndexOf("</body>");

  if (!bodyTag || bodyTag.index === undefined || bodyEnd < 0) {
    throw new Error(`Could not extract the body from ${file}`);
  }

  const bodyStart = bodyTag.index + bodyTag[0].length;

  return source
    .slice(bodyStart, bodyEnd)
    .replace(
      /\s*<script\s+type=["']module["']\s+src=["']\.\/(?:script|pages)\.js["']><\/script>\s*$/i,
      "",
    );
}
