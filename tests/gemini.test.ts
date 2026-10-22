import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
const { generateContent, constructor } = vi.hoisted(() => ({
  generateContent: vi.fn(),
  constructor: vi.fn(),
}));
vi.mock("@google/genai", () => ({
  GoogleGenAI: class {
    models = { generateContent };
    constructor(options: unknown) {
      constructor(options);
    }
  },
}));
import { GeminiAnalysisService } from "@/lib/gemini/service";
const valid = {
  summary: "Insufficient information.",
  threatCategory: "unknown",
  observedIndicators: [],
  uncertainties: [],
  supportingExplanations: [],
  recommendedActions: ["Verify independently."],
  needsIndependentVerification: true,
};
beforeEach(() => {
  vi.stubEnv("GEMINI_API_KEY", "fixture-secret-not-real");
  vi.stubEnv("GEMINI_MODEL", "fixture-model");
  generateContent.mockReset();
  constructor.mockReset();
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.useRealTimers();
});
describe("official Gemini SDK adapter", () => {
  it("uses constrained JSON, a server key, bounded transport and no tools", async () => {
    generateContent.mockResolvedValue({
      text: JSON.stringify(valid),
      modelVersion: "fixture-version",
    });
    const r = await new GeminiAnalysisService().analyze(
      "message",
      "synthetic input",
      [],
      "gu",
    );
    expect(r.model).toBe("fixture-version");
    expect(constructor).toHaveBeenCalledWith(
      expect.objectContaining({
        httpOptions: { timeout: 18000, retryOptions: { attempts: 1 } },
      }),
    );
    const request = generateContent.mock.calls[0][0];
    expect(request.config.responseMimeType).toBe("application/json");
    expect(request.config.responseJsonSchema.type).toBe("object");
    expect(request.config.tools).toEqual([]);
    expect(request.config.systemInstruction).toContain("Gujarati");
    expect(request.contents).not.toContain("fixture-secret-not-real");
  });
  it("rejects invalid JSON without inventing analysis", async () => {
    generateContent.mockResolvedValue({ text: "not json" });
    await expect(
      new GeminiAnalysisService().analyze("message", "test", [], "en"),
    ).rejects.toThrow("INVALID_PROVIDER_RESPONSE");
    expect(generateContent).toHaveBeenCalledTimes(1);
  });
  it("degrades on SDK timeouts without returning sensitive errors", async () => {
    generateContent.mockRejectedValue(
      new Error("fixture-secret-not-real timeout"),
    );
    const promise = new GeminiAnalysisService().analyze(
      "message",
      "test",
      [],
      "en",
    );
    await expect(promise).rejects.toThrow("PROVIDER_UNAVAILABLE");
  });
  it("retries a transient quota error once", async () => {
    vi.useFakeTimers();
    generateContent
      .mockRejectedValueOnce({ status: 429 })
      .mockResolvedValueOnce({ text: JSON.stringify(valid) });
    const promise = new GeminiAnalysisService().analyze(
      "message",
      "test",
      [],
      "en",
    );
    await vi.runAllTimersAsync();
    await expect(promise).resolves.toHaveProperty("analysis");
    expect(generateContent).toHaveBeenCalledTimes(2);
  });
  it("bounds retries on provider failures", async () => {
    vi.useFakeTimers();
    generateContent.mockRejectedValue({ status: 503 });
    const promise = new GeminiAnalysisService().analyze(
      "message",
      "test",
      [],
      "en",
    );
    const assertion = expect(promise).rejects.toThrow("PROVIDER_UNAVAILABLE");
    await vi.runAllTimersAsync();
    await assertion;
    expect(generateContent).toHaveBeenCalledTimes(2);
  });
});
