import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { buildSecurityHeaders, secureDemoMessage, withSecurityHeaders } from "./security.ts";

describe("security headers", () => {
  test("applies hardened defaults", () => {
    const headers = buildSecurityHeaders("https://family.example");

    assert.match(headers.get("content-security-policy") ?? "", /default-src 'self'/);
    assert.equal(headers.get("x-frame-options"), "DENY");
    assert.equal(headers.get("strict-transport-security"), "max-age=31536000; includeSubDomains");
    assert.equal(headers.get("cache-control"), "no-store, max-age=0");
  });

  test("does not force hsts on non-https requests", () => {
    const headers = buildSecurityHeaders("http://localhost:3000");

    assert.equal(headers.has("strict-transport-security"), false);
  });

  test("preserves response metadata while layering headers", async () => {
    const response = withSecurityHeaders(
      new Response("ok", {
        status: 201,
        headers: { "content-type": "text/plain; charset=utf-8" },
      }),
      "https://family.example",
    );

    assert.equal(response.status, 201);
    assert.equal(response.headers.get("content-type"), "text/plain; charset=utf-8");
    assert.equal(await response.text(), "ok");
  });
});

describe("secure demo messaging", () => {
  test("documents the hardened demo posture", () => {
    assert.match(secureDemoMessage, /memory/);
    assert.match(secureDemoMessage, /authenticated backend/);
  });
});
