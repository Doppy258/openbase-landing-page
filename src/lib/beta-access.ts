import { createHmac, timingSafeEqual } from "node:crypto";

export const BETA_ACCESS_COOKIE = "openbase_beta_access";
export const BETA_ACCESS_MAX_AGE = 60 * 60 * 24 * 180;

const TOKEN_VERSION = "v1";

function getSecret(): string {
  const secret = process.env.BETA_ACCESS_SECRET?.trim();

  if (!secret) {
    throw new Error("BETA_ACCESS_SECRET is not configured.");
  }

  return secret;
}

function sign(value: string): string {
  return createHmac("sha256", getSecret()).update(value).digest("base64url");
}

export function createBetaAccessToken(now = Date.now()): string {
  const expiresAt = Math.floor(now / 1000) + BETA_ACCESS_MAX_AGE;
  const payload = `${TOKEN_VERSION}.${expiresAt}`;

  return `${payload}.${sign(payload)}`;
}

export function hasValidBetaAccess(token: string | undefined, now = Date.now()): boolean {
  if (!token) {
    return false;
  }

  try {
    const [version, expiresAtValue, suppliedSignature, extra] = token.split(".");

    if (
      version !== TOKEN_VERSION ||
      !expiresAtValue ||
      !suppliedSignature ||
      extra !== undefined
    ) {
      return false;
    }

    const expiresAt = Number(expiresAtValue);

    if (!Number.isSafeInteger(expiresAt) || expiresAt <= Math.floor(now / 1000)) {
      return false;
    }

    const expectedSignature = sign(`${version}.${expiresAtValue}`);
    const suppliedBuffer = Buffer.from(suppliedSignature);
    const expectedBuffer = Buffer.from(expectedSignature);

    return (
      suppliedBuffer.length === expectedBuffer.length &&
      timingSafeEqual(suppliedBuffer, expectedBuffer)
    );
  } catch {
    return false;
  }
}
