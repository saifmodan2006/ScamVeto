import fs from "node:fs";
const report = JSON.parse(
  fs.readFileSync("test-results/lighthouse-mobile.json", "utf8"),
);
const summary = {
  tool: `Lighthouse ${report.lighthouseVersion}`,
  url: report.finalUrl,
  fetchTime: report.fetchTime,
  mode: "Mobile simulation against local production server; laboratory measurement, not field data.",
  scores: Object.fromEntries(
    Object.entries(report.categories).map(([name, value]) => [
      name,
      Math.round(value.score * 100),
    ]),
  ),
  metrics: Object.fromEntries(
    [
      "first-contentful-paint",
      "largest-contentful-paint",
      "total-blocking-time",
      "cumulative-layout-shift",
      "speed-index",
    ].map((name) => [name, report.audits[name]?.displayValue]),
  ),
  opportunities: Object.values(report.audits)
    .filter(
      (a) =>
        a.score !== null && a.score < 1 && a.details?.type === "opportunity",
    )
    .map((a) => ({ title: a.title, savingsMs: a.details.overallSavingsMs })),
};
fs.writeFileSync(
  "docs/lighthouse-summary.json",
  JSON.stringify(summary, null, 2) + "\n",
);
console.log(JSON.stringify(summary, null, 2));
