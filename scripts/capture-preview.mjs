/* global document, innerWidth */
import { chromium } from "@playwright/test";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const base = process.env.PREVIEW_URL ?? "http://localhost:3000";
await page.goto(base);
await page.emulateMedia({ reducedMotion: "reduce" });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: "docs/preview-desktop.png" });
await page.setViewportSize({ width: 390, height: 844 });
await page.screenshot({ path: "docs/preview-mobile.png", fullPage: true });
console.log(
  "Mobile overflow:",
  await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
);
await browser.close();
