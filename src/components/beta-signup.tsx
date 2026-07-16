"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { createPortal } from "react-dom";

import type { BetaSource } from "@/lib/beta-request";

type BetaSignupProps = {
  accessGranted: boolean;
};

type FormStatus = "idle" | "loading" | "error" | "success";

export function BetaSignup({ accessGranted }: BetaSignupProps) {
  const [mount, setMount] = useState<HTMLElement | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [source, setSource] = useState<BetaSource>("hero");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const redirectTimerRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (redirectTimerRef.current !== null) {
        window.clearTimeout(redirectTimerRef.current);
      }
    },
    [],
  );

  useEffect(() => {
    setMount(document.getElementById("betaSignupMount"));

    const params = new URLSearchParams(window.location.search);

    if (params.get("join") === "beta" && !accessGranted) {
      const requestedSource = params.get("source");

      if (
        requestedSource === "header" ||
        requestedSource === "drawer" ||
        requestedSource === "footer" ||
        requestedSource === "legal"
      ) {
        setSource(requestedSource);
      }

      setExpanded(true);
    }

    const openForm = (event: Event) => {
      const customEvent = event as CustomEvent<{ source?: BetaSource }>;
      setSource(customEvent.detail?.source || "hero");
      setExpanded(true);
      setStatus("idle");
      setMessage("");
    };

    window.addEventListener("openbase:beta-open", openForm);
    return () => window.removeEventListener("openbase:beta-open", openForm);
  }, [accessGranted]);

  useEffect(() => {
    if (!expanded) {
      return;
    }

    const frame = window.requestAnimationFrame(() => inputRef.current?.focus());
    return () => window.cancelAnimationFrame(frame);
  }, [expanded]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!expanded) {
      setExpanded(true);
      return;
    }

    if (status === "loading" || status === "success") {
      return;
    }

    const normalizedEmail = email.trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setStatus("error");
      setMessage("Enter a valid email address.");
      inputRef.current?.focus();
      return;
    }

    setStatus("loading");
    setMessage("Unlocking access…");

    try {
      const response = await fetch("/api/beta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: normalizedEmail,
          source,
          website,
        }),
      });
      const result = (await response.json()) as {
        error?: string;
        status?: "created" | "existing";
      };

      if (!response.ok) {
        throw new Error(result.error || "We couldn’t unlock access. Please try again.");
      }

      setStatus("success");
      setMessage(result.status === "existing" ? "Access already unlocked" : "Access unlocked");
      redirectTimerRef.current = window.setTimeout(
        () => window.location.assign("/install"),
        result.status === "existing" ? 250 : 650,
      );
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error ? error.message : "We couldn’t unlock access. Please try again.",
      );
      inputRef.current?.focus();
    }
  }

  if (!mount) {
    return null;
  }

  if (accessGranted) {
    return createPortal(
      <div className="beta-signup beta-signup--unlocked">
        <a className="btn primary beta-signup__open" href="/install">
          <span>Open Downloads</span>
          <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor">
            <path d="M4 10h12M11 5l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>,
      mount,
    );
  }

  const actionLabel =
    status === "loading" ? "Joining…" : status === "success" ? "Unlocked" : "Join Beta";

  return createPortal(
    <div className={`beta-signup${expanded ? " is-expanded" : ""}`} id="join-beta">
      <form onSubmit={handleSubmit} noValidate>
        <div className="beta-signup__shell">
          <label className="sr-only" htmlFor="betaEmail">
            Email address
          </label>
          <input
            ref={inputRef}
            id="betaEmail"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="Your email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              if (status === "error") {
                setStatus("idle");
                setMessage("");
              }
            }}
            disabled={!expanded || status === "loading" || status === "success"}
            tabIndex={expanded ? 0 : -1}
            aria-describedby="betaDisclosure betaStatus"
            aria-invalid={status === "error"}
            required
          />
          <div className="beta-signup__honeypot" aria-hidden="true">
            <label htmlFor="betaWebsite">Website</label>
            <input
              id="betaWebsite"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(event) => setWebsite(event.target.value)}
            />
          </div>
          <button
            className="btn primary beta-signup__button"
            type="submit"
            disabled={status === "loading" || status === "success"}
            aria-expanded={expanded}
          >
            <span>{actionLabel}</span>
            {status === "loading" ? (
              <span className="beta-signup__spinner" aria-hidden="true" />
            ) : (
              <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                <path
                  d={status === "success" ? "M4 10l4 4 8-8" : "M4 10h12M11 5l5 5-5 5"}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
        </div>
        <p className="beta-signup__disclosure" id="betaDisclosure">
          Instant download access. You’ll also receive occasional Openbase product updates;
          unsubscribe anytime. <a href="/privacy">Privacy</a>
        </p>
        <p
          className={`beta-signup__status beta-signup__status--${status}`}
          id="betaStatus"
          aria-live="polite"
        >
          {message}
        </p>
      </form>
    </div>,
    mount,
  );
}
