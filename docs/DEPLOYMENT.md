# Deployment guide

The source is Vercel-compatible. No public deployment or paid service activation is part of this build.

## 1. Google Gemini

Create or select a Google AI project under your own account. Review billing, regional availability, data handling and [Gemini API terms](https://ai.google.dev/gemini-api/terms). Create a restricted key and store it only as a server environment variable. Set `GEMINI_MODEL` to a model available to that project which supports [structured outputs](https://ai.google.dev/gemini-api/docs/structured-output). Set quotas and billing alerts before public traffic. SDK configuration has an 18-second transport timeout, no SDK retries, and one application retry for selected transient/quota failures.

## 2. Optional Web Risk

Enable the Web Risk API on an approved Google Cloud project, review its costs, restrict the key to that API, and set `GOOGLE_WEB_RISK_API_KEY`. Do not treat free consumer Safe Browsing terms as interchangeable with Web Risk. This implementation uses the [Lookup API](https://cloud.google.com/web-risk/docs/lookup-api), sending only the sanitized destination to Google's fixed API endpoint. Review whether query-free lookup coverage suits your risk model. Keep an eye on quota usage. An unavailable source is recorded explicitly.

## 3. Turnstile and Redis

Create a Turnstile widget restricted to approved hostnames. Set the public site key and server secret. The client requests action `analysis`; the server checks success, hostname and action using [Siteverify](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/). Tokens are single-use and the widget resets after submissions. Do not use Cloudflare test keys in production.

Use an approved Redis REST service supporting atomic EVAL (the Upstash interface is implemented). Store its HTTPS URL and token server-side. Generate a cryptographically random `RATE_LIMIT_HASH_SECRET` of at least 32 bytes. Set `ANALYSIS_RATE_LIMIT` according to your model budget. The default is 10 checks per ten minutes per network address; attempts, including invalid attempts, consume the limit. NAT users share a bucket. Limits fail closed if Redis fails.

Set `TRUSTED_PROXY=vercel`. The production adapter intentionally requires the platform's `VERCEL` variable and trusts only `x-vercel-forwarded-for`, not an arbitrary client `x-forwarded-for` header. Validate this header behavior on your actual Vercel deployment before opening access. A different hosting ingress requires an explicit trusted-IP adapter and tests.

## 4. Vercel project

Import the private GitHub repository through your approved Vercel account. Choose the Next.js framework, Node 24, `npm ci`, and `npm run build`. Installation copies OCR runtime assets into `public/ocr/`; keep the postinstall enabled or run the preparation script explicitly before build. Add environment variables separately for preview and production. The API route declares `maxDuration=60`; ensure the chosen hosting plan permits it and that request limits meet the workload.

Use the actual deployment origin for `APP_BASE_URL`, including `https://` and without a trailing slash. Set Turnstile hostnames to match. Do not assume a domain is owned. Review Vercel preview deployment authentication; avoid exposing cost-bearing preview APIs casually.

The application can build without secrets. Production API handlers intentionally return HTTP 503 until required configuration is present. This is a release safeguard, not a live-provider health check.

## 5. Domains and HTTPS

After domain ownership and deployment approval, add the domain in Vercel and configure the exact DNS records shown by that project. Verify TLS, redirects and `APP_BASE_URL`. Rebuild after changing public keys or metadata settings. Check canonical tags, sitemap, robots and Open Graph URLs on the real host.

## 6. Optional Supabase

Anonymous analysis needs no database. If developing accounts, apply `supabase/migrations/001_optional_accounts.sql` to a reviewed project. Implement authentication and account deletion, run authenticated/anonymous cross-user RLS checks, and schedule expired-report deletion before enabling writes. Use user JWTs and the public key for user requests. The service-role key is never used by the anonymous application. UI history and saved-report endpoints are not implemented in this release.

## 7. Validate the deployed preview

- Check `/api/health` without revealing any secrets.
- Verify missing protection configuration yields 503; foreign Origin yields 403; oversized JSON yields 413; unsupported content type yields 415; excessive requests yield 429 with Retry-After.
- Run one approved synthetic request with real Gemini credentials and check model metadata. Never use private customer data for smoke tests.
- Separately exercise Web Risk against Google's documented controlled test fixtures. Never browse real malicious targets.
- Test valid, invalid, expired and replayed Turnstile tokens on the approved hostname.
- Verify the limiter across multiple instances and check Redis expiry. Review billing dashboards and set alerts.
- Test OCR in desktop and mobile browsers, including a slow network and unavailable language-data host. Images must not appear in outgoing requests.
- Review logs for secrets and raw submissions. Enable only aggregate error codes and request durations in any added monitoring. Set retention deliberately.
- Supply a real operator identity, support channel, privacy contact, incident-response ownership and jurisdiction-appropriate legal review before public launch.

The release checklist is a gate for **your approved launch**, not evidence that live integrations were already validated.
