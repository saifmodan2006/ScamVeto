"use client";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";
type TurnstileApi = {
  render: (el: HTMLElement, options: Record<string, unknown>) => string;
  remove: (id: string) => void;
};
declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}
export function Turnstile({
  onToken,
  resetKey,
}: {
  onToken: (token: string) => void;
  resetKey: number;
}) {
  const element = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const key = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  useEffect(() => {
    if (!ready || !key || !element.current || !window.turnstile) return;
    const api = window.turnstile;
    const id = api.render(element.current, {
      sitekey: key,
      theme: "dark",
      action: "analysis",
      callback: onToken,
      "expired-callback": () => onToken(""),
      "error-callback": () => onToken(""),
    });
    return () => api.remove(id);
  }, [ready, key, onToken, resetKey]);
  if (!key) return null;
  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        onReady={() => setReady(true)}
        strategy="afterInteractive"
      />
      <div ref={element} className="turnstile-widget" />
    </>
  );
}
