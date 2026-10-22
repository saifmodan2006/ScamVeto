// @vitest-environment jsdom
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { ReportView } from "@/components/reports/report";
import { localizeEvidence, summaries } from "@/lib/i18n/report";
import { analyzeText } from "@/features/analysis/deterministic";
import type { Report } from "@/lib/validation/schemas";
afterEach(cleanup);
describe("privacy-safe report rendering", () => {
  it("renders untrusted HTML as inert text and focuses the report heading", () => {
    const report: Report = {
      id: "1a3c6f8d-5650-4db3-a0c1-2026fc321234",
      type: "message",
      locale: "en",
      outcome: "INSUFFICIENT_EVIDENCE",
      summary: "<script>window.pwned=true</script>",
      evidence: [],
      checks: [],
      actions: [],
      limitations: [],
      timestamp: new Date().toISOString(),
      metadata: {},
    };
    const { container } = render(
      <ReportView report={report} onReset={() => {}} />,
    );
    expect(container.querySelector("script")).toBeNull();
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "<script>",
    );
    expect(screen.getByRole("heading", { level: 2 })).toHaveFocus();
  });
  it.each(["hi", "gu"] as const)(
    "localizes deterministic guidance in %s",
    (locale) => {
      const original = analyzeText("Please share your OTP")[0];
      const localized = localizeEvidence(original, locale);
      expect(localized.explanation).not.toBe(original.explanation);
      expect(localized.observed).toBe(original.observed);
      expect(summaries[locale].NO_KNOWN_THREAT_FOUND).toBeTruthy();
    },
  );
});
