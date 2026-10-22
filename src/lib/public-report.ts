import { dictionary } from "@/lib/i18n/dictionaries";
import type { Locale, Report } from "@/lib/validation/schemas";

// Provider metadata stays in the internal contract; the public report uses plain labels.
export function checkLabel(name: string, locale: Locale) {
  const t = dictionary(locale);
  if (/gemini|ai interpretation|ai analysis/i.test(name))
    return t.automatedCheck;
  if (/web risk/i.test(name)) return t.reputationCheck;
  if (/privacy|निजी|ખાનગી/i.test(name)) return t.privacyCheck;
  if (/deterministic|नियम/i.test(name)) return t.patternCheck;
  return t.otherCheck;
}
export function checkState(
  state: Report["checks"][number]["state"],
  locale: Locale,
) {
  const t = dictionary(locale);
  return state === "completed"
    ? t.completed
    : state === "unavailable"
      ? t.unavailableCheck
      : t.notApplicable;
}

const implementationNotes = new Set([
  "This report cannot prove safety or fraud.",
  "Submitted sites were not opened or crawled. Reputation checks omit query strings, fragments and credentials.",
  "No employer records, reviews, ownership or registration databases were checked.",
  "Anonymous reports are held in this tab only and are not saved by ScamVeto.",
  "यह रिपोर्ट सुरक्षा या धोखाधड़ी सिद्ध नहीं कर सकती।",
  "वेबसाइट खोली या क्रॉल नहीं की गई। प्रतिष्ठा जाँच में क्वेरी, फ़्रैगमेंट और क्रेडेंशियल नहीं भेजे गए।",
  "नियोक्ता रिकॉर्ड, समीक्षाएँ, स्वामित्व या पंजीकरण डेटाबेस नहीं जाँचे गए।",
  "अनाम रिपोर्ट केवल इस टैब में रहती है; ScamVeto इसे सहेजता नहीं।",
  "આ અહેવાલ સુરક્ષા કે છેતરપિંડી સાબિત કરી શકતો નથી.",
  "વેબસાઇટ ખોલી કે ક્રૉલ કરી નથી. પ્રતિષ્ઠા તપાસમાં ક્વેરી, ફ્રેગમેન્ટ અને ઓળખ માહિતી મોકલેલ નથી.",
  "નોકરીદાતા રેકોર્ડ, સમીક્ષાઓ, માલિકી કે નોંધણી ડેટાબેસ તપાસ્યા નથી.",
  "અનામી અહેવાલ માત્ર આ ટૅબમાં રહે છે; ScamVeto તેને સાચવતું નથી.",
]);
export function reviewNotes(report: Report) {
  return report.limitations.filter((note) => !implementationNotes.has(note));
}

export function reportCopy(report: Report, locale: Locale) {
  const t = dictionary(locale);
  return [
    `ScamVeto — ${t.report}`,
    t.outcomes[report.outcome],
    report.summary,
    report.interpretation
      ? `${t.interpretation}\n${report.interpretation}`
      : "",
    t.evidence,
    ...report.evidence.map(
      (e) => `${e.title}\n${e.observed}\n${e.explanation}\n${e.action}`,
    ),
    t.actions,
    ...report.actions,
    t.checks,
    t.scopeNote,
    ...report.checks
      .filter((c) => c.state !== "not-applicable")
      .map(
        (c) => `${checkLabel(c.name, locale)}: ${checkState(c.state, locale)}`,
      ),
    ...reviewNotes(report),
    `ID: ${report.id}`,
    new Date(report.timestamp).toLocaleString(locale),
  ]
    .filter(Boolean)
    .join("\n\n");
}
