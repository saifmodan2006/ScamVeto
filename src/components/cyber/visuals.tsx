"use client";
import { useEffect, useRef } from "react";
function useDecorativeLifecycle() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let visible = true;
    const update = () =>
      el.classList.toggle("paused", document.hidden || !visible);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    });
    observer.observe(el);
    document.addEventListener("visibilitychange", update);
    update();
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, []);
  return ref;
}
export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="brand">
      <svg
        width="36"
        height="40"
        viewBox="0 0 36 40"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M18 2 33 8v12c0 9-10 15-15 18C13 35 3 29 3 20V8L18 2Z"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="m10 15 8 12 9-16M8 8h5M23 31v-4M3 19h5"
          stroke="currentColor"
          strokeWidth="2.4"
        />
        <circle cx="27" cy="11" r="2" fill="currentColor" />
      </svg>
      {!compact && (
        <span>
          Scam<span className="green">Veto</span>
          <span className="brand-period">.</span>
        </span>
      )}
    </span>
  );
}
export function CyberBackground() {
  const ref = useDecorativeLifecycle();
  return (
    <div ref={ref} className="cyber-background" aria-hidden="true">
      <div className="ambient" />
      <div className="grid-plane" />
    </div>
  );
}
export function Radar() {
  const ref = useDecorativeLifecycle();
  return (
    <div ref={ref} className="radar-scene" lang="en">
      <div className="radar-label">
        <span className="signal-dot" /> SIGNAL INTELLIGENCE{" "}
        <span>ILLUSTRATION</span>
      </div>
      <div className="radar">
        <div className="radar-cross" />
        <div className="radar-sweep" />
        {[0, 1, 2, 3].map((i) => (
          <i key={i} className={`radar-ring ring-${i}`} />
        ))}
        <span className="radar-point point-a" />
        <span className="radar-point point-b" />
        <span className="radar-point point-c" />
        <div className="radar-core">
          <Logo compact />
        </div>
        <span className="radar-axis n">N</span>
        <span className="radar-axis e">E</span>
        <span className="radar-axis s">S</span>
        <span className="radar-axis w">W</span>
      </div>
      <div className="radar-tag tag-a">
        <span className="small-dot" /> EVIDENCE, BEFORE ASSUMPTIONS
      </div>
      <div className="radar-tag tag-b">01 / OBSERVE &nbsp; 02 / UNDERSTAND</div>
    </div>
  );
}
export function Terminal() {
  const ref = useDecorativeLifecycle();
  return (
    <div ref={ref} className="terminal" lang="en">
      <div className="terminal-bar">
        <span>
          <i />
          <i />
          <i />
        </span>
        <span>scamveto / security-console</span>
        <span>⌘</span>
      </div>
      <div className="terminal-content">
        <p>
          <span>❯</span> initializing scamveto<span className="dim">_</span>
        </p>
        <p>
          <span>✓</span> anonymous checking ready
        </p>
        <p>
          <span>✓</span> privacy protections active
        </p>
        <p className="terminal-last">
          <span>❯</span> awaiting your next check
          <span className="cursor" />
        </p>
      </div>
    </div>
  );
}
export function Reveal({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}
