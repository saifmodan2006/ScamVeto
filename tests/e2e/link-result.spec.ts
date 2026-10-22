import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import type { Outcome } from "../../src/lib/validation/schemas";
declare global {
  interface Window {
    __resultAudio: { created: number; started: number; frequencies: number[] };
  }
}
async function mockAudio(page: Page) {
  await page.addInitScript(() => {
    window.__resultAudio = { created: 0, started: 0, frequencies: [] };
    class TestAudioContext {
      state = "running";
      currentTime = 0;
      destination = {};
      constructor() {
        window.__resultAudio.created++;
      }
      resume() {
        return Promise.resolve();
      }
      close() {
        this.state = "closed";
        return Promise.resolve();
      }
      createGain() {
        return {
          gain: {
            setValueAtTime() {},
            linearRampToValueAtTime() {},
            exponentialRampToValueAtTime() {},
          },
          connect() {},
          disconnect() {},
        };
      }
      createOscillator() {
        const node = {
          frequency: { value: 0 },
          type: "sine",
          onended: null as null | (() => void),
          connect() {},
          disconnect() {},
          start() {
            window.__resultAudio.started++;
            window.__resultAudio.frequencies.push(node.frequency.value);
          },
          stop() {
            queueMicrotask(() => node.onended?.());
          },
        };
        return node;
      }
    }
    Object.defineProperty(window, "AudioContext", {
      value: TestAudioContext,
      configurable: true,
    });
  });
}
function fixture(outcome: Outcome) {
  return {
    id: "9d1c6f8d-5650-4db3-a0c1-2026fc321234",
    type: "url",
    locale: "en",
    outcome,
    summary: "Review the evidence and verify the request independently.",
    evidence: [],
    checks: [
      {
        name: "Deterministic indicators",
        state: "completed",
        detail: "Synthetic test.",
        at: "2026-10-23T00:00:00Z",
      },
    ],
    actions: ["Verify independently."],
    limitations: [],
    timestamp: "2026-10-23T00:00:00Z",
    metadata: { aiAvailable: outcome !== "ANALYSIS_UNAVAILABLE" },
  };
}
async function submit(page: Page) {
  await page.goto("/check/url");
  await page
    .getByLabel("Website address", { exact: true })
    .fill("https://example.com");
  await page.locator(".consent input").check();
  await page.getByRole("button", { name: "Analyze submission" }).click();
}
for (const [outcome, title, tone, notes] of [
  ["KNOWN_MALICIOUS", "Known threat detected", "danger", 3],
  ["SUSPICIOUS_INDICATORS", "This link needs caution", "warning", 2],
  ["NO_KNOWN_THREAT_FOUND", "Check complete", "complete", 2],
  ["INSUFFICIENT_EVIDENCE", "More verification needed", "neutral", 1],
  ["ANALYSIS_UNAVAILABLE", "Check incomplete", "neutral", 1],
] as const)
  test(`URL popup presents ${outcome} with a matching finite sound`, async ({
    page,
  }) => {
    await mockAudio(page);
    const targets: string[] = [];
    page.on("request", (r) => {
      if (new URL(r.url()).hostname === "example.com") targets.push(r.url());
    });
    await page.route("**/api/analyze/url", (r) =>
      r.fulfill({ json: { report: fixture(outcome) } }),
    );
    await submit(page);
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute("data-tone", tone);
    await expect(
      dialog.getByRole("heading", { name: title, exact: true }),
    ).toBeVisible();
    await expect(
      dialog.getByRole("button", { name: "Close result", exact: true }),
    ).toBeFocused();
    if (outcome === "NO_KNOWN_THREAT_FOUND")
      await expect(dialog).toContainText("not a guarantee of safety");
    expect(await page.evaluate(() => window.__resultAudio.started)).toBe(notes);
    expect(targets).toEqual([]);
    await dialog.getByRole("button", { name: "View full report" }).click();
    await expect(dialog).not.toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: "Review the evidence and verify the request independently.",
      }),
    ).toBeFocused();
  });
test("muting suppresses audio while preserving the popup and Escape dismissal", async ({
  page,
}) => {
  await mockAudio(page);
  await page.route("**/api/analyze/url", (r) =>
    r.fulfill({ json: { report: fixture("SUSPICIOUS_INDICATORS") } }),
  );
  await page.goto("/check/url");
  await page
    .getByLabel("Website address", { exact: true })
    .fill("https://example.com");
  await page
    .getByRole("checkbox", { name: "Play a short result sound" })
    .uncheck();
  await page.locator(".consent input").check();
  await page.getByRole("button", { name: "Analyze submission" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  expect(await page.evaluate(() => window.__resultAudio.created)).toBe(0);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
});
test("failed requests show an incomplete popup without a fabricated report", async ({
  page,
}) => {
  await mockAudio(page);
  await page.route("**/api/analyze/url", (r) =>
    r.fulfill({
      status: 503,
      json: { error: { message: "Please try again later." } },
    }),
  );
  await submit(page);
  const dialog = page.getByRole("dialog");
  await expect(
    dialog.getByRole("heading", { name: "Check incomplete" }),
  ).toBeVisible();
  await expect(
    dialog.getByRole("button", { name: "View full report" }),
  ).toHaveCount(0);
  expect(await page.evaluate(() => window.__resultAudio.started)).toBe(1);
  await dialog
    .getByRole("button", { name: "Close result", exact: true })
    .first()
    .click();
  await expect(page.getByLabel("Website address", { exact: true })).toHaveValue(
    "https://example.com",
  );
});
test("popup reset clears the previous URL and consent", async ({ page }) => {
  await mockAudio(page);
  await page.route("**/api/analyze/url", (r) =>
    r.fulfill({ json: { report: fixture("SUSPICIOUS_INDICATORS") } }),
  );
  await submit(page);
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Check another link" })
    .click();
  await expect(page.getByLabel("Website address", { exact: true })).toHaveValue(
    "",
  );
  await expect(page.locator(".consent input")).not.toBeChecked();
});
test("result dialog remains accessible at narrow width", async ({ page }) => {
  await mockAudio(page);
  await page.setViewportSize({ width: 320, height: 700 });
  await page.route("**/api/analyze/url", (r) =>
    r.fulfill({ json: { report: fixture("SUSPICIOUS_INDICATORS") } }),
  );
  await submit(page);
  await expect(page.getByRole("dialog")).toBeVisible();
  const findings = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(findings.violations).toEqual([]);
  expect(
    await page
      .getByRole("dialog")
      .evaluate((el) => el.scrollWidth <= el.clientWidth),
  ).toBe(true);
});
test("result popup follows the selected language", async ({ page }) => {
  await mockAudio(page);
  await page.route("**/api/analyze/url", (r) =>
    r.fulfill({ json: { report: fixture("SUSPICIOUS_INDICATORS") } }),
  );
  await page.goto("/check/url");
  await page.getByRole("combobox").selectOption("hi");
  await page
    .getByLabel("वेबसाइट का पता", { exact: true })
    .fill("https://example.com");
  await page.locator(".consent input").check();
  await page.getByRole("button", { name: "विश्लेषण करें" }).click();
  await expect(
    page
      .getByRole("dialog")
      .getByRole("heading", { name: "इस लिंक के लिए सावधानी रखें" }),
  ).toBeVisible();
});
