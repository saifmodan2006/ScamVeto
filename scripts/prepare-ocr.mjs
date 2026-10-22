import { mkdir, copyFile, readdir } from "node:fs/promises";
await mkdir("public/ocr/core", { recursive: true });
await copyFile(
  "node_modules/tesseract.js/dist/worker.min.js",
  "public/ocr/worker.min.js",
);
for (const f of await readdir("node_modules/tesseract.js-core"))
  if (f.endsWith(".js") || f.endsWith(".wasm"))
    await copyFile(
      `node_modules/tesseract.js-core/${f}`,
      `public/ocr/core/${f}`,
    );
await copyFile(
  "node_modules/tesseract.js/LICENSE.md",
  "public/ocr/LICENSE-tesseract.md",
);
