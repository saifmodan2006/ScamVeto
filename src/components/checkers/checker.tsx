"use client";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useState, useCallback, useRef } from "react";
import {
  ArrowUpRight,
  ArrowLeft,
  ShieldCheck,
  LockKeyhole,
  LoaderCircle,
  FileSearch,
  TriangleAlert,
} from "lucide-react";
import { useLocale } from "@/components/providers";
import { CyberButton } from "@/components/ui/button";
import { Turnstile } from "./turnstile";
import { ReportView } from "@/components/reports/report";
import { tools } from "@/components/home";
import {
  reportSchema,
  type AnalysisType,
  type Report,
} from "@/lib/validation/schemas";
import { PrivacyRedactionService } from "@/lib/security/privacy";
const ImageUpload = dynamic(
  () => import("./image-upload").then((m) => m.ImageUpload),
  { loading: () => <p>Loading image tools…</p> },
);
export function Checker({ type }: { type: AnalysisType }) {
  const { t, locale } = useLocale();
  const key = type === "screenshot-text" ? "screenshot" : type;
  const tool = tools.find((x) => x.key === key)!;
  const [content, setContent] = useState("");
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [report, setReport] = useState<Report>();
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [resetKey, setResetKey] = useState(0);
  const [stage, setStage] = useState("");
  const [imageReset, setImageReset] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const contentRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null);
  const onToken = useCallback((v: string) => setToken(v), []);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setReport(undefined);
    setError("");
    setStage("Validating submission");
    const form = new FormData(e.currentTarget);
    try {
      if (content.trim().length < 3)
        throw new Error("Enter at least 3 characters.");
      setStage(
        "Waiting for server analysis. Provider availability will appear in the report.",
      );
      const body = {
        content:
          type === "url" ? content : PrivacyRedactionService.redact(content),
        locale,
        turnstileToken: token,
        ...(type === "job"
          ? {
              company: PrivacyRedactionService.redact(
                String(form.get("company") ?? ""),
              ),
              jobTitle: PrivacyRedactionService.redact(
                String(form.get("jobTitle") ?? ""),
              ),
              // Keep only the domain for comparing recruiter and website claims.
              email: String(form.get("email") ?? "").replace(
                /^[^@]+@/,
                "redacted@",
              ),
            }
          : {}),
        ...(["job", "shop"].includes(type) && form.get("url")
          ? { url: String(form.get("url")) }
          : {}),
      };
      const response = await fetch(`/api/analyze/${type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(60000),
      });
      const result = await response.json();
      if (result.report) setReport(reportSchema.parse(result.report));
      if (!response.ok)
        setError(
          result.error?.code === "CONFIGURATION_REQUIRED"
            ? t.configuration
            : result.report
              ? t.unavailable
              : (result.error?.message ?? t.retry),
        );
      setStage("");
    } catch (e) {
      setError(
        e instanceof Error && e.name === "TimeoutError"
          ? "The request timed out. Please retry."
          : e instanceof Error
            ? e.message
            : t.retry,
      );
      setStage("");
    } finally {
      setBusy(false);
      setToken("");
      setResetKey((v) => v + 1);
    }
  }
  function reset() {
    formRef.current?.reset();
    setImageReset((v) => v + 1);
    setReport(undefined);
    setError("");
    setContent("");
    setConsent(false);
    contentRef.current?.focus();
  }
  return (
    <main id="main" className="checker-page container">
      <Link href="/#tools" className="text-link back-link">
        <ArrowLeft size={16} />
        {t.tools}
      </Link>
      <div className="checker-heading">
        <p className="eyebrow">SCAMVETO / CHECK {tool.code}</p>
        <h1>
          <tool.icon size={34} />
          {t[key]}
          <span className="green">.</span>
        </h1>
        <p>{t[`${key}Desc`]}</p>
      </div>
      <nav className="checker-tabs" aria-label="Checker types">
        {tools.map(({ id, key: tab, icon: Icon }) => (
          <Link
            href={`/check/${id}`}
            aria-current={key === tab ? "page" : undefined}
            key={id}
          >
            <Icon size={17} />
            {t[tab]}
          </Link>
        ))}
      </nav>
      <div className="checker-workspace">
        <div>
          <form ref={formRef} className="submission-panel" onSubmit={submit}>
            <div className="panel-caption">
              <span>01 / {t.review}</span>
              <LockKeyhole size={15} />
            </div>
            <div className="form-content">
              {type === "screenshot-text" && (
                <ImageUpload key={imageReset} onText={setContent} />
              )}
              <div className="field">
                <label htmlFor="content">
                  {type === "url"
                    ? t.urlInput
                    : type === "screenshot-text"
                      ? t.extracted
                      : t.input}
                </label>
                {type === "url" ? (
                  <input
                    ref={contentRef as React.RefObject<HTMLInputElement>}
                    id="content"
                    name="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="https://example.com"
                    required
                    minLength={3}
                    maxLength={2048}
                    autoComplete="off"
                    spellCheck={false}
                  />
                ) : (
                  <textarea
                    ref={contentRef as React.RefObject<HTMLTextAreaElement>}
                    id="content"
                    name="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={
                      type === "job"
                        ? "Paste the job description, recruiter message, and any payment request…"
                        : type === "shop"
                          ? "Describe the offer, seller claims, and requested payment method…"
                          : "Paste the suspicious text here. Remove personal information first…"
                    }
                    rows={8}
                    minLength={3}
                    maxLength={12000}
                    required
                  />
                )}
                <span className="field-help">
                  {type === "url"
                    ? "HTTP and HTTPS only. We never open or crawl the destination."
                    : `${content.length.toLocaleString(locale)} / 12,000`}
                </span>
              </div>
              {type === "job" && (
                <div className="job-fields">
                  {[
                    ["company", t.company],
                    ["jobTitle", t.jobTitle],
                    ["email", t.email],
                  ].map(([name, label]) => (
                    <div className="field" key={name}>
                      <label htmlFor={name}>{label}</label>
                      <input
                        id={name}
                        name={name}
                        maxLength={name === "email" ? 254 : 200}
                      />
                    </div>
                  ))}
                </div>
              )}
              {["job", "shop"].includes(type) && (
                <div className="field">
                  <label htmlFor="related-url">{t.website}</label>
                  <input
                    id="related-url"
                    name="url"
                    placeholder="https://example.com"
                    maxLength={2048}
                  />
                </div>
              )}
              <div className="privacy-note">
                <ShieldCheck size={19} />
                <p>{t.noSecrets}</p>
              </div>
              <label className="consent">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  required
                />
                <span>{t.consent}</span>
              </label>
              <Turnstile onToken={onToken} resetKey={resetKey} />
              <CyberButton
                type="submit"
                disabled={
                  busy ||
                  !consent ||
                  (!!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && !token)
                }
                className="submit-button"
              >
                {busy ? (
                  <LoaderCircle className="spin" size={18} />
                ) : (
                  <ShieldCheck size={18} />
                )}{" "}
                {busy ? t.checking : t.submit}
                {!busy && <ArrowUpRight size={18} />}
              </CyberButton>
              <div className="form-bottom">
                <span>
                  <LockKeyhole size={13} /> Anonymous · Not saved
                </span>
                <button
                  type="button"
                  className="text-button"
                  disabled={busy}
                  onClick={() =>
                    setContent(
                      type === "url"
                        ? "https://paypal.account-review.example.com/login"
                        : type === "job"
                          ? "Pay a registration fee to confirm your interview. Act now."
                          : type === "shop"
                            ? "Pay outside the platform using gift cards to claim this offer."
                            : "Urgent: share your OTP immediately to avoid account suspension.",
                    )
                  }
                >
                  {t.example}
                </button>
              </div>
              {error && (
                <div className="error-message" role="alert">
                  <TriangleAlert size={18} />
                  <span>{error}</span>
                </div>
              )}
              {busy && (
                <div role="status" className="processing-state">
                  <LoaderCircle className="spin" size={18} />
                  {stage}
                </div>
              )}
            </div>
          </form>
          <p className="small muted checker-disclaimer">
            {t.privacyBody} <Link href="/privacy">Privacy details ↗</Link>
          </p>
        </div>
        <div className="report-workspace">
          {report ? (
            <ReportView report={report} onReset={reset} />
          ) : (
            <div className={`report-empty ${busy ? "scanning" : ""}`}>
              <div className="panel-caption">
                <span>02 / {t.report}</span>
                <span>AWAITING INPUT</span>
              </div>
              <div className="report-empty-body">
                <div className="empty-icon">
                  {busy ? (
                    <LoaderCircle className="spin" size={34} />
                  ) : (
                    <FileSearch size={34} />
                  )}
                </div>
                <h2>{busy ? t.checking : t.empty}</h2>
                <p>{t.emptyBody}</p>
                <div className="empty-legend">
                  <span>
                    <i />
                    Observed indicators
                  </span>
                  <span>
                    <i />
                    Available checks
                  </span>
                  <span>
                    <i />
                    Practical next steps
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
