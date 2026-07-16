import type { BetaSource } from "@/lib/beta-request";

const DEFAULT_CONTACT_ENDPOINT = "https://app.openbase.cloud/api/contact/";
const REQUEST_TIMEOUT_MS = 10_000;

type SubmitBetaContactOptions = {
  email: string;
  source: BetaSource;
  signupPath: string;
};

type SubmitBetaContactResult = {
  status: "created" | "existing";
};

export async function submitBetaContact({
  email,
  source: _source,
  signupPath: _signupPath,
}: SubmitBetaContactOptions): Promise<SubmitBetaContactResult> {
  const endpoint = process.env.BETA_CONTACT_ENDPOINT?.trim() || DEFAULT_CONTACT_ENDPOINT;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Waitlist Signup",
      email,
      message: "OPENBASE_CODER_WAITLIST_SIGNUP",
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (response.ok) {
    return { status: "created" };
  }

  const responseText = await readResponseText(response);

  if (isDuplicateContactResponse(response.status, responseText)) {
    return { status: "existing" };
  }

  throw new Error(`Waitlist contact request failed with status ${response.status}.`);
}

async function readResponseText(response: Response): Promise<string> {
  try {
    return await response.text();
  } catch {
    return "";
  }
}

function isDuplicateContactResponse(status: number, responseText: string): boolean {
  if (status === 409 || status === 208) {
    return true;
  }

  if (status !== 400 && status !== 422) {
    return false;
  }

  return /\b(email|contact|signup|waitlist)\b/i.test(responseText) &&
    /\b(already|duplicate|exists|unique)\b/i.test(responseText);
}
