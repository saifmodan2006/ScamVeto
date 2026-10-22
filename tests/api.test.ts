import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
const { run, rateLimit, verifyTurnstile } = vi.hoisted(() => ({
  run: vi.fn(),
  rateLimit: vi.fn(),
  verifyTurnstile: vi.fn(),
}));
vi.mock("@/features/analysis/service", () => ({
  AnalysisService: class {
    run = run;
  },
}));
vi.mock("@/lib/security/request", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/security/request")>()),
  rateLimit,
  verifyTurnstile,
}));
import { POST } from "@/app/api/analyze/[type]/route";
const request = (body: unknown, headers: Record<string, string> = {}) =>
  new Request("http://localhost:3000/api/analyze/message", {
    method: "POST",
    headers: {
      origin: "http://localhost:3000",
      "content-type": "application/json",
      ...headers,
    },
    body: JSON.stringify(body),
  });
beforeEach(() => {
  vi.stubEnv("NODE_ENV", "development");
  vi.stubEnv("APP_BASE_URL", "http://localhost:3000");
  run.mockReset();
  rateLimit.mockReset();
  verifyTurnstile.mockReset();
});
afterEach(() => vi.unstubAllEnvs());
describe("analysis HTTP boundary", () => {
  it("rejects invalid input before provider invocation", async () => {
    const res = await POST(request({ content: "x" }), {
      params: Promise.resolve({ type: "message" }),
    });
    expect(res.status).toBe(400);
    expect(run).not.toHaveBeenCalled();
  });
  it("rejects foreign origins", async () => {
    const res = await POST(
      request({ content: "hello" }, { origin: "https://other.example" }),
      { params: Promise.resolve({ type: "message" }) },
    );
    expect(res.status).toBe(403);
    expect(run).not.toHaveBeenCalled();
  });
  it("returns 404 for unsupported analysis types", async () => {
    expect(
      (
        await POST(request({ content: "hello" }), {
          params: Promise.resolve({ type: "unknown" }),
        })
      ).status,
    ).toBe(404);
  });
  it("returns configuration failure as HTTP 503 with an incomplete report", async () => {
    run.mockResolvedValue({
      configurationRequired: true,
      report: { locale: "hi", metadata: { aiAvailable: false } },
    });
    const res = await POST(request({ content: "hello", locale: "hi" }), {
      params: Promise.resolve({ type: "message" }),
    });
    expect(res.status).toBe(503);
    expect((await res.json()).error.code).toBe("CONFIGURATION_REQUIRED");
    expect(res.headers.get("cache-control")).toBe("no-store");
  });
  it("returns completed reports as HTTP 200", async () => {
    run.mockResolvedValue({
      configurationRequired: false,
      report: { metadata: { aiAvailable: true } },
    });
    expect(
      (
        await POST(request({ content: "hello" }), {
          params: Promise.resolve({ type: "message" }),
        })
      ).status,
    ).toBe(200);
    expect(verifyTurnstile).toHaveBeenCalled();
  });
  it("does not leak an internal provider error", async () => {
    run.mockRejectedValue(new Error("secret-fixture"));
    const res = await POST(request({ content: "hello" }), {
      params: Promise.resolve({ type: "message" }),
    });
    expect(await res.text()).not.toContain("secret-fixture");
  });
  it("enforces production configuration before provider cost", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("GEMINI_API_KEY", "");
    expect(
      (
        await POST(request({ content: "hello" }), {
          params: Promise.resolve({ type: "message" }),
        })
      ).status,
    ).toBe(503);
    expect(run).not.toHaveBeenCalled();
  });
});
