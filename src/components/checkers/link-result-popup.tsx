"use client";
import { useEffect, useRef } from "react";
import {
  CheckCircle2,
  TriangleAlert,
  ShieldAlert,
  Info,
  X,
  ArrowRight,
} from "lucide-react";
import { useLocale } from "@/components/providers";
import { CyberButton } from "@/components/ui/button";
import { linkResultCopy } from "@/lib/i18n/link-result";
import { resultTone } from "@/lib/result-sound";
import type { Report } from "@/lib/validation/schemas";
export function LinkResultPopup({
  report,
  open,
  onClose,
  onDetails,
  onReset,
  failure,
}: {
  report: Report | undefined;
  open: boolean;
  onClose: () => void;
  onDetails: () => void;
  onReset: () => void;
  failure?: string;
}) {
  const { locale, t } = useLocale();
  const copy = linkResultCopy[locale];
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && (report || failure) && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }, [open, report, failure]);
  if (!report && !failure) return null;
  const outcome = report?.outcome ?? "ANALYSIS_UNAVAILABLE";
  const tone = resultTone(outcome);
  const Icon =
    tone === "danger"
      ? ShieldAlert
      : tone === "warning"
        ? TriangleAlert
        : tone === "complete"
          ? CheckCircle2
          : Info;
  function close() {
    ref.current?.close();
    onClose();
  }
  return (
    <dialog
      ref={ref}
      className="link-result-popup"
      data-tone={tone}
      aria-labelledby="link-result-title"
      aria-describedby="link-result-description link-result-caution"
      onCancel={onClose}
      onClose={onClose}
    >
      <div className="link-result-top">
        <span className="mono">{copy.label}</span>
        <button
          type="button"
          className="icon-button"
          aria-label={copy.close}
          onClick={close}
        >
          <X size={19} />
        </button>
      </div>
      <div className="link-result-body">
        <div className="link-result-symbol">
          <Icon size={37} strokeWidth={1.6} />
        </div>
        <p className="link-result-category">{t.outcomes[outcome]}</p>
        <h2 id="link-result-title">{copy.titles[outcome]}</h2>
        <p id="link-result-description">{copy.bodies[outcome]}</p>
        <div className="link-result-summary">{report?.summary ?? failure}</div>
        {report?.metadata.aiAvailable === false && (
          <p className="link-result-incomplete">{copy.incomplete}</p>
        )}
        <p id="link-result-caution" className="small muted">
          {copy.caution}
        </p>
        <div className="link-result-actions">
          <CyberButton
            type="button"
            onClick={() => {
              close();
              if (report) onDetails();
            }}
          >
            {report ? copy.details : copy.close}
            <ArrowRight size={17} />
          </CyberButton>
          <CyberButton
            type="button"
            variant="ghost"
            onClick={() => {
              close();
              onReset();
            }}
          >
            {copy.another}
          </CyberButton>
        </div>
      </div>
    </dialog>
  );
}
