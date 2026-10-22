"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Menu, X, Globe, ShieldCheck } from "lucide-react";
import { useLocale } from "./providers";
import { Logo } from "./cyber/visuals";
import { CyberButton } from "./ui/button";
import type { Locale } from "@/lib/validation/schemas";
export function Header() {
  const { t, locale, setLocale } = useLocale();
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" aria-label="ScamVeto home">
          <Logo />
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          <Link href="/#tools">{t.tools}</Link>
          <Link href="/#how">{t.how}</Link>
          <Link href="/learn">{t.learn}</Link>
        </nav>
        <div className="header-actions">
          <label className="language">
            <Globe size={15} aria-hidden />
            <span className="sr-only">Language</span>
            <select
              value={locale}
              onChange={(e) => setLocale(e.target.value as Locale)}
            >
              <option value="en">EN</option>
              <option value="hi">हिन्दी</option>
              <option value="gu">ગુજરાતી</option>
            </select>
          </label>
          <CyberButton asChild className="nav-cta">
            <Link href="/check/url">
              {t.start}
              <ArrowUpRight size={16} />
            </Link>
          </CyberButton>
          <button
            className="icon-button mobile-toggle"
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {open && (
        <nav
          id="mobile-navigation"
          className="mobile-nav"
          aria-label="Mobile navigation"
        >
          {[
            ["/#tools", t.tools],
            ["/#how", t.how],
            ["/learn", t.learn],
            ["/about", t.about],
            ["/check/url", t.start],
          ].map(([href, label]) => (
            <Link key={href} href={href} onClick={() => setOpen(false)}>
              {label}
              <ArrowUpRight size={16} />
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
export function Footer() {
  const { t } = useLocale();
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div>
            <Link href="/" aria-label="ScamVeto home">
              <Logo />
            </Link>
            <p>Detect Deception. Stay Protected.</p>
          </div>
          <div className="footer-links">
            <Link href="/learn">{t.learn}</Link>
            <Link href="/about">{t.about}</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} ScamVeto. Built for more informed
            decisions.
          </span>
          <span>
            <ShieldCheck size={14} /> A check is a starting point. Always verify
            independently.
          </span>
        </div>
      </div>
    </footer>
  );
}
