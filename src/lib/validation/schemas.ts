import { z } from "zod";
export const analysisTypes = [
  "url",
  "message",
  "job",
  "shop",
  "screenshot-text",
] as const;
export const analysisTypeSchema = z.enum(analysisTypes);
export type AnalysisType = z.infer<typeof analysisTypeSchema>;
export const localeSchema = z.enum(["en", "hi", "gu"]);
export type Locale = z.infer<typeof localeSchema>;
export const requestSchema = z
  .object({
    content: z.string().trim().min(3).max(12000),
    url: z.string().trim().max(2048).optional(),
    company: z.string().trim().max(200).optional(),
    jobTitle: z.string().trim().max(200).optional(),
    email: z.string().trim().max(254).optional(),
    locale: localeSchema.default("en"),
    turnstileToken: z.string().max(2048).optional(),
  })
  .strict();
export type AnalysisInput = z.infer<typeof requestSchema>;
export const evidenceSchema = z.object({
  id: z.string().max(100),
  title: z.string().max(160),
  explanation: z.string().max(1800),
  observed: z.string().max(500),
  category: z.enum(["heuristic", "reputation", "ai"]),
  strength: z.enum(["contextual", "moderate", "strong"]),
  action: z.string().max(800),
});
export type Evidence = z.infer<typeof evidenceSchema>;
export const aiSchema = z.object({
  summary: z.string().min(1).max(2000),
  threatCategory: z.string().max(120),
  observedIndicators: z
    .array(
      z.object({
        title: z.string().max(160),
        explanation: z.string().max(1800),
        observed: z.string().min(1).max(500),
        strength: z.enum(["contextual", "moderate", "strong"]),
        action: z.string().max(800),
      }),
    )
    .max(12),
  uncertainties: z.array(z.string().max(800)).max(10),
  supportingExplanations: z.array(z.string().max(800)).max(10),
  recommendedActions: z.array(z.string().max(800)).min(1).max(10),
  needsIndependentVerification: z.boolean(),
});
export type AiAnalysis = z.infer<typeof aiSchema>;
export const outcomeSchema = z.enum([
  "KNOWN_MALICIOUS",
  "SUSPICIOUS_INDICATORS",
  "NO_KNOWN_THREAT_FOUND",
  "INSUFFICIENT_EVIDENCE",
  "ANALYSIS_UNAVAILABLE",
]);
export type Outcome = z.infer<typeof outcomeSchema>;
export const reportSchema = z.object({
  id: z.string().uuid(),
  type: analysisTypeSchema,
  locale: localeSchema,
  outcome: outcomeSchema,
  summary: z.string(),
  interpretation: z.string().optional(),
  evidence: z.array(evidenceSchema),
  checks: z.array(
    z.object({
      name: z.string(),
      state: z.enum(["completed", "unavailable", "not-applicable"]),
      detail: z.string(),
      at: z.string(),
    }),
  ),
  actions: z.array(z.string()),
  limitations: z.array(z.string()),
  timestamp: z.string(),
  metadata: z.object({
    aiAvailable: z.boolean().optional(),
    model: z.string().optional(),
    reputationProvider: z.string().optional(),
    registeredDomain: z.string().nullable().optional(),
  }),
});
export type Report = z.infer<typeof reportSchema>;
