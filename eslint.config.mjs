import js from "@eslint/js";
import tseslint from "typescript-eslint";
import hooks from "eslint-plugin-react-hooks";
import a11y from "eslint-plugin-jsx-a11y";
export default tseslint.config(
  {
    ignores: [
      ".next/**",
      ".agents/**",
      "public/ocr/**",
      "coverage/**",
      "playwright-report/**",
      "test-results/**",
      "next-env.d.ts",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    plugins: { "react-hooks": hooks, "jsx-a11y": a11y },
    rules: {
      ...hooks.configs.recommended.rules,
      ...a11y.configs.recommended.rules,
      "jsx-a11y/anchor-is-valid": "off",
    },
    languageOptions: {
      globals: {
        process: "readonly",
        console: "readonly",
        window: "readonly",
        document: "readonly",
        fetch: "readonly",
        URL: "readonly",
        navigator: "readonly",
        Request: "readonly",
        Response: "readonly",
        AbortSignal: "readonly",
        setTimeout: "readonly",
        TextDecoder: "readonly",
        FormData: "readonly",
        IntersectionObserver: "readonly",
        File: "readonly",
        createImageBitmap: "readonly",
        DOMException: "readonly",
      },
    },
  },
  {
    files: ["**/*.mjs"],
    languageOptions: { globals: { process: "readonly", console: "readonly" } },
  },
);
