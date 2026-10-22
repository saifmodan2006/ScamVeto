"use client";
import { CyberButton } from "@/components/ui/button";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main id="main" className="container error-page">
      <p className="eyebrow">AN UNEXPECTED INTERRUPTION</p>
      <h1>Let’s try that again.</h1>
      <p>
        Something prevented this page from loading. Your submission has not been
        saved.
      </p>
      <CyberButton onClick={reset}>Try again</CyberButton>
    </main>
  );
}
