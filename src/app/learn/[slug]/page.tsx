import { notFound } from "next/navigation";
import Link from "next/link";
import { articles } from "@/lib/education";
import { Recovery } from "../page";
export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const a = articles.find((x) => x.slug === slug);
  return {
    title: a?.title ?? "Guide not found",
    description: a?.intro,
    alternates: { canonical: `/learn/${slug}` },
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const a = articles.find((x) => x.slug === slug);
  if (!a) notFound();
  return (
    <main id="main" lang="en" className="container content-page">
      <Link href="/learn" className="text-link">
        ← Safety hub
      </Link>
      <p className="eyebrow">{a.category} / GENERAL GUIDANCE</p>
      <h1>{a.title}</h1>
      <p className="content-lead">{a.intro}</p>
      <article className="prose">
        {a.steps.map(([title, body]) => (
          <section key={title}>
            <h2>{title}</h2>
            <p>{body}</p>
          </section>
        ))}
        <p>
          Further guidance:{" "}
          <a href={a.source} target="_blank" rel="noopener noreferrer">
            official source ↗
          </a>
          . Reviewed 22 October 2026.
        </p>
        <Recovery />
        <p>
          <Link href="/check/message">Examine a suspicious message →</Link>
        </p>
      </article>
    </main>
  );
}
