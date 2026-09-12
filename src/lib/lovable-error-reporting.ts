type LovableErrorOptions = {
  mechanism?: "manual" | "onerror" | "unhandledrejection" | "react_error_boundary";
  handled?: boolean;
  severity?: "error" | "warning" | "info";
};

type LovableEvents = {
  captureException?: (
    error: unknown,
    context?: Record<string, unknown>,
    options?: LovableErrorOptions,
  ) => void;
};

declare global {
  interface Window {
    __lovableEvents?: LovableEvents;
    __lovableReportRuntimeError?: (payload: {
      message: string;
      stack?: string;
      filename?: string;
    }) => void;
  }
}

function sanitizeMessage(error: unknown): string {
  const message =
    error instanceof Response
      ? `Response ${error.status}`
      : error instanceof Error
        ? error.message
        : String(error);

  return message
    .replace(/https?:\/\/\S+/gi, "[url]")
    .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, "[email]")
    .replace(/\b(?:Bearer\s+)?[A-Z0-9_-]{24,}\b/gi, "[redacted]")
    .slice(0, 500);
}

function sanitizeRoute(pathname: string): string {
  const path = pathname.split(/[?#]/, 1)[0] ?? "";

  return path
    .replace(/\/\d+(?=\/|$)/g, "/:id")
    .replace(/\/[0-9a-f]{8}-[0-9a-f-]{27,36}(?=\/|$)/gi, "/:id");
}

export function reportLovableError(error: unknown, context: Record<string, unknown> = {}) {
  // Detailed client-side telemetry is development/editor-only. Production errors
  // must not forward raw exception data or user-controlled context.
  if (typeof window === "undefined" || !import.meta.env.DEV) return;

  const message = sanitizeMessage(error);
  const safeContext = Object.fromEntries(
    Object.entries(context).filter(
      ([key, value]) => key === "boundary" && typeof value === "string",
    ),
  );
  const sanitizedError = new Error(message);

  window.__lovableEvents?.captureException?.(
    sanitizedError,
    {
      source: "react_error_boundary",
      route: sanitizeRoute(window.location.pathname),
      ...safeContext,
    },
    {
      mechanism: "react_error_boundary",
      handled: false,
      severity: "error",
    },
  );
  // The editor preview may expose a second runtime reporting hook. Forward only
  // the already-sanitized message and normalized route.
  window.__lovableReportRuntimeError?.({
    message,
    filename: sanitizeRoute(window.location.pathname),
  });
}
