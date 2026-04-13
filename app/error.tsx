"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    posthog.capture("$exception", {
      $exception_message: error.message,
      $exception_type: error.name,
      $exception_source: "error_boundary",
      $exception_digest: error.digest,
    });
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <h2 className="text-2xl font-bold text-white">Something went wrong</h2>
      <p className="text-white/60">
        An unexpected error occurred. Please try again.
      </p>
      <button
        onClick={reset}
        className="rounded-lg bg-gradient-to-r from-[var(--sos-orange)] to-[var(--sos-yellow)] px-6 py-3 font-semibold text-black transition-opacity hover:opacity-90"
      >
        Try Again
      </button>
    </div>
  );
}
