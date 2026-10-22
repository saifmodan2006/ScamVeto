# Public launch checklist

Source preparation is complete only to the extent recorded in VERIFICATION.md. These operational checks require the operator's accounts and approval.

- [ ] Review and approve Vercel hosting, domains and any provider charges.
- [ ] Publish real legal operator identity, support/security channel and privacy contact.
- [ ] Review jurisdiction-specific terms, privacy notices and provider data handling.
- [ ] Configure Gemini server key and account-supported structured-output model.
- [ ] Perform a real synthetic Gemini request and validate returned model metadata.
- [ ] Configure optional Web Risk; validate official match/nonmatch fixtures and quota failure.
- [ ] Configure Turnstile restricted hostnames; test valid/expired/replayed tokens.
- [ ] Configure Redis REST, HMAC secret and appropriate usage limit.
- [ ] Validate trusted Vercel client-IP headers and cross-instance rate limits.
- [ ] Set provider quotas/billing alerts and platform abuse controls; assign monitoring ownership.
- [ ] Set actual HTTPS APP_BASE_URL; verify metadata, sitemap and redirects.
- [ ] Run typecheck, lint, unit/integration/browser tests, dependency audit and production build.
- [ ] Review real mobile Safari/Android, text zoom, keyboard, reduced motion and OCR.
- [ ] Review Hindi/Gujarati translations with native speakers; translate remaining English editorial content as needed for target launch markets.
- [ ] Confirm no raw inputs, secrets or screenshots appear in logs or reports.
- [ ] Confirm reports reset when leaving/reloading and no public report links exist.
- [ ] Exercise provider downtime, quota limits and failed security-verification recovery.
- [ ] If adding accounts, first implement authenticated UI, deletion/retention jobs and real cross-user RLS tests.
- [ ] Obtain explicit approval for public deployment. No public deployment has been performed by this implementation task.
