"use client";
import { useRef, useState, useEffect } from "react";
import { Upload, FileImage, LoaderCircle } from "lucide-react";
import { CyberButton } from "@/components/ui/button";
import { useLocale } from "@/components/providers";
import { useHydrated } from "@/lib/use-hydrated";
export async function validateImage(file: File): Promise<void> {
  if (
    !["image/png", "image/jpeg", "image/webp"].includes(file.type) ||
    file.size > 5 * 1024 * 1024 ||
    file.size < 12
  )
    throw new Error("Use a PNG, JPEG or WebP image under 5 MB.");
  const bytes = new Uint8Array(await file.slice(0, 32).arrayBuffer());
  const png = [137, 80, 78, 71, 13, 10, 26, 10].every((v, i) => bytes[i] === v),
    jpeg = bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255,
    webp =
      String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" &&
      String.fromCharCode(...bytes.slice(8, 12)) === "WEBP";
  if (!(
    (file.type === "image/png" && png) ||
    (file.type === "image/jpeg" && jpeg) ||
    (file.type === "image/webp" && webp)
  ))
    throw new Error("The file contents do not match its image type.");
  // Inspect dimensions before decoding to reject oversized compressed images.
  const all = new Uint8Array(await file.arrayBuffer());
  const view = new DataView(all.buffer);
  let width = 0,
    height = 0;
  if (png) {
    width = view.getUint32(16);
    height = view.getUint32(20);
  }
  if (jpeg) {
    for (let i = 2; i < all.length - 9;) {
      if (all[i] !== 255) break;
      const marker = all[i + 1],
        len = view.getUint16(i + 2);
      if (
        [
          192, 193, 194, 195, 197, 198, 199, 201, 202, 203, 205, 206, 207,
        ].includes(marker)
      ) {
        height = view.getUint16(i + 5);
        width = view.getUint16(i + 7);
        break;
      }
      if (len < 2) break;
      i += 2 + len;
    }
  }
  if (webp) {
    const kind = String.fromCharCode(...all.slice(12, 16));
    if (kind === "VP8X") {
      width = 1 + all[24] + (all[25] << 8) + (all[26] << 16);
      height = 1 + all[27] + (all[28] << 8) + (all[29] << 16);
    } else if (kind === "VP8 ") {
      width = view.getUint16(26, true) & 16383;
      height = view.getUint16(28, true) & 16383;
    } else if (kind === "VP8L") {
      const bits = view.getUint32(21, true);
      width = (bits & 16383) + 1;
      height = ((bits >>> 14) & 16383) + 1;
    }
  }
  if (
    !width ||
    !height ||
    width > 8000 ||
    height > 8000 ||
    width * height > 16000000
  )
    throw new Error(
      "Use a valid image no larger than 16 megapixels or 8,000 pixels on either side.",
    );
  const bitmap = await createImageBitmap(file);
  const valid = bitmap.width === width && bitmap.height === height;
  bitmap.close();
  if (!valid) throw new Error("Unsupported image dimensions.");
}
export function ImageUpload({ onText }: { onText: (text: string) => void }) {
  const { t, locale } = useLocale();
  const [file, setFile] = useState<File>();
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [progress, setProgress] = useState<number>();
  const input = useRef<HTMLInputElement>(null);
  const busy = progress !== undefined;
  const generation = useRef(0);
  const hydrated = useHydrated();
  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview);
    },
    [preview],
  );
  async function select(candidate?: File) {
    if (!candidate || busy) return;
    setError("");
    try {
      await validateImage(candidate);
      generation.current++;
      setFile(candidate);
      setPreview(URL.createObjectURL(candidate));
    } catch (e) {
      setError((e as Error).message);
    }
  }
  async function extract() {
    if (!file) return;
    setError("");
    setProgress(0);
    const current = generation.current;
    let worker:
      | Awaited<ReturnType<(typeof import("tesseract.js"))["createWorker"]>>
      | undefined;
    try {
      const { createWorker } = await import("tesseract.js");
      worker = await createWorker(
        locale === "hi" ? "eng+hin" : locale === "gu" ? "eng+guj" : "eng",
        1,
        {
          workerPath: "/ocr/worker.min.js",
          corePath: "/ocr/core",
          logger: (m) => {
            if (m.status === "recognizing text")
              setProgress(Math.round(m.progress * 100));
          },
        },
      );
      const result = await worker.recognize(file);
      if (current === generation.current)
        onText(result.data.text.slice(0, 12000));
    } catch {
      setError(
        "Text extraction failed. Try a clearer image or type the text below.",
      );
    } finally {
      await worker?.terminate();
      setProgress(undefined);
    }
  }
  return (
    <div
      className="upload-section"
      onPaste={(e) => {
        const candidate = Array.from(e.clipboardData.files).find((f) =>
          f.type.startsWith("image/"),
        );
        if (candidate) {
          e.preventDefault();
          void select(candidate);
        }
      }}
    >
      <input
        ref={input}
        className="sr-only"
        id="screenshot-file"
        type="file"
        aria-label={t.upload}
        accept="image/png,image/jpeg,image/webp"
        disabled={busy || !hydrated}
        onChange={(e) => void select(e.target.files?.[0])}
      />
      <button
        type="button"
        disabled={busy || !hydrated}
        className="drop-zone"
        onClick={() => input.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          void select(e.dataTransfer.files[0]);
        }}
      >
        <Upload size={27} />
        <strong>{t.upload}</strong>
        <span>PNG, JPEG, WebP · 5 MB · 16 MP max</span>
        <span className="small">You can also paste an image here.</span>
      </button>
      {file && (
        <div className="image-preview">
          {/* Local blob preview does not benefit from Next image optimization. */}
          <img src={preview} alt="Selected screenshot preview" />
          <span>
            <FileImage size={15} />
            {file.name}
          </span>
          <div className="button-row">
            <CyberButton type="button" disabled={busy} onClick={extract}>
              {busy ? (
                <LoaderCircle className="spin" size={16} />
              ) : (
                <ScanIcon />
              )}
              {busy ? `OCR ${progress}%` : t.ocr}
            </CyberButton>
            <CyberButton
              type="button"
              variant="ghost"
              disabled={busy}
              onClick={() => {
                generation.current++;
                setFile(undefined);
                setPreview("");
                if (input.current) input.current.value = "";
              }}
            >
              {t.remove}
            </CyberButton>
          </div>
        </div>
      )}
      <p className="small muted">{t.ocrNotice}</p>
      {error && (
        <p role="alert" className="error-message">
          {error}
        </p>
      )}
    </div>
  );
}
function ScanIcon() {
  return <FileImage size={16} />;
}
