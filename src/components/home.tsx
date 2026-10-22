"use client";
import Link from "next/link";
import {
  ArrowUpRight,
  ArrowRight,
  Link2,
  MessageSquare,
  BriefcaseBusiness,
  ShoppingBag,
  ScanLine,
  ShieldCheck,
  LockKeyhole,
  UserRoundCheck,
  ChevronDown,
  Fingerprint,
  Search,
  FileCheck2,
  TriangleAlert,
  Check,
  BookOpen,
} from "lucide-react";
import { useLocale } from "./providers";
import { CyberBackground, Radar, Terminal, Reveal } from "./cyber/visuals";
import { CyberButton } from "./ui/button";
export const tools = [
  { id: "url", key: "url", icon: Link2, code: "01", color: "green" },
  {
    id: "message",
    key: "message",
    icon: MessageSquare,
    code: "02",
    color: "cyan",
  },
  {
    id: "job",
    key: "job",
    icon: BriefcaseBusiness,
    code: "03",
    color: "violet",
  },
  { id: "shop", key: "shop", icon: ShoppingBag, code: "04", color: "amber" },
  {
    id: "screenshot",
    key: "screenshot",
    icon: ScanLine,
    code: "05",
    color: "blue",
  },
] as const;
export function Home() {
  const { t, locale } = useLocale();
  return (
    <main id="main">
      <section className="hero">
        <CyberBackground />
        <div className="container hero-layout">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="signal-dot" />
              {t.eyebrow}
            </div>
            <h1>
              {t.hero1}
              <br />
              <span>{t.hero2}</span>
            </h1>
            <p className="hero-description">{t.intro}</p>
            <div className="hero-actions">
              <CyberButton asChild>
                <Link href="/check/url">
                  <ShieldCheck size={19} />
                  {t.start}
                  <ArrowUpRight size={19} />
                </Link>
              </CyberButton>
              <Link className="text-link" href="#how">
                {t.how}
                <ArrowRight size={16} />
              </Link>
            </div>
            <div className="hero-assurances">
              <span>
                <UserRoundCheck size={15} />{" "}
                {locale === "en"
                  ? "No sign-up required"
                  : locale === "hi"
                    ? "लॉगिन ज़रूरी नहीं"
                    : "લોગિન જરૂરી નથી"}
              </span>
              <span>
                <LockKeyhole size={15} />
                {locale === "en"
                  ? "Private by default"
                  : locale === "hi"
                    ? "गोपनीयता पहले"
                    : "ગોપનીયતા પ્રથમ"}
              </span>
            </div>
          </div>
          <div className="hero-visual">
            <Radar />
            <Terminal />
          </div>
        </div>
        <div className="container hero-bottom">
          <span>
            <span className="green">[</span> THINK BEFORE YOU CLICK{" "}
            <span className="green">]</span>
          </span>
          <span>
            LESS UNCERTAINTY. MORE CONTROL. <span className="green">↘</span>
          </span>
        </div>
      </section>
      <div className="principles-strip">
        <div className="container">
          <span>
            <Fingerprint />
            Anonymous by design
          </span>
          <span>
            <Search />
            Evidence over assumptions
          </span>
          <span>
            <ShieldCheck />
            Powered by Gemini
          </span>
          <span>
            <LockKeyhole />
            Your data stays yours
          </span>
        </div>
      </div>
      <section id="tools" className="section container">
        <Reveal>
          <div className="section-heading">
            <div>
              <p className="eyebrow">01 / THE TOOLKIT</p>
              <h2>{t.choose}</h2>
              <p>{t.chooseSub}</p>
            </div>
            <span className="section-index">
              FIVE WAYS TO LOOK CLOSER <ArrowUpRight size={17} />
            </span>
          </div>
        </Reveal>
        <div className="tool-grid">
          {tools.map(({ id, key, icon: Icon, code, color }) => (
            <Reveal key={id}>
              <Link
                href={`/check/${id}`}
                className={`tool-card ${color}`}
                onPointerMove={(e) => {
                  if (e.pointerType === "mouse") {
                    const bounds = e.currentTarget.getBoundingClientRect();
                    e.currentTarget.style.setProperty(
                      "--pointer-x",
                      `${e.clientX - bounds.left}px`,
                    );
                    e.currentTarget.style.setProperty(
                      "--pointer-y",
                      `${e.clientY - bounds.top}px`,
                    );
                  }
                }}
              >
                <div className="tool-card-top">
                  <span className="tool-icon">
                    <Icon size={23} />
                  </span>
                  <span className="mono dim">/{code}</span>
                </div>
                <h3>{t[key]}</h3>
                <p>{t[`${key}Desc`]}</p>
                <div className="tool-card-bottom">
                  <span>OPEN CHECKER</span>
                  <ArrowUpRight size={20} />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
      <section id="how" className="section how-section">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">02 / FROM DOUBT TO DIRECTION</p>
              <h2>A little clarity goes a long way.</h2>
              <p>
                No technical background needed. Just the thing that made you
                pause.
              </p>
            </div>
            <span className="pill">SIMPLE INPUT. USEFUL CONTEXT.</span>
          </div>
          <div className="steps-grid">
            {[
              {
                n: "01",
                icon: ScanLine,
                title: "Bring your suspicion.",
                text: "Paste a link, message, or offer. Upload a screenshot and review the extracted text.",
              },
              {
                n: "02",
                icon: Search,
                title: "Look at the evidence.",
                text: "We combine URL and text checks, available threat intelligence, and Gemini interpretation.",
              },
              {
                n: "03",
                icon: FileCheck2,
                title: "Know your next move.",
                text: "Get understandable findings, honest limitations, and practical steps to verify independently.",
              },
            ].map(({ n, icon: Icon, title, text }) => (
              <div className="step" key={n}>
                <div className="step-top">
                  <span>{n}</span>
                  <Icon size={25} />
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section container clarity-layout">
        <div>
          <p className="eyebrow">03 / CLARITY, NOT FALSE CONFIDENCE</p>
          <h2>
            More than a warning.
            <br />
            <span className="muted">A reason behind it.</span>
          </h2>
          <p className="section-copy">
            A verdict without context doesn’t help you make a decision. Every
            ScamVeto report separates observed warning signs from known threat
            matches and tells you what couldn’t be checked.
          </p>
          <ul className="check-list">
            <li>
              <Check />
              Evidence you can understand
            </li>
            <li>
              <Check />
              No arbitrary “scam probability” scores
            </li>
            <li>
              <Check />
              Clear, actionable next steps
            </li>
          </ul>
          <CyberButton asChild variant="secondary">
            <Link href="/check/message">
              Take a closer look
              <ArrowUpRight size={17} />
            </Link>
          </CyberButton>
        </div>
        <div className="demo-report">
          <div className="panel-caption">
            <span>ANATOMY OF A REPORT</span>
            <span className="pill">ILLUSTRATIVE EXAMPLE</span>
          </div>
          <div className="demo-body">
            <div className="report-status amber">
              <TriangleAlert size={20} />
              Suspicious indicators
            </div>
            <h3>Pause. This request needs a closer look.</h3>
            <p>
              In this synthetic message, a recruiter asks for an upfront
              registration fee before arranging an interview.
            </p>
            <div className="example-quote">
              “Pay a registration fee to confirm your interview slot.”
            </div>
            <div className="demo-evidence">
              <span className="amber">01</span>
              <div>
                <strong>Advance payment request</strong>
                <p>Rule-based indicator · Strong signal</p>
              </div>
              <TriangleAlert size={17} />
            </div>
            <div className="demo-next">
              <span className="green">NEXT STEP</span>
              <p>
                Confirm the role through the employer’s official careers page
                before sending money.
              </p>
            </div>
            <p className="small muted">
              Demonstration only. No live provider check was performed.
            </p>
          </div>
        </div>
      </section>
      <section className="section container">
        <div className="privacy-panel">
          <div className="privacy-graphic" aria-hidden>
            <Fingerprint size={98} strokeWidth={0.8} />
            <span className="mono">PRIVACY IS A DEFAULT.</span>
          </div>
          <div>
            <p className="eyebrow">04 / LESS DATA. MORE PEACE OF MIND.</p>
            <h2>{t.privacy}</h2>
            <p>{t.privacyBody}</p>
            <Link className="text-link" href="/privacy">
              Read our privacy approach
              <ArrowUpRight size={16} />
            </Link>
          </div>
          <LockKeyhole className="privacy-corner" size={23} />
        </div>
      </section>
      <section className="section container">
        <div className="section-heading">
          <div>
            <p className="eyebrow">05 / BUILD YOUR DIGITAL INSTINCTS</p>
            <h2>Stay a step more aware.</h2>
          </div>
          <Link href="/learn" className="text-link">
            Explore the safety hub
            <ArrowUpRight size={17} />
          </Link>
        </div>
        <div className="learn-grid">
          {[
            {
              slug: "fake-job-offers",
              tag: "WORK & OPPORTUNITIES",
              title: "The offer looks perfect. Is the process?",
              text: "Know the warning signs before your next career move.",
            },
            {
              slug: "phishing",
              tag: "LINKS & MESSAGES",
              title: "A familiar logo isn’t proof of identity.",
              text: "Learn how phishing plays on recognition and urgency.",
            },
            {
              slug: "after-sharing-information",
              tag: "WHEN SOMETHING GOES WRONG",
              title: "Already clicked? Focus on what’s next.",
              text: "Practical recovery steps, without the judgment.",
            },
          ].map((a) => (
            <Link
              key={a.slug}
              href={`/learn/${a.slug}`}
              className="article-card"
            >
              <span className="mono green">{a.tag}</span>
              <BookOpen size={26} />
              <h3>{a.title}</h3>
              <p>{a.text}</p>
              <ArrowUpRight className="article-arrow" size={19} />
            </Link>
          ))}
        </div>
      </section>
      <section className="section container faq-layout">
        <div>
          <p className="eyebrow">06 / GOOD QUESTIONS</p>
          <h2>
            A few things
            <br />
            you should know.
          </h2>
        </div>
        <div className="faq-list">
          {[
            [
              "Can ScamVeto tell me something is definitely safe?",
              "No. A clean result means available checks did not find a known threat. New scams, missing context and provider gaps can limit any analysis. Always verify important requests independently.",
            ],
            [
              "What happens to what I submit?",
              "Anonymous reports are not saved by ScamVeto. Recognizable personal information is redacted before Gemini receives the text. Supported URLs, without query strings or credentials, may be sent to Google Web Risk. Screenshots stay in your browser.",
            ],
            [
              "Do I need an account?",
              "No. Basic checks are anonymous. Optional accounts and saved reports are future features; they are not required or enabled.",
            ],
            [
              "What if I have already sent money?",
              "Contact your bank immediately using an official channel, preserve messages and payment records, and report the incident. In India, call 1930 for financial cyber fraud and use cybercrime.gov.in.",
            ],
            [
              "What happens when a provider is unavailable?",
              "The report identifies completed and unavailable checks. Gemini failures return an incomplete report instead of a fabricated AI result.",
            ],
          ].map(([q, a]) => (
            <details key={q}>
              <summary>
                {q}
                <ChevronDown size={17} />
              </summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </section>
      <section className="container final-cta">
        <div>
          <p className="eyebrow">TRUST YOUR PAUSE.</p>
          <h2>
            Something feels off?
            <br />
            Let’s look closer.
          </h2>
        </div>
        <div>
          <CyberButton asChild>
            <Link href="/check/url">
              {t.start}
              <ArrowUpRight size={18} />
            </Link>
          </CyberButton>
          <p>No account needed. Just a moment of caution.</p>
        </div>
      </section>
    </main>
  );
}
