import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { buildSecurityHeaders, secureDemoMessage, withSecurityHeaders } from "./security.ts";

describe("security headers", () => {
  test("applies hardened defaults", () => {
    const headers = buildSecurityHeaders("https://family.example");

    assert.match(headers.get("content-security-policy") ?? "", /default-src 'self'/);
    assert.equal(headers.get("x-frame-options"), "DENY");
    assert.equal(headers.get("strict-transport-security"), "max-age=31536000");
    assert.equal(headers.get("cache-control"), "no-store, max-age=0");
  });

  test("does not force hsts on non-https requests", () => {
    const headers = buildSecurityHeaders("http://localhost:3000");

    assert.equal(headers.has("strict-transport-security"), false);
    assert.doesNotMatch(headers.get("content-security-policy") ?? "", /upgrade-insecure-requests/);
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

  test("preserves redirect responses", () => {
    const redirect = Response.redirect("https://family.example/dashboard", 302);
    const wrapped = withSecurityHeaders(redirect, "https://family.example");

    assert.equal(wrapped.status, 302);
    assert.equal(wrapped.headers.get("location"), "https://family.example/dashboard");
    assert.equal(wrapped.headers.get("cache-control"), "no-store, max-age=0");
  });

  test("rebuilds immutable responses without dropping content", async () => {
    const response = new Response("locked", {
      status: 202,
      headers: { "content-type": "text/plain; charset=utf-8", "x-existing": "kept" },
    });

    Object.defineProperty(response.headers, "set", {
      value: () => {
        throw new TypeError("immutable");
      },
    });

    const wrapped = withSecurityHeaders(response, "https://family.example");

    assert.notEqual(wrapped, response);
    assert.equal(wrapped.status, 202);
    assert.equal(wrapped.headers.get("x-existing"), "kept");
    assert.equal(wrapped.headers.get("cache-control"), "no-store, max-age=0");
    assert.equal(await wrapped.text(), "locked");
  });
});

describe("secure demo messaging", () => {
  test("documents the hardened demo posture", () => {
    assert.match(secureDemoMessage, /memory/);
    assert.match(secureDemoMessage, /authenticated backend/);
  });
});
