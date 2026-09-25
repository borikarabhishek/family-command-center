const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "object-src 'none'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob:",
  "connect-src 'self'",
  "manifest-src 'self'",
  "worker-src 'self' blob:",
  "upgrade-insecure-requests",
].join("; ");

const SECURITY_HEADERS: Readonly<Record<string, string>> = {
  "cache-control": "no-store, max-age=0",
  "content-security-policy": CONTENT_SECURITY_POLICY,
  "permissions-policy": "camera=(), geolocation=(), microphone=(), payment=(), usb=()",
  pragma: "no-cache",
  "referrer-policy": "strict-origin-when-cross-origin",
  "x-content-type-options": "nosniff",
  "x-frame-options": "DENY",
  "cross-origin-opener-policy": "same-origin",
  "cross-origin-resource-policy": "same-origin",
};

export const secureDemoMessage =
  "Secure demo mode: data stays in memory for this tab only, and privileged actions remain disabled until a real authenticated backend is connected.";

function shouldSendHsts(requestUrl: string): boolean {
  const { protocol, hostname } = new URL(requestUrl);
  if (protocol !== "https:") return false;

  const localHosts = new Set(["localhost", "127.0.0.1", "::1"]);
  return (
    !localHosts.has(hostname) && !hostname.endsWith(".localhost") && !hostname.endsWith(".local")
  );
}

export function buildSecurityHeaders(requestUrl: string): Headers {
  const headers = new Headers(SECURITY_HEADERS);
  if (shouldSendHsts(requestUrl)) {
    headers.set("strict-transport-security", "max-age=31536000; includeSubDomains");
  }
  return headers;
}

export function withSecurityHeaders(response: Response, requestUrl: string): Response {
  const headers = new Headers(response.headers);
  const securityHeaders = buildSecurityHeaders(requestUrl);

  securityHeaders.forEach((value, key) => {
    headers.set(key, value);
  });

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
