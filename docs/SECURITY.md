# Security and privacy architecture

## Trust boundaries

1. The browser receives public UI configuration only. Screenshots are validated by type, signatures, bytes and pixel dimensions before browser decoding/OCR. Recognition results are editable. No screenshot upload endpoint exists.
2. Same-origin JSON requests pass production-readiness, distributed rate-limit, body/schema and Turnstile validation before analysis. Raw inputs are transient and are not application-logged or database-saved.
3. Deterministic code parses URL strings with WHATWG URL and `tldts`; it never resolves, fetches or crawls destinations. IPs, local domains and unsupported schemes are rejected. This eliminates URL-driven server fetches rather than relying on a DNS allowlist.
4. The reputation adapter calls only Google's fixed Web Risk endpoint, with a seven-second timeout. URL user information, fragment and query are omitted. No-match, match and unavailable remain distinct.
5. Gemini sees minimized redacted text/evidence. System instructions explicitly treat submission text as untrusted data. There are no browsing, URL context, function-calling, shell or file tools. JSON Schema and Zod validate output shape and bounds. AI indicator excerpts must match supplied material.
6. The server computes outcome categories; model summaries appear as labeled interpretation, separate from the controlled assessment. React renders untrusted strings as text. There is no `dangerouslySetInnerHTML` or clickable suspect destination.
7. Optional persistence is disabled. The Supabase helper uses the user token and public key, not service-role bypass. The migration restricts select/insert/delete to the owner and excludes expired reads.

## Abuse controls

Production checks require Turnstile, Redis REST limits, Gemini configuration, an HTTPS app origin and the trusted Vercel ingress adapter. Failures close the analysis path. IP identifiers are HMAC-derived and expire with the limiter bucket after ten minutes. This is not an anti-bot guarantee: combine application limits with platform firewall/request controls and provider budget/quota alerts.

Whole JSON bodies are limited to 20,000 UTF-8 bytes. Main text is bounded to 12,000 characters, URLs to 2,048, and images to 5 MB, 16 million pixels and 8,000 pixels per side. Up to three distinct embedded URLs are checked. No unbounded retries or artificial progress percentages are used. Vercel's 60-second route maximum is the outer hosting bound; provider calls have shorter independent deadlines.

## Header policy

Next.js sets CSP, `nosniff`, no-referrer, deny framing, HSTS and restrictive camera/microphone/geolocation permissions. CSP permits local Next.js bootstrap scripts/styles and WebAssembly compilation, local/blob image previews and workers, Cloudflare challenges and OCR language downloads. Production excludes ordinary `unsafe-eval`, though Next inline scripts require `unsafe-inline` in this static-compatible baseline. Review nonce-based CSP as a separate hardening enhancement; no claim of strict nonce CSP is made.

## Limits and residual risk

Redaction does not reliably recognize every name, address, identifier or secret, especially across languages and free-form URLs. Users are told to remove personal information themselves. Provider retention and deployment metadata policies remain independent of this source code. Prompt instructions and excerpt grounding reduce but do not eliminate adversarial model behavior or inaccurate explanations. URL heuristics can have innocent explanations; brand references are not ownership checks. No outcome certifies legitimacy.

The browser must decode images locally after header inspection; using a maintained browser and OCR library is still necessary. A malicious image may fail parsing, and OCR can be inaccurate. The form offers manual text correction. Saved-report authorization policies are supplied as infrastructure only; they have not been executed against a provisioned Supabase database.

## Monitoring and incident response

No invasive analytics or remote error collector is activated. If adding monitoring, emit only event codes, coarse duration and provider availability. Never emit request bodies, model prompts, tokens, raw exception objects, full URL query strings or image data. Review host-level access logs and retention. Assign an incident owner and private security-reporting contact before public release; no address has been fabricated.
