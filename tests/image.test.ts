import { describe, it, expect, vi, afterEach } from "vitest";
import { validateImage } from "@/components/checkers/image-upload";
afterEach(() => vi.unstubAllGlobals());
describe("image safety before decoding", () => {
  it("rejects disguised PNG files", async () =>
    await expect(
      validateImage(
        new File(["not an image at all"], "fake.png", { type: "image/png" }),
      ),
    ).rejects.toThrow("do not match"));
  it("rejects oversized files", async () =>
    await expect(
      validateImage(
        new File([new Uint8Array(5 * 1024 * 1024 + 1)], "big.png", {
          type: "image/png",
        }),
      ),
    ).rejects.toThrow("under 5 MB"));
  it("rejects unsupported SVG content", async () =>
    await expect(
      validateImage(
        new File(['<svg onload="alert(1)"/>'], "bad.svg", {
          type: "image/svg+xml",
        }),
      ),
    ).rejects.toThrow());
  it("rejects pixel bombs before calling the decoder", async () => {
    const bytes = new Uint8Array(32);
    bytes.set([137, 80, 78, 71, 13, 10, 26, 10]);
    const view = new DataView(bytes.buffer);
    view.setUint32(16, 100000);
    view.setUint32(20, 100000);
    const decoder = vi.fn();
    vi.stubGlobal("createImageBitmap", decoder);
    await expect(
      validateImage(new File([bytes], "bomb.png", { type: "image/png" })),
    ).rejects.toThrow("16 megapixels");
    expect(decoder).not.toHaveBeenCalled();
  });
});
