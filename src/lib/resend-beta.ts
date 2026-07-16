import { Resend, type ErrorResponse } from "resend";

import type { BetaSource } from "@/lib/beta-request";

const CONTACT_PROPERTY_KEYS = [
  "joined_at",
  "signup_source",
  "signup_path",
  "consent_version",
] as const;

const CONSENT_VERSION = "beta-funnel-v1";
const MAX_RETRIES = 3;

let resendClient: Resend | null = null;
let contactPropertiesReady: Promise<void> | null = null;

export function isResendBetaConfigured(): boolean {
  return Boolean(
    process.env.RESEND_API_KEY?.trim() && process.env.RESEND_BETA_SEGMENT_ID?.trim(),
  );
}

function getResend(): Resend {
  const apiKey = process.env.RESEND_API_KEY?.trim();

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured.");
  }

  if (!resendClient) {
    resendClient = new Resend(apiKey, {
      baseUrl: process.env.RESEND_BASE_URL?.trim() || undefined,
    });
  }

  return resendClient;
}

function getSegmentId(): string {
  const segmentId = process.env.RESEND_BETA_SEGMENT_ID?.trim();

  if (!segmentId) {
    throw new Error("RESEND_BETA_SEGMENT_ID is not configured.");
  }

  return segmentId;
}

function isRetryable(error: ErrorResponse): boolean {
  return error.statusCode === 429 || (error.statusCode !== null && error.statusCode >= 500);
}

async function wait(milliseconds: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function runWithRetry<T>(
  operation: () => Promise<{ data: T | null; error: ErrorResponse | null }>,
): Promise<T> {
  let lastError: ErrorResponse | null = null;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt += 1) {
    const result = await operation();

    if (!result.error && result.data) {
      return result.data;
    }

    lastError = result.error;

    if (!lastError || !isRetryable(lastError) || attempt === MAX_RETRIES - 1) {
      break;
    }

    await wait(300 * 2 ** attempt);
  }

  throw new Error(lastError?.message || "Resend request failed.");
}

async function ensureContactProperties(): Promise<void> {
  const resend = getResend();
  const listed = await runWithRetry(() => resend.contactProperties.list());
  const existingKeys = new Set(listed.data.map((property) => property.key));
  const missingKeys = CONTACT_PROPERTY_KEYS.filter((key) => !existingKeys.has(key));

  for (const key of missingKeys) {
    try {
      await runWithRetry(() =>
        resend.contactProperties.create({
          key,
          type: "string",
        }),
      );
    } catch (error) {
      const refreshed = await runWithRetry(() => resend.contactProperties.list());

      if (!refreshed.data.some((property) => property.key === key)) {
        throw error;
      }
    }
  }
}

async function prepareContactProperties(): Promise<void> {
  if (!contactPropertiesReady) {
    contactPropertiesReady = ensureContactProperties().catch((error) => {
      contactPropertiesReady = null;
      throw error;
    });
  }

  await contactPropertiesReady;
}

type UpsertBetaContactOptions = {
  email: string;
  source: BetaSource;
  signupPath: string;
};

export async function upsertBetaContact({
  email,
  source,
  signupPath,
}: UpsertBetaContactOptions): Promise<void> {
  await prepareContactProperties();

  const resend = getResend();

  await runWithRetry(() =>
    resend.contacts.create({
      email,
      unsubscribed: false,
      segments: [{ id: getSegmentId() }],
      properties: {
        joined_at: new Date().toISOString(),
        signup_source: source,
        signup_path: signupPath,
        consent_version: CONSENT_VERSION,
      },
    }),
  );
}
