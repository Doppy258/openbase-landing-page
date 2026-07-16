export const BETA_SOURCES = ["hero", "header", "drawer", "footer", "legal"] as const;

export type BetaSource = (typeof BETA_SOURCES)[number];

export function isBetaSource(value: unknown): value is BetaSource {
  return typeof value === "string" && BETA_SOURCES.includes(value as BetaSource);
}

export function normalizeEmail(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const email = value.trim().toLowerCase();

  if (
    email.length < 3 ||
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    return null;
  }

  return email;
}

export function getSignupPath(request: Request): string {
  const referer = request.headers.get("referer");

  if (!referer) {
    return "/";
  }

  try {
    const url = new URL(referer);
    return `${url.pathname}${url.search}`.slice(0, 500);
  } catch {
    return "/";
  }
}
