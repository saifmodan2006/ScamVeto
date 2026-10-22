import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Providers } from "@/components/providers";
import { Header, Footer } from "@/components/shell";
import "./globals.css";
const base = process.env.APP_BASE_URL;
export const metadata: Metadata = {
  metadataBase: new URL(base ?? "http://localhost:3000"),
  title: {
    default: "ScamVeto — Detect Deception. Stay Protected.",
    template: "%s | ScamVeto",
  },
  description:
    "Examine suspicious links, messages, job offers and shopping claims with privacy-conscious, evidence-based scam analysis.",
  openGraph: {
    title: "ScamVeto — Think before you click.",
    description: "A clearer picture. A more informed next step.",
    images: ["/opengraph-image"],
  },
  robots: { index: true, follow: true },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body>
        <Providers>
          <a className="skip-link" href="#main">
            Skip to content
          </a>
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
