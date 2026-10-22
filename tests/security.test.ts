import { describe, it, expect, vi, afterEach } from "vitest";
import {
  checkOrigin,
  readLimitedJson,
  rateLimit,
  verifyTurnstile,
  productionReady,
} from "@/lib/security/request";
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});
describe("request protections", () => {
  it("rejects cross-origin and missing-origin requests", () => {
    vi.stubEnv("APP_BASE_URL", "https://app.example");
    expect(() =>
      checkOrigin(
        new Request("https://app.example/api", {
          headers: { origin: "https://evil.example" },
        }),
      ),
    ).toThrow();
    expect(() => checkOrigin(new Request("https://app.example/api"))).toThrow();
  });
  it("accepts same-origin requests", () => {
    vi.stubEnv("APP_BASE_URL", "https://app.example");
    expect(() =>
      checkOrigin(
        new Request("https://app.example/api", {
          headers: { origin: "https://app.example" },
        }),
      ),
    ).not.toThrow();
  });
  it("rejects oversized declared payloads", async () => {
    await expect(
      readLimitedJson(
        new Request("https://app.example", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "content-length": "25000",
          },
          body: "{}",
        }),
      ),
    ).rejects.toThrow("too large");
  });
  it("enforces size on the actual body", async () => {
    await expect(
      readLimitedJson(
        new Request("https://app.example", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ content: "a".repeat(21000) }),
        }),
      ),
    ).rejects.toThrow("too large");
  });
  it("rejects invalid JSON", async () => {
    await expect(
      readLimitedJson(
        new Request("https://app.example", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: "{",
        }),
      ),
    ).rejects.toThrow("could not be read");
  });
  it("enforces rate limits", async () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "");
    vi.stubEnv("RATE_LIMIT_HASH_SECRET", "test-isolated");
    vi.stubEnv("ANALYSIS_RATE_LIMIT", "1");
    const req = new Request("http://localhost");
    await rateLimit(req);
    await expect(rateLimit(req)).rejects.toMatchObject({ status: 429 });
  });
  it("fails closed in production without protections", () => {
    vi.stubEnv("GEMINI_API_KEY", "");
    expect(productionReady()).toBe(false);
  });
  it("does not silently skip configured Turnstile", async () => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", "test-fixture");
    await expect(verifyTurnstile(undefined)).rejects.toMatchObject({
      status: 403,
    });
  });
  it("checks Turnstile hostname and action", async () => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", "test-fixture");
    vi.stubEnv("APP_BASE_URL", "https://app.example");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            success: true,
            hostname: "evil.example",
            action: "analysis",
          }),
        ),
      ),
    );
    await expect(verifyTurnstile("token")).rejects.toMatchObject({
      status: 403,
    });
  });
  it("accepts valid Turnstile verification", async () => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", "test-fixture");
    vi.stubEnv("APP_BASE_URL", "https://app.example");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            success: true,
            hostname: "app.example",
            action: "analysis",
          }),
        ),
      ),
    );
    await expect(verifyTurnstile("token")).resolves.toBeUndefined();
  });
  it("fails closed on Redis network failure", async () => {
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://redis.example");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "test-fixture");
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network")));
    await expect(
      rateLimit(new Request("http://localhost")),
    ).rejects.toMatchObject({ status: 503 });
  });
});
