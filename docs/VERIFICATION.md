# Verification record

Verified locally on **23 October 2026 (Asia/Calcutta)** with Node 24.21.0, Next.js 16.4.2, React 19.3.1 and locked npm dependencies.

## Executed checks

| Command/check | Actual result |
| --- | --- |
| `npm run typecheck` | Passed, no TypeScript errors. |
| `npm run lint` | Passed, no ESLint errors or warnings. |
| `npm test` | **85 tests passed across 6 test files.** |
| `npx playwright test` | **32 tests passed** across desktop Chromium and emulated iPhone 13 Chromium. |
| `npm run build` | Passed; 22 static generation entries plus dynamic checkers/API routes. |
| `npm audit` | **0 vulnerabilities** at verification time. |
| Production `/api/health` | HTTP 200 with only `{status:"ok"}`. |
| Unconfigured production analysis | HTTP 503, `SERVICE_UNAVAILABLE`; failed closed. |
| Cross-origin production request | HTTP 403. |
| Unconfigured development analysis | HTTP 503, `CONFIGURATION_REQUIRED`, with deterministic findings and `aiAvailable:false`. |
| Production security headers | CSP present, `nosniff`, framing `DENY`. |
| Narrow layout | 320px and 390px overflow checks passed; landscape checked. |
| Axe scans | No WCAG A/AA findings on tested homepage and message checker in both browser projects. |
| Real OCR | Successfully extracted text from a generated synthetic PNG in desktop and mobile browser runs. No POST/image-upload requests were made during OCR. |

Tests exercise URL schemes and local/IP rejection, public/private suffix parsing, brand references, punycode context, sensitive-data masking, evidence aggregation, outcome mapping, schema failures, prompt/data separation, Gemini transport bounds/retries/timeouts, Web Risk match/nonmatch/unavailability, Turnstile verification, rate-limit failure behavior, API status codes, body limits, image signature/pixel bombs, HTML rendered as inert text, localization and report focus.

Browser tests cover all five checker forms, controlled report rendering, loading/failure states, reset, consent/validation, keyboard navigation, mobile navigation, language switching, reduced motion, screenshot rejection/preview/removal, real OCR, content pages and 404 handling. Mocked analysis reports are only test fixtures and are never returned by production services.

## Performance

The checked-in [Lighthouse summary](lighthouse-summary.json) records a mobile laboratory run against the local **production** server. It is not field Core Web Vitals data or a guarantee about hosting/device performance. The first run identified animation startup costs; Motion was removed from the homepage and retained for report transitions, and continuous decorative animations were disabled on touch devices. Final measurements are recorded in the summary artifact.

Desktop and mobile previews were captured from the production build with reduced motion. They are visual artifacts, not fabricated threat telemetry.

## Live Gemini follow-up verification

On 23 October 2026, the operator supplied a Gemini credential. It was stored only in Git-ignored `.env.local`; it was not committed or pushed. Model discovery succeeded. After selecting an available model, a synthetic recruiter-fee submission through the actual development HTTP endpoint returned **HTTP 200**, `aiAvailable:true`, a validated interpretation and `SUSPICIOUS_INDICATORS`. The configured model was `gemini-3.5-flash`; Google reported model version `gemini-3.6-flash`. No private user content was used in this request.

The development application uses the local credential. Public production analysis still requires the separate Turnstile, Redis and trusted-ingress configuration described in DEPLOYMENT.md.

## Remaining external-service validation

- Gemini was validated with one successful end-to-end synthetic analysis as recorded above. Automated tests continue to use controlled provider fixtures and do not depend on the live credential.
- No real Google Web Risk lookup was made. The genuine adapter was validated with controlled match, nonmatch, malformed and timeout responses.
- No production Turnstile widget/site verification or cross-instance Redis service was provisioned. Request validation, server verification behavior and fail-closed conditions were tested with controlled fixtures.
- Supabase RLS migration was not run against a database. Accounts, saved-report endpoints, retention jobs and account deletion remain future features; no user-data persistence is enabled.
- Mobile browser runs emulate a phone in Chromium. Physical Android, mobile Safari and assistive-technology testing remain release checks.
- English/Hindi/Gujarati core UX and deterministic guidance are implemented; editorial/legal content and some secondary UI copy remain English. Native-speaker translation review remains a launch task.
- No public Vercel deployment, domain purchase or paid infrastructure activation was performed.

The source was subsequently connected to the operator-supplied public repository, [saifmodan2006/ScamVeto](https://github.com/saifmodan2006/ScamVeto), preserving its initial commit. Its existing Actions setting is enabled. The test counts above are local command results, not claimed remote CI results. Provider credentials remain in Git-ignored local configuration.
