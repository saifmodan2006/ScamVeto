import { NextResponse } from "next/server";
import { analysisTypeSchema, requestSchema } from "@/lib/validation/schemas";
import { AnalysisService } from "@/features/analysis/service";
import { normalizeUrl } from "@/features/analysis/deterministic";
import {
  checkOrigin,
  HttpError,
  productionReady,
  rateLimit,
  readLimitedJson,
  verifyTurnstile,
} from "@/lib/security/request";
export const runtime = "nodejs";
export const maxDuration = 60;
export async function POST(
  request: Request,
  { params }: { params: Promise<{ type: string }> },
) {
  try {
    checkOrigin(request);
    if (process.env.NODE_ENV === "production" && !productionReady())
      throw new HttpError(
        503,
        "SERVICE_UNAVAILABLE",
        "Analysis is not yet configured for public use.",
      );
    await rateLimit(request);
    const type = analysisTypeSchema.safeParse((await params).type);
    if (!type.success)
      throw new HttpError(404, "NOT_FOUND", "Unknown checker.");
    const input = requestSchema.safeParse(await readLimitedJson(request));
    if (!input.success)
      throw new HttpError(
        400,
        "INVALID_INPUT",
        "Check your submission. Use 3–12,000 characters and supported fields.",
      );
    if (type.data === "url" && input.data.content.length > 2048)
      throw new HttpError(
        400,
        "INVALID_INPUT",
        "Website addresses must be under 2,048 characters.",
      );
    await verifyTurnstile(input.data.turnstileToken);
    try {
      if (type.data === "url") normalizeUrl(input.data.content);
      if (input.data.url) normalizeUrl(input.data.url);
    } catch {
      throw new HttpError(
        400,
        "INVALID_URL",
        "Enter a public HTTP or HTTPS website address.",
      );
    }
    const result = await new AnalysisService().run(type.data, input.data);
    const incomplete = result.report.metadata.aiAvailable === false;
    return NextResponse.json(
      {
        report: result.report,
        ...(incomplete
          ? {
              error: {
                code:
                  result.configurationRequired &&
                  process.env.NODE_ENV !== "production"
                    ? "CONFIGURATION_REQUIRED"
                    : "SERVICE_UNAVAILABLE",
                message:
                  "AI analysis could not complete. The report contains only completed checks.",
              },
            }
          : {}),
      },
      {
        status: incomplete ? 503 : 200,
        headers: { "Cache-Control": "no-store" },
      },
    );
  } catch (error) {
    if (error instanceof HttpError)
      return NextResponse.json(
        { error: { code: error.code, message: error.message } },
        {
          status: error.status,
          headers: error.status === 429 ? { "Retry-After": "600" } : {},
        },
      );
    return NextResponse.json(
      {
        error: {
          code: "SERVICE_UNAVAILABLE",
          message: "Analysis could not complete. Please try again later.",
        },
      },
      { status: 500 },
    );
  }
}
