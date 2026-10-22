import { parse } from "tldts";
import { isIP } from "node:net";
import type { Evidence } from "@/lib/validation/schemas";
import { PrivacyRedactionService as Privacy } from "@/lib/security/privacy";
const item = (
  id: string,
  title: string,
  explanation: string,
  observed: string,
  strength: Evidence["strength"] = "moderate",
  action = "Verify through an independently located official channel.",
): Evidence => ({
  id,
  title,
  explanation,
  observed: Privacy.redact(observed).slice(0, 500),
  category: "heuristic",
  strength,
  action,
});
export function normalizeUrl(input: string) {
  const raw = input.trim();
  if (
    /\s/.test(raw) ||
    Array.from(raw).some((c) => c.charCodeAt(0) < 32 || c.charCodeAt(0) === 127)
  )
    throw new Error("Enter a valid website address without spaces.");
  const url = new URL(/^[a-z][a-z\d+.-]*:/i.test(raw) ? raw : `https://${raw}`);
  if (!["http:", "https:"].includes(url.protocol))
    throw new Error("Only HTTP and HTTPS addresses are supported.");
  const host = url.hostname.toLowerCase().replace(/\.$/, "");
  const info = parse(host, { allowPrivateDomains: true });
  if (
    !host ||
    host === "localhost" ||
    host.endsWith(".localhost") ||
    host.endsWith(".local") ||
    isIP(host.replace(/^\[|\]$/g, "")) ||
    !info.domain ||
    (!info.isIcann && !info.isPrivate)
  )
    throw new Error(
      "Enter a public domain name. Local and IP addresses are not supported.",
    );
  url.hostname = host;
  return { url, domain: info.domain, subdomain: info.subdomain };
}
export function analyzeUrl(input: string) {
  const { url, domain, subdomain } = normalizeUrl(input);
  const evidence: Evidence[] = [];
  if (url.username || url.password)
    evidence.push(
      item(
        "userinfo",
        "Misleading address authority",
        "Text before @ is user information, not the destination domain.",
        `Destination: ${url.hostname}; user information is present.`,
        "strong",
      ),
    );
  if (url.protocol === "http:")
    evidence.push(
      item(
        "http",
        "Unencrypted connection",
        "HTTP does not protect data in transit. This alone does not establish fraud.",
        url.origin,
        "contextual",
        "Do not enter sensitive information over HTTP.",
      ),
    );
  if (url.hostname.includes("xn--"))
    evidence.push(
      item(
        "idn",
        "Internationalized domain",
        "An encoded domain may be legitimate, but visually similar characters can obscure the destination.",
        url.hostname,
        "contextual",
      ),
    );
  if ((subdomain?.split(".").length ?? 0) >= 3)
    evidence.push(
      item(
        "subdomains",
        "Complex subdomain structure",
        "Several labels precede the registered domain. Read the actual registered domain carefully.",
        `Registered domain: ${domain}`,
        "contextual",
      ),
    );
  for (const brand of [
    "paypal",
    "google",
    "microsoft",
    "amazon",
    "apple",
    "netflix",
    "sbi",
    "hdfc",
    "icici",
  ]) {
    if (
      (subdomain?.split(/[.-]/).includes(brand) ||
        domain.split(/[.-]/).includes(brand)) &&
      domain !== `${brand}.com` &&
      ![`${brand}.co.in`, `${brand}.in`].includes(domain)
    )
      evidence.push(
        item(
          `brand-${brand}`,
          "Possible brand reference",
          "A recognizable brand appears in a different registered domain. Affiliation is not established.",
          `Brand reference: ${brand}; registered domain: ${domain}`,
        ),
      );
  }
  if (/%[0-9a-f]{2}/i.test(url.pathname))
    evidence.push(
      item(
        "encoding",
        "Encoded path characters",
        "Encoding is common but can make a destination harder to read.",
        url.pathname.slice(0, 160),
        "contextual",
      ),
    );
  return { evidence, domain, normalized: url.toString() };
}
const rules: [string, RegExp, string, string, Evidence["strength"], string][] =
  [
    [
      "otp",
      /(?:share|send|tell|provide|enter).{0,45}(?:\botp\b|one.time.password|verification code|ओटीपी|ઓટીપી)/i,
      "Request for a security code",
      "Sharing a one-time code can give someone access to your account.",
      "strong",
      "Never share a one-time code with another person.",
    ],
    [
      "password",
      /(?:share|send|provide|tell).{0,35}(?:password|\bpin\b|cvv)/i,
      "Request for account secrets",
      "Someone is asking for credentials that should remain private.",
      "strong",
      "Contact the service through its official app or a known address.",
    ],
    [
      "fee",
      /(?:registration|training|verification|processing|upfront|advance).{0,30}(?:fee|payment|deposit)|(?:pay|send).{0,25}(?:fee|deposit).{0,35}(?:job|interview|offer)/i,
      "Advance payment request",
      "An upfront fee linked to an opportunity is a warning sign that needs verification.",
      "strong",
      "Verify the offer independently before sending money.",
    ],
    [
      "urgent",
      /act now|immediately|within \d+ (?:hours?|minutes?)|urgent|account.{0,20}(?:suspend|block)|तुरंत|તાત્કાલિક/i,
      "Pressure or urgency",
      "Time pressure can discourage careful checks. Legitimate messages may also be urgent.",
      "moderate",
      "Pause and verify the request independently.",
    ],
    [
      "remote",
      /anydesk|teamviewer|remote (?:access|desktop)|screen.?shar/i,
      "Remote access mentioned",
      "Remote access can expose your accounts and device. Context matters.",
      "moderate",
      "Do not grant an unexpected caller control of your device.",
    ],
    [
      "prize",
      /(?:won|winner|prize|lottery).{0,60}(?:claim|pay|fee|click)/i,
      "Unexpected prize claim",
      "Unexpected rewards tied to fees or links warrant extra checks.",
      "moderate",
      "Do not pay to receive an unexpected prize.",
    ],
    [
      "payment",
      /gift cards?|crypto.{0,20}(?:only|payment)|(?:pay|payment).{0,30}(?:outside|off.platform|friends and family)/i,
      "Hard-to-reverse payment",
      "The requested payment method may offer limited buyer protection.",
      "moderate",
      "Use a payment method with dispute protections where available.",
    ],
    [
      "guarantee",
      /guaranteed.{0,30}(?:return|income|profit)|no risk.{0,25}(?:invest|profit)|\d+% (?:daily|weekly) return/i,
      "Guaranteed financial return",
      "Financial guarantees and unusually high returns need independent verification.",
      "moderate",
      "Check official regulatory information before investing.",
    ],
  ];
