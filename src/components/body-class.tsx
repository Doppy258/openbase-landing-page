"use client";

import { useLayoutEffect } from "react";

export function BodyClass({ value }: { value: string }) {
  useLayoutEffect(() => {
    const previous = document.body.className;
    document.body.className = value;

    return () => {
      document.body.className = previous;
    };
  }, [value]);

  return null;
}
