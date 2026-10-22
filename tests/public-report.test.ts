import { describe, it, expect } from "vitest";
import { checkLabel, reportCopy, reviewNotes } from "@/lib/public-report";
import type { Report } from "@/lib/validation/schemas";
const report: Report = {
  id: "9d1c6f8d-5650-4db3-a0c1-2026fc321234",
  type: "message",
  locale: "en",
  outcome: "SUSPICIOUS_INDICATORS",
  summary: "Verify the request before paying.",
  interpretation: "An upfront fee was requested.",
  evidence: [],
  checks: [
    {
      name: "Gemini interpretation",
      state: "completed",
      detail: "Structured response validated.",
      at: "2026-10-23T00:00:00Z",
    },
    {
      name: "Google Web Risk",
      state: "unavailable",
      detail: "No live threat-list lookup completed.",
      at: "2026-10-23T00:00:00Z",
    },
  ],
  actions: ["Contact the employer independently."],
  limitations: [
    "No employer records, reviews, ownership or registration databases were checked.",
    "The recruiter’s identity needs confirmation.",
  ],
  timestamp: "2026-10-23T00:00:00Z",
  metadata: {
    model: "gemini-3.6-flash",
    reputationProvider: "Google Web Risk",
  },
};
describe("public report presentation", () => {
  it("exports a readable report without provider metadata or implementation copy", () => {
    const copy = reportCopy(report, "en");
    expect(copy).toContain("Contact the employer independently.");
    expect(copy).toContain("Link reputation: Unavailable");
    expect(copy).not.toMatch(
      /Gemini|Web Risk|No live|No employer|Structured response|metadata|model/i,
    );
  });
  it("keeps user-relevant uncertainties while removing implementation boilerplate", () =>
    expect(reviewNotes(report)).toEqual([
      "The recruiter’s identity needs confirmation.",
    ]));
  it.each(["en", "hi", "gu"] as const)(
    "uses plain check labels in %s",
    (locale) => {
      expect(checkLabel("Gemini interpretation", locale)).not.toMatch(
        /Gemini/i,
      );
      expect(checkLabel("Google Web Risk", locale)).not.toMatch(
        /Google|Web Risk/i,
      );
    },
  );
});
