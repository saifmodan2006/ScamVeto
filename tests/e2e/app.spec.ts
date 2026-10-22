import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { Buffer } from "node:buffer";
const fixture = {
  id: "9d1c6f8d-5650-4db3-a0c1-2026fc321234",
  type: "message",
  locale: "en",
  outcome: "SUSPICIOUS_INDICATORS",
  summary:
    "This request includes an advance fee. Verify the role independently.",
  evidence: [
    {
      id: "fee",
      title: "Advance payment request",
      explanation: "An upfront payment is requested.",
      observed: "Pay a registration fee",
      category: "heuristic",
      strength: "strong",
      action: "Verify through official recruitment channels.",
    },
  ],
  checks: [
    {
      name: "Deterministic indicators",
      state: "completed",
      detail: "Text checked.",
      at: "2026-10-22T12:00:00Z",
    },
    {
      name: "Gemini interpretation",
      state: "completed",
      detail: "Synthetic fixture for browser tests only.",
      at: "2026-10-22T12:00:00Z",
    },
  ],
  actions: ["Verify through official recruitment channels."],
  limitations: ["Not proof of fraud."],
  timestamp: "2026-10-22T12:00:00Z",
  metadata: {
    model: "gemini-browser-test-fixture",
    reputationProvider: "Google Web Risk",
  },
};
test("home, navigation, mobile menu, and no overflow", async ({
  page,
  isMobile,
}) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "A second opinion",
  );
  await expect(page.locator(".tool-card")).toHaveCount(5);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  if (isMobile) {
    await page.getByRole("button", { name: "Open navigation" }).click();
    await page
      .locator("#mobile-navigation")
      .getByRole("link", { name: "Safety hub" })
      .click();
  } else
    await page
      .locator(".desktop-nav")
      .getByRole("link", { name: "Safety hub" })
      .click();
  await expect(page).toHaveURL("/learn");
});
for (const type of ["url", "message", "job", "shop", "screenshot"])
  test(`${type} checker submits and renders a controlled report`, async ({
    page,
  }) => {
    await page.route("**/api/analyze/**", async (route) => {
      const body = route.request().postDataJSON();
      expect(body.content).toBeTruthy();
      await route.fulfill({
        json: {
          report: {
            ...fixture,
            type: type === "screenshot" ? "screenshot-text" : type,
          },
        },
      });
    });
    await page.goto(`/check/${type}`);
    await page
      .getByLabel(
        type === "url"
          ? "Website address"
          : type === "screenshot"
            ? "Extracted text — review and correct"
            : "Content to examine",
        { exact: true },
      )
      .fill(
        type === "url"
          ? "https://example.com"
          : "Pay a registration fee before your interview.",
      );
    await page.locator(".consent input").check();
    await page.getByRole("button", { name: "Analyze submission" }).click();
    if (type === "url")
      await page.getByRole("button", { name: "View full report" }).click();
    await expect(
      page.getByRole("heading", { level: 2, name: fixture.summary }),
    ).toBeVisible();
    await expect(
      page
        .locator(".report-panel")
        .getByText("Suspicious indicators", { exact: true }),
    ).toBeVisible();
    await expect(page.locator(".report-panel")).not.toContainText(
      /Gemini|Google Web Risk|Technical details|No lookup completed/i,
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    await page.getByRole("button", { name: "Start a new check" }).click();
    await expect(
      page.getByRole("heading", { name: "Your report will appear here" }),
    ).toBeVisible();
  });
test("honest service failure and loading state", async ({ page }) => {
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route("**/api/analyze/**", async (route) => {
    await gate;
    await route.fulfill({
      status: 503,
      json: {
        error: {
          code: "SERVICE_UNAVAILABLE",
          message: "Provider unavailable. Try again.",
        },
      },
    });
  });
  await page.goto("/check/message");
  await page
    .getByLabel("Content to examine", { exact: true })
    .fill("Test message content");
  await page.locator(".consent input").check();
  await page.getByRole("button", { name: "Analyze submission" }).click();
  await expect(
    page.getByRole("button", { name: "Analyzing submission…" }),
  ).toBeDisabled();
  release();
  await expect(page.locator(".error-message[role=alert]")).toContainText(
    "Provider unavailable",
  );
  await expect(
    page.getByRole("button", { name: "Analyze submission" }),
  ).toBeEnabled();
});
test("form validation and keyboard access", async ({ page }) => {
  await page.goto("/check/url");
  await expect(
    page.getByRole("button", { name: "Analyze submission" }),
  ).toBeDisabled();
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.locator(".consent input").check();
  await page.getByRole("button", { name: "Analyze submission" }).click();
  await expect(
    page.getByLabel("Website address", { exact: true }),
  ).toBeFocused();
});
test("locale selection and reduced effects", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("combobox").selectOption("hi");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "क्लिक करने से पहले",
  );
  await page.getByRole("combobox").selectOption("gu");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "ક્લિક કરતાં પહેલાં",
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(
    await page
      .locator(".radar-sweep")
      .evaluate((el) => getComputedStyle(el).animationName),
  ).toBe("none");
});
test("public pages use product language without model branding", async ({
  page,
}) => {
  for (const path of ["/", "/about", "/privacy", "/check/message"]) {
    await page.goto(path);
    await expect(page.locator("main")).not.toContainText(
      /Gemini|GEMINI_API_KEY|\.env\.local/,
    );
  }
  await page.getByRole("combobox").selectOption("hi");
  await expect(page.locator("main")).not.toContainText(/Gemini|GEMINI_API_KEY/);
  await page.getByRole("combobox").selectOption("gu");
  await expect(page.locator("main")).not.toContainText(/Gemini|GEMINI_API_KEY/);
});
test("screenshot rejects disguised file", async ({ page }) => {
  await page.goto("/check/screenshot");
  await expect(page.locator("#screenshot-file")).toBeEnabled();
  await page.locator("#screenshot-file").setInputFiles({
    name: "fake.png",
    mimeType: "image/png",
    buffer: Buffer.from("this is not an image file"),
  });
  await expect(page.locator(".error-message[role=alert]")).toContainText(
    "do not match",
  );
});
test("screenshot previews and removes a valid image", async ({ page }) => {
  await page.goto("/check/screenshot");
  const png = await page.evaluate(() => {
    const c = document.createElement("canvas");
    c.width = 600;
    c.height = 200;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, 600, 200);
    ctx.fillStyle = "black";
    ctx.font = "30px sans-serif";
    ctx.fillText("Synthetic test message", 25, 80);
    return c.toDataURL().split(",")[1];
  });
  await expect(page.locator("#screenshot-file")).toBeEnabled();
  await page.locator("#screenshot-file").setInputFiles({
    name: "synthetic.png",
    mimeType: "image/png",
    buffer: Buffer.from(png, "base64"),
  });
  await expect(page.getByAltText("Selected screenshot preview")).toBeVisible();
  await page.getByRole("button", { name: "Remove image" }).click();
  await expect(page.getByAltText("Selected screenshot preview")).toHaveCount(0);
});
test("accessible homepage", async ({ page }) => {
  await page.goto("/");
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(results.violations).toEqual([]);
});
test("accessible checker", async ({ page }) => {
  await page.goto("/check/message");
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(results.violations).toEqual([]);
});
test("320px layout and landscape", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto("/");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.goto("/check/job");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.setViewportSize({ width: 812, height: 375 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
test("content pages and not found", async ({ page }) => {
  for (const path of [
    "/about",
    "/privacy",
    "/terms",
    "/contact",
    "/learn/fake-job-offers",
  ]) {
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  }
  await page.goto("/does-not-exist");
  await expect(
    page.getByRole("heading", { name: "This path ends here." }),
  ).toBeVisible();
});
