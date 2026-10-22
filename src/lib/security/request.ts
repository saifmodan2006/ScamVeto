import { createHmac } from "node:crypto";
export class HttpError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message);
  }
}
const buckets = new Map<string, { count: number; expires: number }>();
export function productionReady() {
  return !!(
    process.env.GEMINI_API_KEY &&
    process.env.GEMINI_MODEL &&
    process.env.APP_BASE_URL?.startsWith("https://") &&
    process.env.TURNSTILE_SECRET_KEY &&
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY &&
    process.env.UPSTASH_REDIS_REST_URL?.startsWith("https://") &&
    process.env.UPSTASH_REDIS_REST_TOKEN &&
    (process.env.RATE_LIMIT_HASH_SECRET?.length ?? 0) >= 32 &&
    process.env.TRUSTED_PROXY === "vercel" &&
    process.env.VERCEL
  );
}
export async function readLimitedJson(
  req: Request,
  max = 20000,
): Promise<unknown> {
  if (!req.headers.get("content-type")?.startsWith("application/json"))
    throw new HttpError(415, "CONTENT_TYPE", "Send JSON content.");
  if (Number(req.headers.get("content-length") ?? 0) > max)
    throw new HttpError(413, "TOO_LARGE", "Submission is too large.");
  const reader = req.body?.getReader();
  if (!reader)
    throw new HttpError(400, "INVALID_INPUT", "A submission is required.");
  let size = 0;
  const decoder = new TextDecoder();
  let text = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > max) {
      await reader.cancel();
      throw new HttpError(413, "TOO_LARGE", "Submission is too large.");
    }
    text += decoder.decode(value, { stream: true });
  }
  try {
    return JSON.parse(text + decoder.decode());
  } catch {
    throw new HttpError(
      400,
      "INVALID_JSON",
      "The submission could not be read.",
    );
  }
}
export function checkOrigin(req: Request) {
  const origin = req.headers.get("origin");
  const expected = process.env.APP_BASE_URL
    ? new URL(process.env.APP_BASE_URL).origin
    : new URL(req.url).origin;
  if (!origin || origin !== expected)
    throw new HttpError(403, "ORIGIN", "Submit from the ScamVeto website.");
}
export async function rateLimit(req: Request) {
  const production = process.env.NODE_ENV === "production";
  const ip =
    process.env.TRUSTED_PROXY === "vercel" && process.env.VERCEL
      ? req.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim()
      : "local-development";
  if (!ip)
    throw new HttpError(
      503,
      "PROTECTION_UNAVAILABLE",
      "Request protection is unavailable.",
    );
  const limit = Math.max(
    1,
    Math.min(100, Number(process.env.ANALYSIS_RATE_LIMIT) || 10),
  );
  const window = 600000;
  const key = createHmac(
    "sha256",
    process.env.RATE_LIMIT_HASH_SECRET ?? "development-only",
  )
    .update(ip)
    .digest("hex");
  if (
    process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    try {
      const res = await fetch(process.env.UPSTASH_REDIS_REST_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify([
          "EVAL",
          "local n=redis.call('INCR',KEYS[1]); if n==1 then redis.call('PEXPIRE',KEYS[1],ARGV[1]) end; return n",
          "1",
          `sv:rate:${key}`,
          String(window),
        ]),
        signal: AbortSignal.timeout(4000),
        cache: "no-store",
      });
      const data = await res.json();
      if (!res.ok || typeof data.result !== "number") throw new Error();
      if (data.result > limit)
        throw new HttpError(
          429,
          "RATE_LIMIT",
          "Too many checks. Try again in 10 minutes.",
        );
      return;
    } catch (error) {
      if (error instanceof HttpError) throw error;
      throw new HttpError(
        503,
        "PROTECTION_UNAVAILABLE",
        "Request protection is temporarily unavailable.",
      );
    }
  }
  if (production)
    throw new HttpError(
      503,
      "PROTECTION_UNAVAILABLE",
      "Analysis is unavailable until production protections are configured.",
    );
  const now = Date.now();
  for (const [k, v] of buckets) if (v.expires < now) buckets.delete(k);
  const bucket = buckets.get(key) ?? { count: 0, expires: now + window };
  bucket.count++;
  buckets.set(key, bucket);
  if (bucket.count > limit)
    throw new HttpError(
      429,
      "RATE_LIMIT",
      "Too many checks. Try again in 10 minutes.",
    );
}
export async function verifyTurnstile(token: string | undefined) {
  if (!process.env.TURNSTILE_SECRET_KEY) {
    if (process.env.NODE_ENV === "production")
      throw new HttpError(
        503,
        "PROTECTION_UNAVAILABLE",
        "Verification is not configured.",
      );
    return;
  }
  if (!token)
    throw new HttpError(
      403,
      "VERIFICATION_REQUIRED",
      "Complete the security verification.",
    );
  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body: new URLSearchParams({
          secret: process.env.TURNSTILE_SECRET_KEY,
          response: token,
        }),
        signal: AbortSignal.timeout(6000),
        cache: "no-store",
      },
    );
    const data = await response.json();
    const hostname = new URL(
      process.env.APP_BASE_URL ?? "http://localhost:3000",
    ).hostname;
    if (
      !response.ok ||
      data.success !== true ||
      data.hostname !== hostname ||
      data.action !== "analysis"
    )
      throw new HttpError(
        403,
        "VERIFICATION_FAILED",
        "Security verification expired or failed. Please retry.",
      );
  } catch (error) {
    if (error instanceof HttpError) throw error;
    throw new HttpError(
      503,
      "PROTECTION_UNAVAILABLE",
      "Security verification is temporarily unavailable.",
    );
  }
}
