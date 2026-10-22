import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { articles } from "@/lib/education";
export const metadata = {
  title: "Safety hub",
  description:
    "Practical guidance for phishing, job offers, shopping fraud and account recovery.",
  alternates: { canonical: "/learn" },
};
export default function Page() {
  return (
    <main id="main" lang="en" className="content-page container">
      <p className="eyebrow">THE SAFETY HUB / KNOWLEDGE IS A GOOD DEFENSE</p>
      <h1>Build your digital instincts.</h1>
      <p className="content-lead">
        Understand the patterns. Make informed decisions. Find a practical next
        step when something goes wrong. This is general safety guidance, not a
        live threat feed.
      </p>
      <div className="learning-grid">
        {articles.map((a) => (
          <Link className="article-card" href={`/learn/${a.slug}`} key={a.slug}>
            <p className="mono green">{a.category}</p>
            <h2>{a.title}</h2>
            <p>{a.intro}</p>
            <span className="text-link">
              Read the guide <ArrowUpRight size={16} />
            </span>
          </Link>
        ))}
      </div>
      <Recovery />
    </main>
  );
}
export function Recovery() {
  return (
    <aside className="resource-panel">
      <h2>Money lost or an account at risk?</h2>
      <p>
        Contact your bank or service immediately through a known official
        channel. Preserve messages and payment records.
      </p>
      <p>
        In India, report financial cyber fraud promptly at{" "}
        <a href="tel:1930">1930</a> and the{" "}
        <a
          href="https://cybercrime.gov.in/"
          target="_blank"
          rel="noopener noreferrer"
        >
          National Cyber Crime Reporting Portal ↗
        </a>
        .
      </p>
      <p className="small">
        Official resource:{" "}
        <a href="https://i4c.mha.gov.in/ncrp.aspx">
          Indian Cyber Crime Coordination Centre
        </a>
        . Registry reviewed 22 October 2026. Outside India, use your local
        official reporting service.
      </p>
    </aside>
  );
}
