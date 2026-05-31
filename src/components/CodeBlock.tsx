import { Fragment, type ReactNode } from "react";

const KEYWORDS = new Set([
  "import",
  "from",
  "export",
  "default",
  "async",
  "function",
  "const",
  "let",
  "var",
  "return",
  "await",
  "if",
  "else",
  "new",
  "for",
  "of",
  "true",
  "false",
  "null",
]);

/** Very small token highlighter — close enough to the editor look in the original. */
function highlightLine(line: string, key: number): ReactNode {
  const trimmed = line.trimStart();
  if (trimmed.startsWith("//")) {
    return (
      <span key={key} className="text-white/35">
        {line}
      </span>
    );
  }

  const parts = line.split(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`[^`]*`)/g);
  return (
    <Fragment key={key}>
      {parts.map((part, i) => {
        if (/^["'`]/.test(part)) {
          return (
            <span key={i} className="text-[#9ece6a]">
              {part}
            </span>
          );
        }
        const sub = part.split(/(\b\w+\b)/g);
        return sub.map((tok, j) => {
          if (KEYWORDS.has(tok)) {
            return (
              <span key={`${i}-${j}`} className="text-[#bb9af7]">
                {tok}
              </span>
            );
          }
          if (/^\d+$/.test(tok)) {
            return (
              <span key={`${i}-${j}`} className="text-[#ff9e64]">
                {tok}
              </span>
            );
          }
          return <span key={`${i}-${j}`}>{tok}</span>;
        });
      })}
    </Fragment>
  );
}

export default function CodeBlock({ code }: { code: string }) {
  const lines = code.replace(/\n$/, "").split("\n");
  return (
    <pre className="overflow-x-auto px-5 py-4 font-mono text-[12.5px] leading-[1.65] text-white/85">
      <code className="block">
        {lines.map((line, i) => (
          <span key={i} className="flex">
            <span className="mr-4 w-5 shrink-0 select-none text-right text-white/25">
              {i + 1}
            </span>
            <span className="whitespace-pre">{highlightLine(line, i) || " "}</span>
          </span>
        ))}
      </code>
    </pre>
  );
}
