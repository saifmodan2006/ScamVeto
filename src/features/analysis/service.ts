import { randomUUID } from "node:crypto";
import {
  analyzeText,
  analyzeUrl,
  extractUrls,
  analyzeRecruiter,
} from "./deterministic";
import { GeminiAnalysisService, ProviderError } from "@/lib/gemini/service";
import {
  WebRiskProvider,
  type ThreatIntelligenceProvider,
} from "@/lib/threat-intelligence/web-risk";
import { PrivacyRedactionService as Privacy } from "@/lib/security/privacy";
import { localizeReport } from "@/lib/i18n/report";
import {
  reportSchema,
  type AnalysisInput,
  type AnalysisType,
  type Evidence,
  type Outcome,
  type Report,
} from "@/lib/validation/schemas";
export class EvidenceAggregator {
  static aggregate(rules: Evidence[], ai: Evidence[]) {
    return [
      ...new Map(
        [...rules, ...ai].map((e) => [
          e.id,
          {
            ...e,
            observed: Privacy.redact(e.observed),
            explanation: Privacy.redact(e.explanation),
            action: Privacy.redact(e.action),
            title: Privacy.redact(e.title),
          },
        ]),
      ).values(),
    ];
  }
}
export class RiskAssessmentService {
  static assess(
    evidence: Evidence[],
    aiAvailable: boolean,
    reputationComplete: boolean,
  ): Outcome {
    if (evidence.some((e) => e.category === "reputation"))
      return "KNOWN_MALICIOUS";
    if (
      evidence.some(
        (e) => e.category !== "ai" && e.strength !== "contextual",
      ) ||
      evidence.filter((e) => e.category === "ai" && e.strength !== "contextual")
        .length >= 2
    )
      return "SUSPICIOUS_INDICATORS";
    if (!aiAvailable) return "ANALYSIS_UNAVAILABLE";
    if (reputationComplete) return "NO_KNOWN_THREAT_FOUND";
    return "INSUFFICIENT_EVIDENCE";
  }
}
export class AnalysisService {
  constructor(
    private gemini = new GeminiAnalysisService(),
    private reputation: ThreatIntelligenceProvider = new WebRiskProvider(),
  ) {}
  async run(
    type: AnalysisType,
    input: AnalysisInput,
  ): Promise<{ report: Report; configurationRequired: boolean }> {
    const checks: Report["checks"] = [];
    const record = (
      name: string,
      state: Report["checks"][number]["state"],
      detail: string,
    ) => checks.push({ name, state, detail, at: new Date().toISOString() });
    const raw = [input.content, input.company, input.jobTitle, input.email]
      .filter(Boolean)
      .join("\n");
    let evidence: Evidence[] = analyzeText(raw);
    let registeredDomain: string | null | undefined;
    let urls =
      type === "url"
        ? [input.content]
        : [...(input.url ? [input.url] : []), ...extractUrls(raw)];
    urls = [...new Set(urls)].slice(0, 3);
    let reputationComplete = false;
    let lookupsComplete = 0;
    for (const candidate of urls) {
      let parsed;
      try {
        parsed = analyzeUrl(candidate);
      } catch (error) {
        if (type === "url" || candidate === input.url) throw error;
        record(
          "Embedded URL",
          "unavailable",
          "An embedded address was invalid or non-public.",
        );
        continue;
      }
      evidence.push(...parsed.evidence);
      registeredDomain ??= parsed.domain;
      const lookupUrl = Privacy.providerUrl(parsed.normalized);
      const result = await this.reputation.check(lookupUrl);
      record(
        "Google Web Risk",
        result.state === "unavailable" ? "unavailable" : "completed",
        result.state === "match"
          ? "Known threat-list match."
          : result.state === "no-match"
            ? "No match for the query-free URL. This is not proof of safety."
            : "No live threat-list lookup completed.",
      );
      if (result.state !== "unavailable") lookupsComplete++;
      if (result.state === "match")
        evidence.push({
          id: `reputation-${evidence.length}`,
          title: "Known threat-list match",
          explanation:
            "Google Web Risk returned a threat match for the submitted destination.",
          observed: result.threats.join(", "),
          category: "reputation",
          strength: "strong",
          action:
            "Do not interact with this destination. Contact the claimed organization independently.",
        });
    }
    reputationComplete = urls.length > 0 && lookupsComplete === urls.length;
    if (type === "job" && input.email && registeredDomain) {
      evidence.push(...analyzeRecruiter(input.email, registeredDomain));
    }
    record(
      "Deterministic indicators",
      "completed",
      "URL properties and contextual text patterns evaluated.",
    );
    if (!urls.length)
      record(
        "Google Web Risk",
        "not-applicable",
        "No supported URL was supplied.",
      );
    const content = Privacy.redact([raw, input.url].filter(Boolean).join("\n"));
    record(
      "Privacy redaction",
      "completed",
      "Recognizable secrets and personal identifiers masked before Gemini. Redaction may miss some information.",
    );
    let ai: Awaited<ReturnType<GeminiAnalysisService["analyze"]>> | undefined;
    let configurationRequired = false;
    try {
      ai = await this.gemini.analyze(type, content, evidence, input.locale);
      record(
        "Gemini interpretation",
        "completed",
        "Structured response validated. Supporting excerpts checked against the submission.",
      );
    } catch (error) {
      configurationRequired =
        error instanceof ProviderError &&
        error.code === "CONFIGURATION_REQUIRED";
      record(
        "Gemini interpretation",
        "unavailable",
        configurationRequired
          ? "AI analysis is not configured."
          : "AI analysis could not complete. Retry later.",
      );
    }
    const allowed = [content, ...evidence.map((e) => e.observed)]
      .join("\n")
      .normalize("NFKC")
      .toLowerCase();
    const aiEvidence: Evidence[] =
      ai?.analysis.observedIndicators
        .filter((e) =>
          allowed.includes(e.observed.normalize("NFKC").toLowerCase()),
        )
        .map((e, i) => ({ ...e, id: `ai-${i}`, category: "ai" })) ?? [];
    evidence = EvidenceAggregator.aggregate(evidence, aiEvidence);
    const outcome = RiskAssessmentService.assess(
      evidence,
      !!ai,
      reputationComplete,
    );
    return {
      configurationRequired,
      report: localizeReport(
        reportSchema.parse({
          id: randomUUID(),
          type,
          locale: input.locale,
          outcome,
          summary: "",
          interpretation: ai ? Privacy.redact(ai.analysis.summary) : undefined,
          evidence,
          checks,
          actions: [
            ...new Set([
              ...evidence.map((e) => e.action),
              ...(ai?.analysis.recommendedActions.map(Privacy.redact) ?? []),
              "Contact the claimed organization using a known official channel.",
            ]),
          ].slice(0, 10),
          limitations: [
            "This report cannot prove safety or fraud.",
            "Submitted sites were not opened or crawled. Reputation checks omit query strings, fragments and credentials.",
            "No employer records, reviews, ownership or registration databases were checked.",
            "Anonymous reports are held in this tab only and are not saved by ScamVeto.",
            ...(ai?.analysis.uncertainties.map(Privacy.redact) ?? []),
            ...(ai?.analysis.supportingExplanations.map(Privacy.redact) ?? []),
          ],
          timestamp: new Date().toISOString(),
          metadata: {
            aiAvailable: !!ai,
            model: ai?.model,
            reputationProvider: lookupsComplete ? "Google Web Risk" : undefined,
            registeredDomain,
          },
        }),
      ),
    };
  }
}
