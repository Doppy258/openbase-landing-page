import type { BetaSource } from "@/lib/beta-request";
import { isResendBetaConfigured, upsertBetaContact } from "@/lib/resend-beta";

const DEFAULT_CONTACT_ENDPOINT = "https://learn.gabemontague.com/api/contact/";
const REQUEST_TIMEOUT_MS = 10_000;

type SubmitBetaContactOptions = {
  email: string;
  source: BetaSource;
  signupPath: string;
};

export async function submitBetaContact({
  email,
  source,
  signupPath,
}: SubmitBetaContactOptions): Promise<void> {
  const endpoint = process.env.BETA_CONTACT_ENDPOINT?.trim() || DEFAULT_CONTACT_ENDPOINT;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Waitlist Signup",
        email,
        message: "OPENBASE_CODER_WAITLIST_SIGNUP",
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    if (!response.ok) {
      throw new Error(`Waitlist contact request failed with status ${response.status}.`);
    }

    return;
  } catch (legacyError) {
    if (!isResendBetaConfigured()) {
      throw legacyError;
    }
  }

  await upsertBetaContact({ email, source, signupPath });
}
