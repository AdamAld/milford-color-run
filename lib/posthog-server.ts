import { PostHog } from "posthog-node";

let posthogClient: PostHog | null = null;

export function getPostHogServer(): PostHog | null {
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return null;

  if (!posthogClient) {
    posthogClient = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      host: "https://us.i.posthog.com",
      flushAt: 1,
      flushInterval: 0,
    });
  }

  return posthogClient;
}

export function captureServerException(
  error: unknown,
  context?: Record<string, unknown>
) {
  const ph = getPostHogServer();
  if (!ph) return;

  const err = error instanceof Error ? error : new Error(String(error));

  ph.capture({
    distinctId: "server",
    event: "$exception",
    properties: {
      $exception_message: err.message,
      $exception_type: err.name,
      $exception_stack_trace_raw: err.stack,
      $exception_source: "server",
      ...context,
    },
  });
}
