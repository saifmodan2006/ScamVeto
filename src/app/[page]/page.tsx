import { notFound } from "next/navigation";
import Link from "next/link";
const pages = {
  about: {
    title: "A clearer picture. A more informed next step.",
    lead: "ScamVeto helps people examine suspicious digital requests without turning uncertainty into a false guarantee.",
    sections: [
      [
        "Why ScamVeto exists",
        "A convincing message can make anyone pause. ScamVeto explains concerning patterns and helps you decide what to verify before taking action.",
      ],
      [
        "How to read a report",
        "Start with the findings, read the supporting evidence, and follow the suggested next steps. A warning sign calls for closer verification; a known threat match calls for extra caution.",
      ],
      [
        "What is available",
        "Choose a check for a link, message, job offer, shopping claim or screenshot text. Get a private report with understandable findings and practical verification guidance, without creating an account.",
      ],
    ],
  },
  privacy: {
    title: "Your check, your business.",
    lead: "Anonymous checking is designed to use as little information as practical. Never submit passwords, one-time codes, full card numbers or banking secrets.",
    sections: [
      [
        "What is processed",
        "The text and optional details you submit are processed to create a report. Recognizable secrets, email addresses, phone numbers and long numerical identifiers are masked before text is sent to Google's AI service. Remove personal data yourself before submitting, because automated redaction may miss information.",
      ],
      [
        "External providers",
        "Google's AI service receives redacted text, URL properties and evidence for analysis. When link reputation checks are available, Google's URL reputation service receives supported website addresses with credentials, query strings and fragments removed. Google's applicable service terms and retention policies govern its handling of this data. Submitted websites are not opened or crawled by our server.",
      ],
      [
        "Screenshots stay on your device",
        "Image validation, previews and optical character recognition run in your browser. OCR downloads software and language resources, which can disclose your network address to the download host. Your image is not uploaded. You can edit the extracted text before consenting to analysis.",
      ],
      [
        "Retention and deletion",
        "Anonymous submissions and reports are not written to a database by ScamVeto. Reports remain in page memory until you reset, reload or leave. The current implementation has no account history, advertising analytics or tracking cookies. Deployment infrastructure may keep request metadata; operators must configure minimal retention and avoid logging bodies.",
      ],
      [
        "Abuse prevention",
        "If enabled, Cloudflare Turnstile verifies a security challenge. Production rate limiting stores an HMAC-derived network identifier and a counter in Redis for up to ten minutes, without submitted content. It is used for abuse prevention, not advertising profiles.",
      ],
      [
        "Your controls",
        "Choose what to submit, remove identifiers, and reset the report when finished. Animations respect your device's reduced-motion preference. Copying or printing creates a copy under your control. No public report links are created.",
      ],
    ],
  },
  terms: {
    title: "Use the evidence. Keep your judgment.",
    lead: "ScamVeto is an informational decision-support tool. It does not certify that a person, organization, offer or website is safe or fraudulent.",
    sections: [
      [
        "Limitations",
        "Results depend on supplied information, available providers and imperfect analysis. Warning signs may have innocent explanations. New or unlisted threats may be missed. Verify important requests through independent official channels.",
      ],
      [
        "Responsible use",
        "Only submit material you are entitled to process. Remove personal information. Do not use the service to harass people, publish unsubstantiated allegations, or attempt to bypass technical protections.",
      ],
      [
        "No professional determination",
        "Reports are general information, not legal, financial or forensic advice. In urgent financial-fraud situations, contact your bank and official reporting channels promptly.",
      ],
      [
        "Public launch requirements",
        "This is a pre-release application. Before public launch, the operator must supply its legal identity, contact and privacy-request channel, jurisdiction-specific terms, provider disclosures and applicable retention policy. Those details have not been invented in this build.",
      ],
    ],
  },
  contact: {
    title: "Help should start with the right channel.",
    lead: "ScamVeto is in pre-release. A public support address and legal operator details have not yet been configured.",
    sections: [
      [
        "For an active scam or payment incident",
        "Contact your bank or affected service directly through an official app or known telephone number. In India, call 1930 for financial cyber fraud and report at cybercrime.gov.in. ScamVeto cannot freeze transactions or recover funds.",
      ],
      [
        "For product support and privacy requests",
        "The operator must configure and publish a monitored contact channel before launch. Do not submit private financial details through security-check forms as a support request.",
      ],
      [
        "For security researchers",
        "No vulnerability-reporting email has been configured. Report vulnerabilities through the repository’s private security advisory feature once a public repository and maintainer are assigned. Do not publish real user data or secrets.",
      ],
    ],
  },
} as const;
export function generateStaticParams() {
  return Object.keys(pages).map((page) => ({ page }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;
  return {
    title: page in pages ? page[0].toUpperCase() + page.slice(1) : "Not found",
    alternates: { canonical: `/${page}` },
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;
  if (!(page in pages)) notFound();
  const content = pages[page as keyof typeof pages];
  return (
    <main id="main" lang="en" className="container content-page">
      <p className="eyebrow">SCAMVETO / {page.toUpperCase()}</p>
      <h1>{content.title}</h1>
      <p className="content-lead">{content.lead}</p>
      <article className="prose">
        {content.sections.map(([title, body]) => (
          <section key={title}>
            <h2>{title}</h2>
            <p>{body}</p>
          </section>
        ))}
        {page === "privacy" && (
          <p>
            Provider information:{" "}
            <a href="https://ai.google.dev/gemini-api/terms">
              Google AI service terms
            </a>
            ,{" "}
            <a href="https://cloud.google.com/terms/cloud-privacy-notice">
              Google Cloud privacy notice
            </a>
            , and{" "}
            <a href="https://www.cloudflare.com/privacypolicy/">
              Cloudflare privacy policy
            </a>
            .
          </p>
        )}
        <p>
          <Link href="/learn">Explore practical recovery guidance →</Link>
        </p>
      </article>
    </main>
  );
}
