/* global fetch */
const production = "http://localhost:3002";
const health = await fetch(`${production}/api/health`);
console.log("Production health:", health.status, await health.json());
const blocked = await fetch(`${production}/api/analyze/message`, {
  method: "POST",
  headers: { origin: production, "Content-Type": "application/json" },
  body: JSON.stringify({ content: "Synthetic harmless message", locale: "en" }),
});
console.log(
  "Unconfigured production analysis:",
  blocked.status,
  (await blocked.json()).error?.code,
);
const foreign = await fetch(`${production}/api/analyze/message`, {
  method: "POST",
  headers: {
    origin: "https://foreign.example",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ content: "Synthetic test" }),
});
console.log("Cross-origin analysis:", foreign.status);
const local = await fetch("http://localhost:3000/api/analyze/message", {
  method: "POST",
  headers: {
    origin: "http://localhost:3000",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    content: "Synthetic example: please share your OTP immediately.",
    locale: "en",
  }),
});
const result = await local.json();
console.log("Development without Gemini:", local.status, {
  outcome: result.report?.outcome,
  code: result.error?.code,
  aiAvailable: result.report?.metadata.aiAvailable,
});
console.log("Production protections:", {
  csp: !!health.headers.get("content-security-policy"),
  nosniff: health.headers.get("x-content-type-options"),
  framing: health.headers.get("x-frame-options"),
});
