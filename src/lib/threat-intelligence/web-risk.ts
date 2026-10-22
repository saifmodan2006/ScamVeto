import { z } from "zod";
export type ReputationResult = {
  state: "match" | "no-match" | "unavailable";
  threats: string[];
};
export interface ThreatIntelligenceProvider {
  check(url: string): Promise<ReputationResult>;
}
const schema = z.object({
  threat: z
    .object({
      threatTypes: z
        .array(z.enum(["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE"]))
        .min(1),
      expireTime: z.string().optional(),
    })
    .optional(),
});
export class WebRiskProvider implements ThreatIntelligenceProvider {
  async check(url: string): Promise<ReputationResult> {
    if (!process.env.GOOGLE_WEB_RISK_API_KEY)
      return { state: "unavailable", threats: [] };
    const target = new URL("https://webrisk.googleapis.com/v1/uris:search");
    target.searchParams.set("uri", url);
    target.searchParams.set("key", process.env.GOOGLE_WEB_RISK_API_KEY);
    for (const t of ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE"])
      target.searchParams.append("threatTypes", t);
    try {
      const res = await fetch(target, {
        signal: AbortSignal.timeout(7000),
        cache: "no-store",
        redirect: "error",
      });
      if (!res.ok) throw new Error();
      const parsed = schema.parse(await res.json());
      return {
        state: parsed.threat ? "match" : "no-match",
        threats: parsed.threat?.threatTypes ?? [],
      };
    } catch {
      return { state: "unavailable", threats: [] };
    }
  }
}
