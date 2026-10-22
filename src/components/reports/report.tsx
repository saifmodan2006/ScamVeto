"use client";
import { useRef, useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  TriangleAlert,
  ShieldAlert,
  FileCheck2,
  Copy,
  Printer,
  ArrowUpRight,
  CheckCircle2,
  MinusCircle,
  ChevronDown,
} from "lucide-react";
import type { Report } from "@/lib/validation/schemas";
import { useLocale } from "@/components/providers";
import { CyberButton } from "@/components/ui/button";
import { PrivacyRedactionService } from "@/lib/security/privacy";
export function ReportView({
  report,
  onReset,
}: {
  report: Report;
  onReset: () => void;
}) {
  const { t, locale } = useLocale();
  const reduced = useReducedMotion();
  const heading = useRef<HTMLHeadingElement>(null);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  useEffect(() => {
    heading.current?.focus();
  }, [report.id]);
  const severe = report.outcome === "KNOWN_MALICIOUS",
    warning = report.outcome === "SUSPICIOUS_INDICATORS";
  async function copy() {
    try {
      const safe = PrivacyRedactionService.redact(
        JSON.stringify(report, null, 2),
      );
      await navigator.clipboard.writeText(safe);
      setCopied(true);
    } catch {
      setCopyError(true);
    }
  }
  return (
    <motion.article
      initial={reduced ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`report-panel ${severe ? "danger" : warning ? "warning" : "neutral"}`}
    >
      <div className="panel-caption">
        <span>{t.report}</span>
        <span>PRIVATE / EPHEMERAL</span>
      </div>
      <div className="report-content">
        <div className="report-status">
          {severe ? (
            <ShieldAlert size={22} />
          ) : warning ? (
            <TriangleAlert size={22} />
          ) : (
            <FileCheck2 size={22} />
          )}
          <span>{t.outcomes[report.outcome]}</span>
        </div>
        <h2 ref={heading} tabIndex={-1}>
          {report.summary}
        </h2>
        <p className="small muted">
          {new Date(report.timestamp).toLocaleString(locale)} · {report.type}
        </p>
        <p className="report-caution">
          {locale === "hi"
            ? "यह रिपोर्ट सुरक्षा या धोखाधड़ी का प्रमाण नहीं है। स्वतंत्र सत्यापन करें।"
            : locale === "gu"
              ? "આ અહેવાલ સુરક્ષા કે છેતરપિંડીનો પુરાવો નથી. સ્વતંત્ર ચકાસણી કરો."
              : "This report is not proof of safety or fraud. Verify independently before acting."}
        </p>
        {report.interpretation && (
          <section className="ai-interpretation">
            <h3>
              {locale === "hi"
                ? "Gemini की व्याख्या"
                : locale === "gu"
                  ? "Gemini ની સમજૂતી"
                  : "Gemini interpretation"}
            </h3>
            <p>{report.interpretation}</p>
            <p className="small muted">
              {locale === "hi"
                ? "यह AI व्याख्या है, स्वतंत्र सत्यापन नहीं।"
                : locale === "gu"
                  ? "આ AI સમજૂતી છે, સ્વતંત્ર ચકાસણી નથી."
                  : "AI interpretation, not independent verification."}
            </p>
          </section>
        )}
        <section>
          <h3>
            {t.evidence} <span className="pill">{report.evidence.length}</span>
          </h3>
          {report.evidence.length === 0 ? (
            <p className="muted">
              No supporting indicators were identified by completed checks. That
              does not establish safety.
            </p>
          ) : (
            report.evidence.map((e) => (
              <details className="evidence-card" key={e.id} open>
                <summary>
                  <span>
                    {e.title}
                    <small>
                      {e.category === "heuristic"
                        ? "Rule-based indicator"
                        : e.category === "reputation"
                          ? "Threat intelligence"
                          : "Gemini interpretation"}{" "}
                      · {e.strength}
                    </small>
                  </span>
                  <ChevronDown size={17} />
                </summary>
                <div>
                  <p>{e.explanation}</p>
                  <blockquote>{e.observed}</blockquote>
                  <p className="evidence-action">↳ {e.action}</p>
                </div>
              </details>
            ))
          )}
        </section>
        <section>
          <h3>{t.checks}</h3>
          <ol className="checks-timeline">
            {report.checks.map((c, i) => (
              <li key={`${c.name}-${i}`}>
                {c.state === "completed" ? (
                  <CheckCircle2 size={17} className="green" />
                ) : (
                  <MinusCircle size={17} className="muted" />
                )}
                <div>
                  <strong>
                    {c.name}
                    <span className="check-state">{c.state}</span>
                  </strong>
                  <p>{c.detail}</p>
                  <time className="small dim">
                    {new Date(c.at).toLocaleTimeString(locale)}
                  </time>
                </div>
              </li>
            ))}
          </ol>
        </section>
        <section>
          <h3>{t.actions}</h3>
          <ol className="actions-list">
            {report.actions.map((a, i) => (
              <li key={i}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                {a}
              </li>
            ))}
          </ol>
        </section>
        <details className="technical">
          <summary>
            {t.limitations}
            <ChevronDown size={16} />
          </summary>
          <ul>
            {report.limitations.map((l, i) => (
              <li key={i}>{l}</li>
            ))}
          </ul>
        </details>
        <details className="technical">
          <summary>
            {t.details}
            <ChevronDown size={16} />
          </summary>
          <dl>
            <dt>Report ID</dt>
            <dd>{report.id}</dd>
            <dt>Model</dt>
            <dd>{report.metadata.model ?? "Unavailable"}</dd>
            <dt>Reputation provider</dt>
            <dd>
              {report.metadata.reputationProvider ?? "No lookup completed"}
            </dd>
            <dt>Registered domain</dt>
            <dd>{report.metadata.registeredDomain ?? "Not applicable"}</dd>
          </dl>
        </details>
        <div className="button-row report-buttons">
          <CyberButton variant="secondary" type="button" onClick={copy}>
            <Copy size={16} />
            {copied ? "Copied" : t.copy}
          </CyberButton>
          <CyberButton
            variant="ghost"
            type="button"
            onClick={() => window.print()}
          >
            <Printer size={16} />
            {t.print}
          </CyberButton>
        </div>
        {copyError && (
          <p role="alert">
            Clipboard access failed. You can print the report instead.
          </p>
        )}
        <CyberButton type="button" onClick={onReset}>
          {t.newCheck}
          <ArrowUpRight size={17} />
        </CyberButton>
      </div>
    </motion.article>
  );
}