export function analyzeText(text: string): Evidence[] {
  return rules.flatMap(([id, re, title, explanation, strength, action]) => {
    const match = re.exec(text);
    return match
      ? [
          item(
            id,
            title,
            explanation,
            text.slice(
              Math.max(0, match.index - 25),
              match.index + match[0].length + 45,
            ),
            strength,
            action,
          ),
        ]
      : [];
  });
}
export function extractUrls(text: string): string[] {
  return [...new Set(text.match(/https?:\/\/[^\s<>"']+/gi) ?? [])]
    .slice(0, 3)
    .map((u) => u.replace(/[.,);!?]+$/, ""));
}
export function analyzeRecruiter(
  email: string,
  websiteDomain: string,
): Evidence[] {
  const domain = email.trim().split("@")[1];
  if (!domain) return [];
  const parsed = parse(domain, { allowPrivateDomains: true });
  if (!parsed.domain || parsed.domain === websiteDomain) return [];
  return [
    item(
      "recruiter",
      "Recruiter and website domains differ",
      "The supplied email and website use different registered domains. Agencies may legitimately do this; a mismatch does not establish fraud.",
      `Recruiter domain: ${parsed.domain}; supplied website: ${websiteDomain}`,
      "contextual",
      "Confirm the recruiter through the employer’s official recruitment channel.",
    ),
  ];
}
