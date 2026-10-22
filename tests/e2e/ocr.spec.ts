import { test, expect } from "@playwright/test";
import { Buffer } from "node:buffer";
test("real browser OCR extracts synthetic image text without uploading the image", async ({
  page,
}) => {
  test.setTimeout(90000);
  const uploads: string[] = [];
  page.on("request", (req) => {
    if (req.method() === "POST") uploads.push(req.url());
  });
  await page.goto("/check/screenshot");
  await expect(page.locator("#screenshot-file")).toBeEnabled();
  const png = await page.evaluate(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 300;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, 1200, 300);
    ctx.fillStyle = "black";
    ctx.font = "52px Arial";
    ctx.fillText("Verify this message independently", 40, 120);
    return canvas.toDataURL().split(",")[1];
  });
  await page.locator("#screenshot-file").setInputFiles({
    name: "synthetic-ocr.png",
    mimeType: "image/png",
    buffer: Buffer.from(png, "base64"),
  });
  await page
    .getByRole("button", { name: "Extract text on this device" })
    .click();
  await expect(
    page.getByLabel("Extracted text — review and correct", { exact: true }),
  ).toHaveValue(/Verify this message independently/i, { timeout: 60000 });
  expect(uploads).toEqual([]);
});
