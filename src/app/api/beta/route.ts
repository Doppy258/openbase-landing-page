import { NextResponse } from "next/server";

import {
  BETA_ACCESS_COOKIE,
  BETA_ACCESS_MAX_AGE,
  createBetaAccessToken,
} from "@/lib/beta-access";
import { submitBetaContact } from "@/lib/beta-contact";
import { getSignupPath, isBetaSource, normalizeEmail } from "@/lib/beta-request";

type BetaRequestBody = {
  email?: unknown;
  source?: unknown;
  website?: unknown;
};

export async function POST(request: Request) {
  let body: BetaRequestBody;

  try {
    body = (await request.json()) as BetaRequestBody;
  } catch {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  if (typeof body.website === "string" && body.website.trim()) {
    return NextResponse.json({ error: "Unable to join the beta." }, { status: 400 });
  }

  const email = normalizeEmail(body.email);

  if (!email) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  if (!isBetaSource(body.source)) {
    return NextResponse.json({ error: "Unable to join the beta." }, { status: 400 });
  }

  try {
    // Resolve local/deployment configuration before creating the external
    // contact record so a missing signing secret cannot produce duplicates.
    const accessToken = createBetaAccessToken();

    const contact = await submitBetaContact({
      email,
      source: body.source,
      signupPath: getSignupPath(request),
    });

    const response = NextResponse.json({
      ok: true,
      status: contact.status,
    });
    response.cookies.set({
      name: BETA_ACCESS_COOKIE,
      value: accessToken,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: BETA_ACCESS_MAX_AGE,
    });

    return response;
  } catch (error) {
    console.error("Beta signup failed.", error);
    return NextResponse.json(
      { error: "We couldn’t unlock access. Please try again." },
      { status: 503 },
    );
  }
}
